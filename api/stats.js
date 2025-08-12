import { createClient } from 'redis';

// Configuración para tu Redis Cloud específico
let redis = null;
let isConnected = false;

async function createRedisClient() {
    const redisUrl = process.env.OLIMPIADAS_KV_REDIS_URL;
    
    if (!redisUrl) {
        throw new Error('Variable de entorno OLIMPIADAS_KV_REDIS_URL no encontrada');
    }

    console.log('🔄 Conectando a Redis Cloud para estadísticas...');
    
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
            console.error('❌ Redis Error (stats):', err.message);
            isConnected = false;
        });

        redis.on('ready', () => {
            console.log('✅ Redis listo para estadísticas');
            isConnected = true;
        });

        redis.on('end', () => {
            console.log('🔌 Redis desconectado (stats)');
            isConnected = false;
        });

        return redis;
    } catch (error) {
        console.error('❌ Error creando cliente Redis (stats):', error);
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
        console.error('❌ Error conectando a Redis (stats):', error);
        isConnected = false;
        throw error;
    }
}

async function redisOperation(operation) {
    try {
        const client = await connectRedis();
        return await operation(client);
    } catch (error) {
        console.error('🚨 Error en operación Redis (stats):', error.message);
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

    try {
        if (req.method === 'GET') {
            console.log('📊 Obteniendo estadísticas completas...');
            
            // Obtener estadísticas actuales
            const stats = await getCompleteStatistics();
            
            console.log('✅ Estadísticas obtenidas:', {
                participantes: stats.participantesOlimpiadas,
                estudiantes: stats.estudiantes,
                total: stats.visitantes
            });
            
            res.status(200).json(stats);
            
        } else if (req.method === 'POST') {
            // Actualizar estadísticas (para uso interno o votaciones)
            const { action, role, value } = req.body;
            
            console.log(`📝 Acción de estadísticas: ${action}, rol: ${role}`);
            
            if (action === 'vote' && role) {
                await handleRoleVote(role);
                const updatedStats = await getCompleteStatistics();
                res.status(200).json(updatedStats);
                
            } else if (action === 'increment_visitors') {
                await incrementVisitors();
                const updatedStats = await getCompleteStatistics();
                res.status(200).json(updatedStats);
                
            } else {
                res.status(400).json({ error: 'Acción no válida' });
            }
            
        } else {
            res.status(405).json({ error: 'Método no permitido' });
        }
        
    } catch (error) {
        console.error('💥 Error en API de estadísticas:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener las estadísticas',
            details: error.message
        });
    }
}

// Función para obtener estadísticas completas
async function getCompleteStatistics() {
    try {
        console.log('🔍 Compilando estadísticas...');
        
        // Obtener estadísticas generales del sitio
        const siteStats = await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
        
        // Obtener estadísticas de visitantes
        const visitorStats = await getVisitorStatistics();
        
        // Obtener estadísticas de olimpiadas
        const olympicsStats = await getOlympicsStatistics();
        
        // Obtener votaciones de roles
        const roleVotes = await getRoleVotes();

        const completeStats = {
            // Estadísticas de visitantes
            visitantes: visitorStats.total || 0,
            visitantesHoy: visitorStats.today || 0,
            visitantesSemana: visitorStats.thisWeek || 0,
            
            // Estadísticas de usuarios registrados
            estudiantes: siteStats.estudiantes || 0,
            maestros: siteStats.maestros || 0,
            padres: siteStats.padres || 0,
            otros: siteStats.otros || 0,
            
            // Estadísticas de olimpiadas
            participantesOlimpiadas: olympicsStats.total || 0,
            registrosHoy: olympicsStats.today || 0,
            
            // Votaciones de roles
            roleVotes: roleVotes,
            
            // Metadatos
            lastUpdated: siteStats.lastUpdated || new Date().toISOString(),
            serverTime: new Date().toISOString()
        };
        
        console.log('📈 Estadísticas compiladas exitosamente');
        return completeStats;
        
    } catch (error) {
        console.error('Error obteniendo estadísticas completas:', error);
        return getDefaultStatistics();
    }
}

// Función para obtener estadísticas de visitantes
async function getVisitorStatistics() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const [totalVisitors, todayVisitors] = await Promise.all([
            redisOperation(async (client) => {
                const data = await client.get('visitors:total');
                return data ? parseInt(data) : 0;
            }),
            redisOperation(async (client) => {
                const data = await client.get(`visitors:daily:${today}`);
                return data ? parseInt(data) : 0;
            })
        ]);

        // Calcular visitantes de la semana
        let weeklyVisitors = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayVisitors = await redisOperation(async (client) => {
                const data = await client.get(`visitors:daily:${dateStr}`);
                return data ? parseInt(data) : 0;
            });
            
            weeklyVisitors += dayVisitors;
        }

        return {
            total: totalVisitors,
            today: todayVisitors,
            thisWeek: weeklyVisitors
        };
        
    } catch (error) {
        console.error('Error obteniendo estadísticas de visitantes:', error);
        return { total: 0, today: 0, thisWeek: 0 };
    }
}

