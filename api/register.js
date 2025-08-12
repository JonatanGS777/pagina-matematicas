import { createClient } from 'redis';

// Configuración para tu Redis Cloud específico
let redis = null;
let isConnected = false;

async function createRedisClient() {
    const redisUrl = process.env.OLIMPIADAS_KV_REDIS_URL;
    
    if (!redisUrl) {
        throw new Error('Variable de entorno OLIMPIADAS_KV_REDIS_URL no encontrada');
    }

    console.log('🔄 Conectando a Redis Cloud para registro...');
    
    const usesTLS = redisUrl.startsWith('rediss://');
    
    try {
        const clientConfig = {
            url: redisUrl,
            socket: {
                connectTimeout: 10000,
                lazyConnect: true
            },
            retry_delay_on_failover: 100,
            enable_offline_queue: false
        };

        if (usesTLS) {
            clientConfig.socket.tls = true;
            clientConfig.socket.rejectUnauthorized = false;
        }

        redis = createClient(clientConfig);

        redis.on('error', (err) => {
            console.error('❌ Redis Error (register):', err.message);
            isConnected = false;
        });

        redis.on('ready', () => {
            console.log('✅ Redis listo para registros');
            isConnected = true;
        });

        redis.on('end', () => {
            console.log('🔌 Redis desconectado (register)');
            isConnected = false;
        });

        return redis;
    } catch (error) {
        console.error('❌ Error creando cliente Redis (register):', error);
        throw error;
    }
}

async function connectRedis() {
    if (isConnected && redis) {
        return redis;
    }

    try {
        if (!redis) {
            redis = await createRedisClient();
        }

        if (!isConnected) {
            await redis.connect();
        }

        return redis;
    } catch (error) {
        console.error('❌ Error conectando a Redis (register):', error);
        isConnected = false;
        throw error;
    }
}

async function redisOperation(operation) {
    try {
        const client = await connectRedis();
        return await operation(client);
    } catch (error) {
        console.error('🚨 Error en operación Redis (register):', error.message);
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
        console.log('📝 Nuevo intento de registro...');
        
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
            console.log('❌ Campos faltantes en registro');
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
        const ageNum = parseInt(age);
        if (ageNum < 10 || ageNum > 25) {
            return res.status(400).json({ error: 'La edad debe estar entre 10 y 25 años' });
        }

        console.log(`👤 Registrando: ${fullName} (${email})`);

        // Verificar si el email ya está registrado
        const existingParticipant = await redisOperation(async (client) => {
            const data = await client.get(`participant:${email.toLowerCase()}`);
            return data ? JSON.parse(data) : null;
        });

        if (existingParticipant) {
            console.log('⚠️ Email ya registrado:', email);
            return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Crear el objeto del participante
        const participant = {
            id: `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            age: ageNum,
            grade,
            school: school || 'No especificado',
            category,
            experience: experience || 'No especificado',
            motivation: motivation || 'No especificado',
            role,
            registrationDate: new Date().toISOString(),
            status: 'active'
        };

        console.log(`💾 Guardando participante con ID: ${participant.id}`);

        // Guardar en Redis Cloud
        await redisOperation(async (client) => {
            // Usar pipeline para operaciones atómicas
            const pipeline = client.multi();
            
            // Guardar participante por email
            pipeline.set(`participant:${participant.email}`, JSON.stringify(participant));
            
            // Guardar participante por ID
            pipeline.set(`participant:id:${participant.id}`, JSON.stringify(participant));
            
            // Agregar a la lista de participantes
            pipeline.lPush('participants:list', participant.id);
            
            // Ejecutar todas las operaciones
            await pipeline.exec();
        });

        console.log('✅ Participante guardado en Redis');

        // Actualizar estadísticas
        await updateStatistics(role);
        
        console.log('📊 Estadísticas actualizadas');

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

        console.log(`🎉 Registro completado exitosamente: ${participant.fullName}`);

    } catch (error) {
        console.error('💥 Error en el registro:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudo procesar el registro. Por favor intente nuevamente.',
            details: error.message
        });
    }
}

// Función auxiliar para actualizar estadísticas
async function updateStatistics(role) {
    try {
        console.log('📈 Actualizando estadísticas...');
        
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
        dailyStats.lastUpdate = new Date().toISOString();
        
        // Guardar estadísticas actualizadas
        await redisOperation(async (client) => {
            const pipeline = client.multi();
            
            pipeline.set('site:statistics', JSON.stringify(updatedStats));
            pipeline.set(dailyKey, JSON.stringify(dailyStats));
            pipeline.expire(dailyKey, 30 * 24 * 60 * 60); // 30 días
            
            await pipeline.exec();
        });

        console.log('✅ Estadísticas actualizadas exitosamente');

    } catch (error) {
        console.error('⚠️ Error actualizando estadísticas:', error);
        // No fallar el registro si hay error en estadísticas
    }
}

// Cleanup al cerrar
process.on('SIGTERM', async () => {
    if (redis && isConnected) {
        await redis.quit();
    }
});