// scripts/migrate-data.js
// Script para migrar datos del localStorage a Vercel KV

class DataMigrationTool {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.migrationLog = [];
        this.init();
    }

    init() {
        // Solo ejecutar en modo desarrollo o cuando se solicite explícitamente
        if (this.shouldRunMigration()) {
            this.createMigrationUI();
        }
    }

    shouldRunMigration() {
        // Verificar si hay datos en localStorage que necesiten migración
        const hasLocalParticipants = localStorage.getItem('olympicsParticipants');
        const hasLocalStats = localStorage.getItem('globalStats');
        const migrationCompleted = localStorage.getItem('migration_completed');
        
        return (hasLocalParticipants || hasLocalStats) && !migrationCompleted;
    }

    createMigrationUI() {
        const migrationModal = document.createElement('div');
        migrationModal.id = 'migrationModal';
        migrationModal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                ">
                    <h2 style="
                        color: #2563eb;
                        margin-bottom: 1rem;
                        font-size: 1.5rem;
                        text-align: center;
                    ">
                        🔄 Migración de Datos Detectada
                    </h2>
                    
                    <p style="
                        color: #6b7280;
                        margin-bottom: 1.5rem;
                        line-height: 1.6;
                        text-align: center;
                    ">
                        Se han encontrado datos locales que pueden ser migrados a la nueva base de datos en la nube.
                    </p>
                    
                    <div id="migrationDetails" style="
                        background: #f3f4f6;
                        border-radius: 10px;
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                        font-size: 0.9rem;
                        color: #374151;
                    ">
                        <div id="participantsCount"></div>
                        <div id="statisticsCount"></div>
                    </div>
                    
                    <div id="migrationProgress" style="
                        display: none;
                        margin-bottom: 1rem;
                    ">
                        <div style="
                            background: #e5e7eb;
                            border-radius: 10px;
                            height: 8px;
                            overflow: hidden;
                        ">
                            <div id="progressBar" style="
                                background: linear-gradient(90deg, #2563eb, #7c3aed);
                                height: 100%;
                                width: 0%;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                        <div id="progressText" style="
                            text-align: center;
                            margin-top: 0.5rem;
                            font-size: 0.9rem;
                            color: #6b7280;
                        "></div>
                    </div>
                    
                    <div id="migrationLog" style="
                        max-height: 200px;
                        overflow-y: auto;
                        background: #1f2937;
                        color: #e5e7eb;
                        padding: 1rem;
                        border-radius: 10px;
                        font-family: 'Courier New', monospace;
                        font-size: 0.8rem;
                        margin-bottom: 1rem;
                        display: none;
                    "></div>
                    
                    <div style="
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    ">
                        <button id="startMigration" style="
                            background: linear-gradient(135deg, #2563eb, #7c3aed);
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            Iniciar Migración
                        </button>
                        
                        <button id="skipMigration" style="
                            background: #6b7280;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            Omitir por Ahora
                        </button>
                        
                        <button id="deleteMigration" style="
                            background: #ef4444;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            display: none;
                        ">
                            Eliminar Datos Locales
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(migrationModal);
        this.setupMigrationHandlers();
        this.displayMigrationDetails();
    }

    displayMigrationDetails() {
        const participants = JSON.parse(localStorage.getItem('olympicsParticipants') || '[]');
        const stats = JSON.parse(localStorage.getItem('globalStats') || '{}');
        
        document.getElementById('participantsCount').innerHTML = 
            `📊 <strong>${participants.length}</strong> participantes registrados`;
        
        const statsCount = Object.keys(stats).length;
        document.getElementById('statisticsCount').innerHTML = 
            `📈 <strong>${statsCount}</strong> estadísticas guardadas`;
    }

    setupMigrationHandlers() {
        document.getElementById('startMigration').addEventListener('click', () => {
            this.startMigration();
        });

        document.getElementById('skipMigration').addEventListener('click', () => {
            this.closeMigrationModal();
        });

        document.getElementById('deleteMigration').addEventListener('click', () => {
            this.deleteLocalData();
        });
    }

    async startMigration() {
        const startButton = document.getElementById('startMigration');
        const skipButton = document.getElementById('skipMigration');
        const progressDiv = document.getElementById('migrationProgress');
        const logDiv = document.getElementById('migrationLog');
        
        // Deshabilitar botones y mostrar progreso
        startButton.disabled = true;
        skipButton.disabled = true;
        progressDiv.style.display = 'block';
        logDiv.style.display = 'block';
        
        try {
            await this.migrateParticipants();
            await this.migrateStatistics();
            
            this.updateProgress(100, 'Migración completada exitosamente');
            this.log('✅ Migración completada', 'success');
            
            // Marcar migración como completada
            localStorage.setItem('migration_completed', new Date().toISOString());
            
            // Mostrar botón para eliminar datos locales
            document.getElementById('deleteMigration').style.display = 'inline-block';
            
            setTimeout(() => {
                this.closeMigrationModal();
            }, 3000);
            
        } catch (error) {
            this.log(`❌ Error en migración: ${error.message}`, 'error');
            this.updateProgress(0, 'Error en la migración');
            
            // Rehabilitar botones
            startButton.disabled = false;
            skipButton.disabled = false;
        }
    }

    async migrateParticipants() {
        const participants = JSON.parse(localStorage.getItem('olympicsParticipants') || '[]');
        
        if (participants.length === 0) {
            this.log('ℹ️ No hay participantes para migrar', 'info');
            return;
        }

        this.log(`🚀 Iniciando migración de ${participants.length} participantes...`, 'info');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            
            try {
                // Preparar datos para la API
                const participantData = {
                    fullName: participant.fullName || participant.name,
                    email: participant.email,
                    age: participant.age,
                    grade: participant.grade,
                    school: participant.school || 'No especificado',
                    category: participant.category || 'novato',
                    experience: participant.experience || 'No especificado',
                    motivation: participant.motivation || 'No especificado',
                    role: participant.role || 'estudiante'
                };

                const response = await fetch(`${this.apiBaseUrl}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(participantData)
                });

                if (response.ok) {
                    successCount++;
                    this.log(`✅ Participante migrado: ${participant.fullName}`, 'success');
                } else {
                    const error = await response.json();
                    if (response.status === 409) {
                        this.log(`⚠️ Participante ya existe: ${participant.fullName}`, 'warning');
                        successCount++; // Contar como éxito
                    } else {
                        throw new Error(error.error || 'Error desconocido');
                    }
                }

            } catch (error) {
                errorCount++;
                this.log(`❌ Error migrando ${participant.fullName}: ${error.message}`, 'error');
            }

            // Actualizar progreso
            const progress = ((i + 1) / participants.length) * 50; // 50% del progreso total
            this.updateProgress(progress, `Migrando participantes: ${i + 1}/${participants.length}`);
        }

        this.log(`📊 Migración de participantes completada: ${successCount} éxitos, ${errorCount} errores`, 'info');
    }

    async migrateStatistics() {
        const stats = JSON.parse(localStorage.getItem('globalStats') || '{}');
        
        if (Object.keys(stats).length === 0) {
            this.log('ℹ️ No hay estadísticas para migrar', 'info');
            this.updateProgress(100, 'Migración completada');
            return;
        }

        this.log('🚀 Iniciando migración de estadísticas...', 'info');
        
        try {
            // Migrar votaciones de roles
            const roles = ['estudiantes', 'maestros', 'padres', 'otros'];
            
            for (const role of roles) {
                if (stats[role] && stats[role] > 0) {
                    // Enviar múltiples votos para simular el estado actual
                    for (let i = 0; i < stats[role]; i++) {
                        try {
                            await fetch(`${this.apiBaseUrl}/api/stats`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    action: 'vote',
                                    role: role
                                })
                            });
                        } catch (error) {
                            this.log(`⚠️ Error migrando voto de ${role}: ${error.message}`, 'warning');
                        }
                    }
                    this.log(`✅ Migrados ${stats[role]} votos de ${role}`, 'success');
                }
            }

            this.updateProgress(100, 'Migración de estadísticas completada');
            this.log('📊 Migración de estadísticas completada', 'success');
            
        } catch (error) {
            this.log(`❌ Error migrando estadísticas: ${error.message}`, 'error');
            throw error;
        }
    }

    updateProgress(percentage, text) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        this.migrationLog.push({ timestamp, message, type });
        
        const logDiv = document.getElementById('migrationLog');
        if (logDiv) {
            const logLine = document.createElement('div');
            logLine.style.marginBottom = '0.25rem';
            
            switch (type) {
                case 'success':
                    logLine.style.color = '#10b981';
                    break;
                case 'error':
                    logLine.style.color = '#ef4444';
                    break;
                case 'warning':
                    logLine.style.color = '#f59e0b';
                    break;
                default:
                    logLine.style.color = '#e5e7eb';
            }
            
            logLine.textContent = logEntry;
            logDiv.appendChild(logLine);
            logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        console.log(`Migration: ${logEntry}`);
    }

    deleteLocalData() {
        if (confirm('¿Estás seguro de que quieres eliminar todos los datos locales? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('olympicsParticipants');
            localStorage.removeItem('globalStats');
            localStorage.removeItem('total_visitors');
            
            this.log('🗑️ Datos locales eliminados exitosamente', 'success');
            
            setTimeout(() => {
                this.closeMigrationModal();
            }, 2000);
        }
    }

    closeMigrationModal() {
        const modal = document.getElementById('migrationModal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Método estático para ejecutar migración manualmente
    static async runMigration() {
        const migrator = new DataMigrationTool();
        if (migrator.shouldRunMigration()) {
            migrator.createMigrationUI();
        } else {
            console.log('No hay datos para migrar o la migración ya fue completada');
        }
    }

    // Método para exportar datos como respaldo
    static exportLocalData() {
        const participants = JSON.parse(localStorage.getItem('olympicsParticipants') || '[]');
        const stats = JSON.parse(localStorage.getItem('globalStats') || '{}');
        
        const exportData = {
            participants,
            stats,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `olimpiadas-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Datos exportados exitosamente');
    }
}

// Exponer métodos globales
window.DataMigrationTool = DataMigrationTool;
window.runMigration = DataMigrationTool.runMigration;
window.exportLocalData = DataMigrationTool.exportLocalData;

// Auto-ejecutar si estamos en modo desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Verificar si hay parámetro en URL para forzar migración
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('migrate') === 'true') {
            DataMigrationTool.runMigration();
        } else {
            // Ejecutar automáticamente si hay datos
            new DataMigrationTool();
        }
    });
}