// Función para obtener estadísticas específicas de olimpiadas
async function getOlympicsStatistics() {
    try {
        // Contar participantes totales
        const participantIds = await redisOperation(async (client) => {
            return await client.lRange('participants:list', 0, -1);
        });
        
        const total = participantIds ? participantIds.length : 0;
        
        // Contar registros de hoy
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await redisOperation(async (client) => {
            const data = await client.get(`stats:daily:${today}`);
            return data ? JSON.parse(data) : { registrations: 0 };
        });
        
        return {
            total,
            today: todayStats.registrations || 0
        };
        
    } catch (error) {
        console.error('Error obteniendo estadísticas de olimpiadas:', error);
        return { total: 0, today: 0 };
    }
}

// Función para obtener votaciones de roles
async function getRoleVotes() {
    try {
        const [estudiantes, maestros, padres, otros] = await Promise.all([
            redisOperation(async (client) => {
                const data = await client.get('role:votes:estudiantes');
                return data ? parseInt(data) : 0;
            }),
            redisOperation(async (client) => {
                const data = await client.get('role:votes:maestros');
                return data ? parseInt(data) : 0;
            }),
            redisOperation(async (client) => {
                const data = await client.get('role:votes:padres');
                return data ? parseInt(data) : 0;
            }),
            redisOperation(async (client) => {
                const data = await client.get('role:votes:otros');
                return data ? parseInt(data) : 0;
            })
        ]);

        return {
            estudiantes,
            maestros,
            padres,
            otros
        };
        
    } catch (error) {
        console.error('Error obteniendo votaciones de roles:', error);
        return { estudiantes: 0, maestros: 0, padres: 0, otros: 0 };
    }
}

// Función para manejar votaciones de roles
async function handleRoleVote(role) {
    try {
        const validRoles = ['estudiantes', 'maestros', 'padres', 'otros'];
        if (!validRoles.includes(role)) {
            throw new Error('Rol no válido');
        }

        console.log(`🗳️ Procesando voto para rol: ${role}`);

        const voteKey = `role:votes:${role}`;
        
        const currentVotes = await redisOperation(async (client) => {
            const data = await client.get(voteKey);
            return data ? parseInt(data) : 0;
        });
        
        await redisOperation(async (client) => {
            await client.set(voteKey, currentVotes + 1);
        });
        
        // También actualizar las estadísticas generales
        const currentStats = await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
        
        currentStats[role] = (currentStats[role] || 0) + 1;
        currentStats.lastUpdated = new Date().toISOString();
        
        await redisOperation(async (client) => {
            await client.set('site:statistics', JSON.stringify(currentStats));
        });
        
        console.log(`✅ Voto para ${role} procesado exitosamente`);
        
    } catch (error) {
        console.error('Error procesando voto de rol:', error);
        throw error;
    }
}

// Función para incrementar contador de visitantes
async function incrementVisitors() {
    try {
        console.log('👥 Incrementando contador de visitantes...');
        
        const today = new Date().toISOString().split('T')[0];
        const totalKey = 'visitors:total';
        const dailyKey = `visitors:daily:${today}`;
        
        const [currentTotal, currentDaily] = await Promise.all([
            redisOperation(async (client) => {
                const data = await client.get(totalKey);
                return data ? parseInt(data) : 0;
            }),
            redisOperation(async (client) => {
                const data = await client.get(dailyKey);
                return data ? parseInt(data) : 0;
            })
        ]);
        
        await redisOperation(async (client) => {
            const pipeline = client.multi();
            
            pipeline.set(totalKey, currentTotal + 1);
            pipeline.set(dailyKey, currentDaily + 1);
            pipeline.expire(dailyKey, 30 * 24 * 60 * 60); // 30 días
            
            await pipeline.exec();
        });
        
        console.log('✅ Contador de visitantes actualizado');
        
    } catch (error) {
        console.error('Error incrementando visitantes:', error);
        throw error;
    }
}

// Función para obtener estadísticas por defecto en caso de error
function getDefaultStatistics() {
    return {
        visitantes: 0,
        visitantesHoy: 0,
        visitantesSemana: 0,
        estudiantes: 0,
        maestros: 0,
        padres: 0,
        otros: 0,
        participantesOlimpiadas: 0,
        registrosHoy: 0,
        roleVotes: {
            estudiantes: 0,
            maestros: 0,
            padres: 0,
            otros: 0
        },
        lastUpdated: new Date().toISOString(),
        serverTime: new Date().toISOString()
    };
}

// Cleanup al cerrar
process.on('SIGTERM', async () => {
    if (redis && isConnected) {
        await redis.quit();
    }
});