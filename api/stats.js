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

    try {
        if (req.method === 'GET') {
            // Obtener estadísticas actuales
            const stats = await getCompleteStatistics();
            res.status(200).json(stats);
            
        } else if (req.method === 'POST') {
            // Actualizar estadísticas (para uso interno o votaciones)
            const { action, role, value } = req.body;
            
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
        console.error('Error en API de estadísticas:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener las estadísticas'
        });
    }
}

// Función para obtener estadísticas completas
async function getCompleteStatistics() {
    try {
        const [
            siteStats,
            visitorStats,
            olympicsStats,
            roleVotes
        ] = await Promise.all([
            getSiteStatistics(),
            getVisitorStatistics(),
            getOlympicsStatistics(),
            getRoleVotes()
        ]);

        return {
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
            lastUpdated: new Date().toISOString(),
            serverTime: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Error obteniendo estadísticas completas:', error);
        return getDefaultStatistics();
    }
}

// Función para obtener estadísticas del sitio
async function getSiteStatistics() {
    try {
        return await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas del sitio:', error);
        return {};
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
        
    } catch (error) {
        console.error('Error procesando voto de rol:', error);
        throw error;
    }
}

// Función para incrementar contador de visitantes
async function incrementVisitors() {
    try {
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
            await client.set(totalKey, currentTotal + 1);
            await client.set(dailyKey, currentDaily + 1);
            // Establecer expiración para estadísticas diarias (30 días)
            await client.expire(dailyKey, 30 * 24 * 60 * 60);
        });
        
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