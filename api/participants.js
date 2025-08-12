// 🎯 CONFIGURACIÓN REDIS ESPECÍFICA PARA TU URL
// Para usar en participants.js, register.js y stats.js

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Test de conexión básico
        if (req.url.includes('/api/participants')) {
            
            if (req.method === 'GET') {
                console.log('📡 Obteniendo participantes...');
                
                // Intentar obtener participantes de Redis
                const participantIds = await redisOperation(async (client) => {
                    return await client.lRange('participants:list', 0, -1);
                });
                
                console.log(`📊 Encontrados ${participantIds?.length || 0} IDs de participantes`);
                
                let participants = [];
                
                if (participantIds && participantIds.length > 0) {
                    // Obtener datos completos de participantes
                    for (const id of participantIds) {
                        try {
                            const participantData = await redisOperation(async (client) => {
                                const data = await client.get(`participant:id:${id}`);
                                return data ? JSON.parse(data) : null;
                            });
                            
                            if (participantData) {
                                participants.push(participantData);
                            }
                        } catch (error) {
                            console.warn(`⚠️ Error obteniendo participante ${id}:`, error.message);
                        }
                    }
                }
                
                // Ordenar por fecha de registro (más recientes primero)
                participants.sort((a, b) => 
                    new Date(b.registrationDate) - new Date(a.registrationDate)
                );
                
                // Limpiar datos para respuesta pública
                const safeParticipants = participants.map(p => ({
                    id: p.id,
                    fullName: p.fullName,
                    age: p.age,
                    grade: p.grade,
                    school: p.school,
                    category: p.category,
                    experience: p.experience,
                    registrationDate: p.registrationDate,
                    role: p.role,
                    initials: p.fullName.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase()
                }));
                
                // Obtener estadísticas
                const stats = await getStatistics();
                
                res.status(200).json({
                    participants: safeParticipants,
                    pagination: {
                        total: safeParticipants.length,
                        page: 1,
                        limit: 100,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false
                    },
                    statistics: stats,
                    source: 'redis_cloud',
                    timestamp: new Date().toISOString()
                });
                
                console.log('✅ Respuesta enviada exitosamente');
                return;
            }
        }
        
        // Para otros endpoints o métodos
        res.status(405).json({ error: 'Método no permitido' });
        
    } catch (error) {
        console.error('💥 Error en API:', error);
        res.status(500).json({ 
            error: 'Error de conexión a Redis',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

// Función para obtener estadísticas
async function getStatistics() {
    try {
        const siteStats = await redisOperation(async (client) => {
            const data = await client.get('site:statistics');
            return data ? JSON.parse(data) : {};
        });
        
        const today = new Date().toISOString().split('T')[0];
        const dailyStats = await redisOperation(async (client) => {
            const data = await client.get(`stats:daily:${today}`);
            return data ? JSON.parse(data) : { registrations: 0 };
        });
        
        return {
            total: siteStats.totalParticipants || 0,
            estudiantes: siteStats.estudiantes || 0,
            maestros: siteStats.maestros || 0,
            padres: siteStats.padres || 0,
            otros: siteStats.otros || 0,
            today: dailyStats.registrations || 0,
            lastUpdated: siteStats.lastUpdated || new Date().toISOString()
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
            lastUpdated: new Date().toISOString()
        };
    }
}

// Cleanup al cerrar
process.on('SIGTERM', async () => {
    if (redis && isConnected) {
        await redis.quit();
    }
});