import { createClient } from 'redis';

// Crear cliente Redis para Redis Cloud
const redis = createClient({
    url: process.env.OLIMPIADAS_KV_REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false
    }
});

let isConnected = false;

async function connectRedis() {
    if (!isConnected) {
        try {
            await redis.connect();
            isConnected = true;
            console.log('✅ Conectado a Redis Cloud');
        } catch (error) {
            console.error('❌ Error conectando a Redis:', error);
            throw error;
        }
    }
}

async function redisOperation(operation) {
    try {
        await connectRedis();
        return await operation(redis);
    } catch (error) {
        console.error('Error en operación Redis:', error);
        isConnected = false;
        throw error;
    }
}

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const {
            fullName,
            email,
            age,
            grade,
            school,
            category,
            experience,
            motivation,
            role = 'estudiante'
        } = req.body;

        // Validaciones básicas
        if (!fullName || !email || !age || !grade || !category) {
            return res.status(400).json({ 
                error: 'Campos requeridos faltantes',
                required: ['fullName', 'email', 'age', 'grade', 'category']
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }

        // Validar rango de edad
        if (age < 10 || age > 25) {
            return res.status(400).json({ error: 'La edad debe estar entre 10 y 25 años' });
        }

        // Verificar si el email ya está registrado
        const existingParticipant = await redisOperation(async (client) => {
            const data = await client.get(`participant:${email}`);
            return data ? JSON.parse(data) : null;
        });

        if (existingParticipant) {
            return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Crear el objeto del participante
        const participant = {
            id: `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            age: parseInt(age),
            grade,
            school: school || 'No especificado',
            category,
            experience: experience || 'No especificado',
            motivation: motivation || 'No especificado',
            role,
            registrationDate: new Date().toISOString(),
            status: 'active'
        };

        // Guardar en Redis Cloud
        await redisOperation(async (client) => {
            // Guardar participante individual
            await client.set(`participant:${participant.email}`, JSON.stringify(participant));
            
            // Agregar a la lista de participantes
            await client.lPush('participants:list', participant.id);
            
            // Guardar por ID para acceso rápido
            await client.set(`participant:id:${participant.id}`, JSON.stringify(participant));
        });

        // Actualizar estadísticas
        await updateStatistics(role);

        // Logs para debugging
        console.log('Nuevo participante registrado:', {
            id: participant.id,
            email: participant.email,
            category: participant.category,
            timestamp: participant.registrationDate
        });

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Registro exitoso',
            participant: {
                id: participant.id,
                fullName: participant.fullName,
                category: participant.category,
                registrationDate: participant.registrationDate
            }
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo procesar el registro. Por favor intente nuevamente.'
        });
    }
}

// Función auxiliar para actualizar estadísticas
async function updateStatistics(role) {
    try {
        // Obtener estadísticas actuales
        const currentStats = await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
        
        // Actualizar contadores
        const updatedStats = {
            ...currentStats,
            totalParticipants: (currentStats.totalParticipants || 0) + 1,
            estudiantes: role === 'estudiante' ? (currentStats.estudiantes || 0) + 1 : (currentStats.estudiantes || 0),
            maestros: role === 'maestro' ? (currentStats.maestros || 0) + 1 : (currentStats.maestros || 0),
            padres: role === 'padre' ? (currentStats.padres || 0) + 1 : (currentStats.padres || 0),
            otros: role === 'otros' ? (currentStats.otros || 0) + 1 : (currentStats.otros || 0),
            lastUpdated: new Date().toISOString()
        };

        // Actualizar estadísticas del día
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `stats:daily:${today}`;
        
        const dailyStats = await redisOperation(async (client) => {
            const data = await client.get(dailyKey);
            return data ? JSON.parse(data) : { registrations: 0 };
        });
        
        dailyStats.registrations += 1;
        
        // Guardar estadísticas actualizadas
        await redisOperation(async (client) => {
            await client.set('site:statistics', JSON.stringify(updatedStats));
            await client.set(dailyKey, JSON.stringify(dailyStats));
            // Establecer expiración para las estadísticas diarias (30 días)
            await client.expire(dailyKey, 30 * 24 * 60 * 60);
        });

    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
        // No fallar el registro si hay error en estadísticas
    }
}