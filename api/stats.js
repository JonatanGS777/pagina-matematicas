import { Redis } from '@vercel/kv';

// 🔹 CONEXIÓN NUEVA A TU BASE OLIMPIADAS
const kv = new Redis({
  url: process.env.OLIMPIADAS_KV_REDIS_URL
});

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
            kv.get('site:statistics') || {},
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

// Función para obtener estadísticas de visitantes
async function getVisitorStatistics() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [totalVisitors, todayVisitors] = await Promise.all([
            kv.get('visitors:total') || 0,
            kv.get(`visitors:daily:${today}`) || 0
        ]);

        // Calcular visitantes de la semana
        let weeklyVisitors = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayVisitors = await kv.get(`visitors:daily:${dateStr}`) || 0;
            weeklyVisitors += parseInt(dayVisitors);
        }

        return {
            total: parseInt(totalVisitors),
            today: parseInt(todayVisitors),
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
        const participantIds = await kv.lrange('participants:list', 0, -1);
        const total = participantIds ? participantIds.length : 0;
        
        // Contar registros de hoy
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await kv.get(`stats:daily:${today}`) || { registrations: 0 };
        
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
            kv.get('role:votes:estudiantes') || 0,
            kv.get('role:votes:maestros') || 0,
            kv.get('role:votes:padres') || 0,
            kv.get('role:votes:otros') || 0
        ]);

        return {
            estudiantes: parseInt(estudiantes),
            maestros: parseInt(maestros),
            padres: parseInt(padres),
            otros: parseInt(otros)
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
        const currentVotes = await kv.get(voteKey) || 0;
        await kv.set(voteKey, parseInt(currentVotes) + 1);
        
        // También actualizar las estadísticas generales
        const statsKey = 'site:statistics';
        const currentStats = await kv.get(statsKey) || {};
        currentStats[role] = (currentStats[role] || 0) + 1;
        currentStats.lastUpdated = new Date().toISOString();
        await kv.set(statsKey, currentStats);
        
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
            kv.get(totalKey) || 0,
            kv.get(dailyKey) || 0
        ]);
        
        await Promise.all([
            kv.set(totalKey, parseInt(currentTotal) + 1),
            kv.set(dailyKey, parseInt(currentDaily) + 1),
            // Establecer expiración para estadísticas diarias (30 días)
            kv.expire(dailyKey, 30 * 24 * 60 * 60)
        ]);
        
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