import { createClient } from 'redis';

// Configuración que detecta automáticamente TLS vs no-TLS
let redis = null;
let isConnected = false;

async function createRedisClient() {
    const redisUrl = process.env.OLIMPIADAS_KV_REDIS_URL;
    
    if (!redisUrl) {
        throw new Error('Variable de entorno OLIMPIADAS_KV_REDIS_URL no encontrada');
    }

    console.log('🔄 Conectando a Redis Cloud...');
    console.log('📍 Host:', redisUrl.split('@')[1]); // Log del host sin password

    // Detectar si la URL usa TLS o no
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

        // Solo agregar configuración TLS si la URL lo requiere
        if (usesTLS) {
            clientConfig.socket.tls = true;
            clientConfig.socket.rejectUnauthorized = false; // Para certificados self-signed
        }

        redis = createClient(clientConfig);

        // Event listeners
        redis.on('error', (err) => {
            console.error('❌ Redis Error:', err.message);
            isConnected = false;
        });

        redis.on('connect', () => {
            console.log('🔗 Redis conectando...');
        });

        redis.on('ready', () => {
            console.log('✅ Redis conectado exitosamente');
            isConnected = true;
        });

        redis.on('end', () => {
            console.log('🔌 Redis desconectado');
            isConnected = false;
        });

        return redis;
    } catch (error) {
        console.error('❌ Error creando cliente Redis:', error);
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
        console.error('❌ Error conectando a Redis:', error);
        isConnected = false;
        throw error;
    }
}

// Wrapper para operaciones Redis con mejor error handling
async function redisOperation(operation) {
    try {
        const client = await connectRedis();
        return await operation(client);
    } catch (error) {
        console.error('🚨 Error en operación Redis:', error.message);
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

        console.log('📡 Obteniendo participantes...');
        
        // Obtener lista de IDs de participantes
        const participantIds = await redisOperation(async (client) => {
            return await client.lRange('participants:list', 0, -1);
        });
        
        console.log(`📊 Encontrados ${participantIds?.length || 0} IDs de participantes`);
        
        if (!participantIds || participantIds.length === 0) {
            return res.status(200).json({
                participants: [],
                pagination: {
                    total: 0,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: 0
                },
                statistics: includeStats === 'true' ? await getStatistics() : null,
                source: 'redis_cloud_empty',
                timestamp: new Date().toISOString()
            });
        }

        // Obtener datos completos de los participantes
        const participants = [];
        
        for (const id of participantIds) {
            try {
                const participantData = await redisOperation(async (client) => {
                    const data = await client.get(`participant:id:${id}`);
                    return data ? JSON.parse(data) : null;
                });
                
                if (participantData && participantData.status === 'active') {
                    participants.push(participantData);
                }
            } catch (error) {
                console.warn(`⚠️ Error obteniendo participante ${id}:`, error.message);
            }
        }

        // Aplicar filtros
        let filteredParticipants = [...participants];

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
            },
            source: 'redis_cloud',
            timestamp: new Date().toISOString()
        };

        // Incluir estadísticas si se solicitaron
        if (includeStats === 'true') {
            response.statistics = await getStatistics();
        }

        console.log('✅ Respuesta enviada exitosamente');
        res.status(200).json(response);

    } catch (error) {
        console.error('💥 Error obteniendo participantes:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudieron cargar los participantes',
            details: error.message,
            timestamp: new Date().toISOString()
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

// Cleanup al cerrar
process.on('SIGTERM', async () => {
    if (redis && isConnected) {
        await redis.quit();
    }
});