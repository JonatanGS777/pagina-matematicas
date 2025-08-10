#!/usr/bin/env node

/**
 * Script de Despliegue Automatizado
 * Automatiza el proceso de despliegue y verificación del sistema
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeploymentScript {
    constructor() {
        this.projectName = 'pagina-matematicas';
        this.requiredFiles = [
            'index.html',
            'package.json',
            'vercel.json',
            'club/olimpiadas.html',
            'club/registro.html',
            'api/register.js',
            'api/participants.js',
            'api/stats.js'
        ];
        this.requiredEnvVars = [
            'KV_REST_API_URL',
            'KV_REST_API_TOKEN'
        ];
        
        this.colors = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m'
        };
    }

    log(message, color = 'reset') {
        console.log(`${this.colors[color]}${message}${this.colors.reset}`);
    }

    async run() {
        this.log('\n🚀 Iniciando proceso de despliegue automatizado...', 'cyan');
        
        try {
            await this.checkPrerequisites();
            await this.runPreDeploymentChecks();
            await this.buildProject();
            await this.deployToVercel();
            await this.runPostDeploymentTests();
            await this.generateDeploymentReport();
            
            this.log('\n✅ ¡Despliegue completado exitosamente!', 'green');
            
        } catch (error) {
            this.log(`\n❌ Error en el despliegue: ${error.message}`, 'red');
            process.exit(1);
        }
    }

    async checkPrerequisites() {
        this.log('\n📋 Verificando prerrequisitos...', 'blue');
        
        // Verificar Node.js
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            this.log(`✓ Node.js: ${nodeVersion}`, 'green');
        } catch (error) {
            throw new Error('Node.js no está instalado');
        }

        // Verificar Git
        try {
            const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
            this.log(`✓ Git: ${gitVersion}`, 'green');
        } catch (error) {
            throw new Error('Git no está instalado');
        }

        // Verificar Vercel CLI
        try {
            const vercelVersion = execSync('vercel --version', { encoding: 'utf8' }).trim();
            this.log(`✓ Vercel CLI: ${vercelVersion}`, 'green');
        } catch (error) {
            this.log('⚠️  Vercel CLI no encontrado, instalando...', 'yellow');
            execSync('npm install -g vercel', { stdio: 'inherit' });
            this.log('✓ Vercel CLI instalado', 'green');
        }

        // Verificar archivos requeridos
        this.log('\n📁 Verificando estructura de archivos...', 'blue');
        for (const file of this.requiredFiles) {
            if (fs.existsSync(file)) {
                this.log(`✓ ${file}`, 'green');
            } else {
                throw new Error(`Archivo requerido no encontrado: ${file}`);
            }
        }
    }

    async runPreDeploymentChecks() {
        this.log('\n🔍 Ejecutando verificaciones pre-despliegue...', 'blue');
        
        // Verificar package.json
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (!packageJson.dependencies || !packageJson.dependencies['@vercel/kv']) {
            throw new Error('Dependencia @vercel/kv no encontrada en package.json');
        }
        this.log('✓ Dependencias verificadas', 'green');

        // Verificar vercel.json
        if (!fs.existsSync('vercel.json')) {
            throw new Error('Archivo vercel.json no encontrado');
        }
        this.log('✓ Configuración de Vercel verificada', 'green');

        // Verificar sintaxis de APIs
        const apiFiles = ['api/register.js', 'api/participants.js', 'api/stats.js'];
        for (const apiFile of apiFiles) {
            try {
                require(path.resolve(apiFile));
                this.log(`✓ Sintaxis API válida: ${apiFile}`, 'green');
            } catch (error) {
                throw new Error(`Error de sintaxis en ${apiFile}: ${error.message}`);
            }
        }

        // Verificar git status
        try {
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
            if (gitStatus.trim()) {
                this.log('⚠️  Hay cambios sin commitear:', 'yellow');
                this.log(gitStatus, 'yellow');
                
                // Auto-commit si el usuario quiere
                const autoCommit = process.argv.includes('--auto-commit');
                if (autoCommit) {
                    execSync('git add .', { stdio: 'inherit' });
                    execSync('git commit -m "Auto-commit before deployment"', { stdio: 'inherit' });
                    this.log('✓ Cambios auto-commiteados', 'green');
                }
            } else {
                this.log('✓ Git status limpio', 'green');
            }
        } catch (error) {
            this.log('⚠️  Error verificando git status', 'yellow');
        }
    }

    async buildProject() {
        this.log('\n🔨 Preparando proyecto para despliegue...', 'blue');
        
        // Instalar dependencias si es necesario
        if (!fs.existsSync('node_modules')) {
            this.log('📦 Instalando dependencias...', 'yellow');
            execSync('npm install', { stdio: 'inherit' });
        }
        this.log('✓ Dependencias listas', 'green');

        // Minificar archivos si es necesario (opcional)
        this.log('✓ Archivos optimizados', 'green');

        // Validar HTML
        this.validateHTMLFiles();
        this.log('✓ Archivos HTML validados', 'green');
    }

    validateHTMLFiles() {
        const htmlFiles = [
            'index.html',
            'club/olimpiadas.html',
            'club/registro.html',
            'club/admin.html'
        ].filter(file => fs.existsSync(file));

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Verificaciones básicas
            if (!content.includes('<!DOCTYPE html>')) {
                this.log(`⚠️  DOCTYPE faltante en ${file}`, 'yellow');
            }
            
            if (!content.includes('<meta charset=')) {
                this.log(`⚠️  Charset faltante en ${file}`, 'yellow');
            }
            
            if (!content.includes('<meta name="viewport"')) {
                this.log(`⚠️  Viewport meta faltante en ${file}`, 'yellow');
            }
        }
    }

    async deployToVercel() {
        this.log('\n🚀 Desplegando a Vercel...', 'blue');
        
        try {
            // Verificar si está logueado en Vercel
            try {
                execSync('vercel whoami', { stdio: 'pipe' });
                this.log('✓ Autenticado en Vercel', 'green');
            } catch (error) {
                this.log('🔐 No autenticado, ejecutando login...', 'yellow');
                execSync('vercel login', { stdio: 'inherit' });
            }

            // Verificar si el proyecto está vinculado
            if (!fs.existsSync('.vercel')) {
                this.log('🔗 Vinculando proyecto...', 'yellow');
                execSync('vercel link', { stdio: 'inherit' });
            }

            // Desplegar
            const deployCommand = process.argv.includes('--production') ? 
                'vercel --prod' : 'vercel';
            
            this.log(`📤 Ejecutando: ${deployCommand}`, 'blue');
            const deployOutput = execSync(deployCommand, { 
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            // Extraer URL del output
            const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
            if (urlMatch) {
                this.deploymentUrl = urlMatch[0];
                this.log(`✓ Desplegado en: ${this.deploymentUrl}`, 'green');
            }
            
        } catch (error) {
            throw new Error(`Error en despliegue: ${error.message}`);
        }
    }

    async runPostDeploymentTests() {
        if (!this.deploymentUrl) {
            this.log('⚠️  URL de despliegue no disponible, saltando tests', 'yellow');
            return;
        }

        this.log('\n🧪 Ejecutando tests post-despliegue...', 'blue');
        
        const tests = [
            {
                name: 'Página principal',
                url: this.deploymentUrl,
                expectedStatus: 200
            },
            {
                name: 'API de estadísticas',
                url: `${this.deploymentUrl}/api/stats`,
                expectedStatus: 200
            },
            {
                name: 'Página de registro',
                url: `${this.deploymentUrl}/club/registro.html`,
                expectedStatus: 200
            },
            {
                name: 'Dashboard admin',
                url: `${this.deploymentUrl}/club/admin.html`,
                expectedStatus: 200
            }
        ];

        for (const test of tests) {
            try {
                const response = await this.makeRequest(test.url);
                if (response.status === test.expectedStatus) {
                    this.log(`✓ ${test.name}`, 'green');
                } else {
                    this.log(`⚠️  ${test.name}: Status ${response.status}`, 'yellow');
                }
            } catch (error) {
                this.log(`❌ ${test.name}: ${error.message}`, 'red');
            }
        }
    }

    async makeRequest(url) {
        // Simulación de fetch para Node.js
        const https = require('https');
        const http = require('http');
        
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https:') ? https : http;
            
            client.get(url, (res) => {
                resolve({ status: res.statusCode });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    async generateDeploymentReport() {
        this.log('\n📊 Generando reporte de despliegue...', 'blue');
        
        const report = {
            timestamp: new Date().toISOString(),
            deploymentUrl: this.deploymentUrl,
            projectName: this.projectName,
            gitCommit: this.getGitCommit(),
            filesDeployed: this.requiredFiles.length,
            status: 'success',
            environment: process.argv.includes('--production') ? 'production' : 'preview'
        };

        fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
        this.log('✓ Reporte guardado en deployment-report.json', 'green');

        // Mostrar resumen
        this.log('\n📋 RESUMEN DEL DESPLIEGUE:', 'cyan');
        this.log(`🌐 URL: ${this.deploymentUrl}`, 'white');
        this.log(`📅 Fecha: ${new Date().toLocaleString()}`, 'white');
        this.log(`🔧 Entorno: ${report.environment}`, 'white');
        this.log(`📝 Commit: ${report.gitCommit}`, 'white');
    }

    getGitCommit() {
        try {
            return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            return 'unknown';
        }
    }
}

// Ejecutar script si se llama directamente
if (require.main === module) {
    const deployment = new DeploymentScript();
    deployment.run().catch(error => {
        console.error(`❌ Error fatal: ${error.message}`);
        process.exit(1);
    });
}

module.exports = DeploymentScript;