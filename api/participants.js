import { Redis } from '@vercel/kv';

// 🔹 CONEXIÓN NUEVA A TU BASE OLIMPIADAS
const kv = new Redis({
  url: process.env.OLIMPIADAS_KV_REDIS_URL
});

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
        const participantIds = await kv.lrange('participants:list', 0, -1);
        
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
        const participants = await Promise.all(
            participantIds.map(async (id) => {
                try {
                    return await kv.get(`participant:id:${id}`);
                } catch (error) {
                    console.warn(`Error obteniendo participante ${id}:`, error);
                    return null;
                }
            })
        );

        // Filtrar participantes nulos y aplicar filtros
        let filteredParticipants = participants
            .filter(participant => participant !== null && participant.status === 'active');

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
        const generalStats = await kv.get('site:statistics') || {};
        
        // Obtener estadísticas del día actual
        const today = new Date().toISOString().split('T')[0];
        const dailyStats = await kv.get(`stats:daily:${today}`) || { registrations: 0 };
        
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
            const dayStats = await kv.get(`stats:daily:${dateStr}`);
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
        // Esta sería una implementación más eficiente con índices
        // Por ahora, una aproximación básica
        const participantIds = await kv.lrange('participants:list', 0, 100); // Limitar para performance
        const distribution = { novato: 0, intermedio: 0, avanzado: 0 };
        
        for (const id of participantIds) {
            try {
                const participant = await kv.get(`participant:id:${id}`);
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