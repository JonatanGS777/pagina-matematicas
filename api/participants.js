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
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { 
            page = 1, 
            limit = 50, 
            category = '', 
            grade = '',
            sortBy = 'recent',
            includeStats = 'true'
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Obtener lista de IDs de participantes
        const participantIds = await redisOperation(async (client) => {
            return await client.lRange('participants:list', 0, -1);
        });
        
        if (!participantIds || participantIds.length === 0) {
            return res.status(200).json({
                participants: [],
                pagination: {
                    total: 0,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: 0
                },
                statistics: includeStats === 'true' ? await getStatistics() : null
            });
        }

        // Obtener datos completos de los participantes
        const participants = [];
        for (const id of participantIds) {
            try {
                const participant = await redisOperation(async (client) => {
                    const data = await client.get(`participant:id:${id}`);
                    return data ? JSON.parse(data) : null;
                });
                if (participant) {
                    participants.push(participant);
                }
            } catch (error) {
                console.warn(`Error obteniendo participante ${id}:`, error);
            }
        }

        // Filtrar participantes activos y aplicar filtros
        let filteredParticipants = participants
            .filter(participant => participant && participant.status === 'active');

        // Aplicar filtros
        if (category) {
            filteredParticipants = filteredParticipants.filter(p => 
                p.category && p.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (grade) {
            filteredParticipants = filteredParticipants.filter(p => 
                p.grade && p.grade.toLowerCase() === grade.toLowerCase()
            );
        }

        // Aplicar ordenamiento
        switch (sortBy) {
            case 'recent':
                filteredParticipants.sort((a, b) => 
                    new Date(b.registrationDate) - new Date(a.registrationDate)
                );
                break;
            case 'oldest':
                filteredParticipants.sort((a, b) => 
                    new Date(a.registrationDate) - new Date(b.registrationDate)
                );
                break;
            case 'name':
                filteredParticipants.sort((a, b) => 
                    a.fullName.localeCompare(b.fullName)
                );
                break;
            case 'category':
                filteredParticipants.sort((a, b) => 
                    a.category.localeCompare(b.category)
                );
                break;
            case 'grade':
                filteredParticipants.sort((a, b) => 
                    a.grade.localeCompare(b.grade)
                );
                break;
            default:
                // Por defecto, más recientes primero
                filteredParticipants.sort((a, b) => 
                    new Date(b.registrationDate) - new Date(a.registrationDate)
                );
        }

        // Aplicar paginación
        const total = filteredParticipants.length;
        const totalPages = Math.ceil(total / limitNum);
        const paginatedParticipants = filteredParticipants.slice(offset, offset + limitNum);

        // Limpiar datos sensibles para la respuesta pública
        const safeParticipants = paginatedParticipants.map(participant => ({
            id: participant.id,
            fullName: participant.fullName,
            age: participant.age,
            grade: participant.grade,
            school: participant.school,
            category: participant.category,
            experience: participant.experience,
            registrationDate: participant.registrationDate,
            role: participant.role,
            // No incluir email por privacidad
            initials: participant.fullName.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase()
        }));

        // Preparar respuesta
        const response = {
            participants: safeParticipants,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        };

        // Incluir estadísticas si se solicitaron
        if (includeStats === 'true') {
            response.statistics = await getStatistics();
        }

        res.status(200).json(response);

    } catch (error) {
        console.error('Error obteniendo participantes:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudieron cargar los participantes'
        });
    }
}

// Función auxiliar para obtener estadísticas
async function getStatistics() {
    try {
        // Obtener estadísticas generales
        const generalStats = await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
        
        // Obtener estadísticas del día actual
        const today = new Date().toISOString().split('T')[0];
        const dailyStats = await redisOperation(async (client) => {
            const data = await client.get(`stats:daily:${today}`);
            return data ? JSON.parse(data) : { registrations: 0 };
        });
        
        // Obtener estadísticas de la semana
        const weeklyStats = await getWeeklyStats();
        
        // Obtener distribución por categorías
        const categoryStats = await getCategoryDistribution();

        return {
            total: generalStats.totalParticipants || 0,
            estudiantes: generalStats.estudiantes || 0,
            maestros: generalStats.maestros || 0,
            padres: generalStats.padres || 0,
            otros: generalStats.otros || 0,
            today: dailyStats.registrations || 0,
            thisWeek: weeklyStats,
            categories: categoryStats,
            lastUpdated: generalStats.lastUpdated
        };
        
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return {
            total: 0,
            estudiantes: 0,
            maestros: 0,
            padres: 0,
            otros: 0,
            today: 0,
            thisWeek: 0,
            categories: {},
            lastUpdated: null
        };
    }
}

// Función auxiliar para obtener estadísticas semanales
async function getWeeklyStats() {
    try {
        const today = new Date();
        let weeklyTotal = 0;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayStats = await redisOperation(async (client) => {
                const data = await client.get(`stats:daily:${dateStr}`);
                return data ? JSON.parse(data) : null;
            });
            
            if (dayStats) {
                weeklyTotal += dayStats.registrations || 0;
            }
        }
        
        return weeklyTotal;
    } catch (error) {
        console.error('Error obteniendo estadísticas semanales:', error);
        return 0;
    }
}

// Función auxiliar para obtener distribución por categorías
async function getCategoryDistribution() {
    try {
        // Obtener IDs de participantes (limitar para performance)
        const participantIds = await redisOperation(async (client) => {
            return await client.lRange('participants:list', 0, 100);
        });
        
        const distribution = { novato: 0, intermedio: 0, avanzado: 0 };
        
        for (const id of participantIds) {
            try {
                const participant = await redisOperation(async (client) => {
                    const data = await client.get(`participant:id:${id}`);
                    return data ? JSON.parse(data) : null;
                });
                
                if (participant && participant.category) {
                    distribution[participant.category] = (distribution[participant.category] || 0) + 1;
                }
            } catch (error) {
                // Continuar con el siguiente participante si hay error
                continue;
            }
        }
        
        return distribution;
    } catch (error) {
        console.error('Error obteniendo distribución de categorías:', error);
        return { novato: 0, intermedio: 0, avanzado: 0 };
    }
}