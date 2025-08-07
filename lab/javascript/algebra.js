/**
 * MÓDULO DE ÁLGEBRA - BALANZA ALGEBRAICA
 * Visualización interactiva de ecuaciones algebraicas
 * Prof. Yonatan Guerrero Soriano - Matemáticas Digitales
 */

class AlgebraModule {
    constructor() {
        this.currentEquation = { 
            left: [2, 'x', 3], 
            right: [9] 
        };
        this.originalEquation = null;
        this.algebraSteps = [];
        this.operationHistory = [];
        
        this.init();
    }

    init() {
        console.log('Módulo de Álgebra inicializado');
        this.setupEventListeners();
        this.injectStyles();
    }

    setupEventListeners() {
        // Evento para configurar nueva ecuación
        const equationInput = document.getElementById('equation');
        if (equationInput) {
            equationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.setupEquation();
                }
            });
        }

        // Eventos para operaciones con Enter
        const operationInput = document.getElementById('operationValue');
        if (operationInput) {
            operationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    // Aplicar la última operación seleccionada
                    const lastOperation = this.lastOperation || 'add';
                    this.applyOperation(lastOperation);
                }
            });
        }
    }

    setupEquation() {
        const equation = document.getElementById('equation').value.trim();
        
        if (!equation) {
            this.showError('Por favor ingrese una ecuación válida');
            return;
        }

        try {
            this.parseEquation(equation);
            this.originalEquation = JSON.parse(JSON.stringify(this.currentEquation));
            this.updateBalance();
            this.algebraSteps = [`Ecuación inicial: ${equation}`];
            this.operationHistory = [];
            this.updateSteps();
            this.clearError();
            
            // Verificar si ya está resuelta
            this.checkIfSolved();
            
        } catch (error) {
            console.error('Error parsing equation:', error);
            this.showError('Formato de ecuación inválido. Use formato como: 2x+3=9, x-5=10, 3x=15');
        }
    }

    parseEquation(equation) {
        // Limpiar espacios y validar formato básico
        const cleanEquation = equation.replace(/\s/g, '');
        
        if (!cleanEquation.includes('=')) {
            throw new Error('La ecuación debe contener el signo =');
        }

        const [left, right] = cleanEquation.split('=');
        
        if (!left || !right) {
            throw new Error('Ambos lados de la ecuación deben tener contenido');
        }

        // Parsear ambos lados
        this.currentEquation.left = this.parseExpression(left);
        this.currentEquation.right = this.parseExpression(right);
        
        // Validar que al menos un lado tenga una variable
        const hasVariable = this.hasVariable(this.currentEquation.left) || this.hasVariable(this.currentEquation.right);
        if (!hasVariable) {
            throw new Error('La ecuación debe contener al menos una variable (x)');
        }
    }

    parseExpression(expr) {
        const result = [];
        let current = '';
        let sign = 1;
        
        // Manejar el primer carácter si es un signo
        let startIndex = 0;
        if (expr[0] === '+' || expr[0] === '-') {
            sign = expr[0] === '+' ? 1 : -1;
            startIndex = 1;
        }
        
        for (let i = startIndex; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === '+' || char === '-') {
                if (current) {
                    this.addTermToResult(result, current, sign);
                    current = '';
                }
                sign = char === '+' ? 1 : -1;
            } else {
                current += char;
            }
        }
        
        // Agregar el último término
        if (current) {
            this.addTermToResult(result, current, sign);
        }
        
        // Si no hay términos, agregar 0
        if (result.length === 0) {
            result.push(0);
        }
        
        return result;
    }

    addTermToResult(result, term, sign) {
        if (term.includes('x')) {
            // Es un término con variable
            const coeffStr = term.replace('x', '');
            let coeff;
            
            if (coeffStr === '' || coeffStr === '+') {
                coeff = 1;
            } else if (coeffStr === '-') {
                coeff = -1;
            } else {
                coeff = parseFloat(coeffStr);
                if (isNaN(coeff)) {
                    throw new Error(`Coeficiente inválido: ${coeffStr}`);
                }
            }
            
            result.push(sign * coeff);
            result.push('x');
        } else {
            // Es una constante
            const constant = parseFloat(term);
            if (isNaN(constant)) {
                throw new Error(`Constante inválida: ${term}`);
            }
            result.push(sign * constant);
        }
    }

    hasVariable(expr) {
        return expr.includes('x');
    }

    updateBalance() {
        const leftSide = document.getElementById('leftSide');
        const rightSide = document.getElementById('rightSide');
        
        if (!leftSide || !rightSide) return;
        
        leftSide.innerHTML = '<div class="balance-pivot"></div>' + this.formatExpression(this.currentEquation.left);
        rightSide.innerHTML = '<div class="balance-pivot"></div>' + this.formatExpression(this.currentEquation.right);
        
        // Actualizar display de ecuación
        const equationDisplay = document.getElementById('equationDisplay');
        if (equationDisplay) {
            equationDisplay.textContent = 
                this.expressionToString(this.currentEquation.left) + ' = ' + this.expressionToString(this.currentEquation.right);
        }

        // Animar balanza
        this.animateBalance();
    }

    formatExpression(expr) {
        let html = '';
        let i = 0;
        
        while (i < expr.length) {
            if (expr[i] === 'x') {
                const coeff = i > 0 ? expr[i-1] : 1;
                html += `<span class="variable-block" title="Variable: ${coeff}x">${this.formatCoefficient(coeff)}x</span>`;
            } else if (typeof expr[i] === 'number' && (i >= expr.length - 1 || expr[i+1] !== 'x')) {
                const value = expr[i];
                if (value !== 0) {
                    html += `<span class="constant-block" title="Constante: ${value}">${this.formatNumber(value)}</span>`;
                }
            }
            i++;
        }
        
        return html || '<span class="constant-block">0</span>';
    }

    formatCoefficient(coeff) {
        if (coeff === 1) return '';
        if (coeff === -1) return '-';
        return coeff;
    }

    formatNumber(num) {
        return num % 1 === 0 ? num.toString() : num.toFixed(2);
    }

    expressionToString(expr) {
        let result = '';
        let i = 0;
        
        while (i < expr.length) {
            if (expr[i] === 'x') {
                const coeff = i > 0 ? expr[i-1] : 1;
                const coeffStr = this.formatCoefficient(coeff);
                
                if (result && coeff > 0) result += '+';
                result += coeffStr + 'x';
            } else if (typeof expr[i] === 'number' && (i >= expr.length - 1 || expr[i+1] !== 'x')) {
                const value = expr[i];
                if (value !== 0) {
                    if (result && value > 0) result += '+';
                    result += this.formatNumber(value);
                }
            }
            i++;
        }
        
        return result || '0';
    }

    applyOperation(operation) {
        const valueInput = document.getElementById('operationValue');
        if (!valueInput) return;
        
        const value = parseFloat(valueInput.value);
        
        if (isNaN(value)) {
            this.showError('Por favor ingrese un valor numérico válido');
            return;
        }

        if (value === 0 && (operation === 'multiply' || operation === 'divide')) {
            this.showError('No se puede multiplicar o dividir por cero');
            return;
        }

        this.lastOperation = operation;
        
        try {
            switch (operation) {
                case 'add':
                    this.addToExpression(this.currentEquation.left, value);
                    this.addToExpression(this.currentEquation.right, value);
                    this.algebraSteps.push(`Sumar ${this.formatNumber(value)} a ambos lados`);
                    break;
                    
                case 'subtract':
                    this.addToExpression(this.currentEquation.left, -value);
                    this.addToExpression(this.currentEquation.right, -value);
                    this.algebraSteps.push(`Restar ${this.formatNumber(value)} de ambos lados`);
                    break;
                    
                case 'multiply':
                    this.multiplyExpression(this.currentEquation.left, value);
                    this.multiplyExpression(this.currentEquation.right, value);
                    this.algebraSteps.push(`Multiplicar ambos lados por ${this.formatNumber(value)}`);
                    break;
                    
                case 'divide':
                    this.multiplyExpression(this.currentEquation.left, 1/value);
                    this.multiplyExpression(this.currentEquation.right, 1/value);
                    this.algebraSteps.push(`Dividir ambos lados por ${this.formatNumber(value)}`);
                    break;
            }
            
            // Simplificar expresiones
            this.simplifyExpression(this.currentEquation.left);
            this.simplifyExpression(this.currentEquation.right);
            
            this.operationHistory.push({
                operation,
                value,
                equation: JSON.parse(JSON.stringify(this.currentEquation))
            });
            
            this.updateBalance();
            this.updateSteps();
            this.checkIfSolved();
            this.clearError();
            
        } catch (error) {
            console.error('Error applying operation:', error);
            this.showError('Error al aplicar la operación');
        }
    }

    addToExpression(expr, value) {
        // Buscar términos constantes y sumar
        let constantIndex = -1;
        
        for (let i = 0; i < expr.length; i++) {
            if (typeof expr[i] === 'number' && (i >= expr.length - 1 || expr[i+1] !== 'x')) {
                constantIndex = i;
                break;
            }
        }
        
        if (constantIndex !== -1) {
            expr[constantIndex] += value;
        } else {
            expr.push(value);
        }
    }

    multiplyExpression(expr, value) {
        for (let i = 0; i < expr.length; i++) {
            if (typeof expr[i] === 'number') {
                expr[i] *= value;
            }
        }
    }

    simplifyExpression(expr) {
        // Combinar términos similares y eliminar ceros
        let coefficient = 0;
        let constant = 0;
        let hasVariable = false;
        
        let i = 0;
        while (i < expr.length) {
            if (expr[i] === 'x') {
                coefficient += i > 0 ? expr[i-1] : 1;
                hasVariable = true;
                i++;
            } else if (typeof expr[i] === 'number' && (i >= expr.length - 1 || expr[i+1] !== 'x')) {
                constant += expr[i];
                i++;
            } else {
                i++;
            }
        }
        
        // Reconstruir expresión simplificada
        expr.length = 0;
        
        if (hasVariable && coefficient !== 0) {
            expr.push(coefficient);
            expr.push('x');
        }
        
        if (constant !== 0) {
            expr.push(constant);
        }
        
        // Si la expresión está vacía, agregar 0
        if (expr.length === 0) {
            expr.push(0);
        }
    }

    updateSteps() {
        const stepsContainer = document.getElementById('algebraSteps');
        if (!stepsContainer) return;
        
        stepsContainer.innerHTML = '';
        
        this.algebraSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';
            stepDiv.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <strong>Paso ${index + 1}:</strong> ${step}
                    <div class="step-equation">${this.expressionToString(this.currentEquation.left)} = ${this.expressionToString(this.currentEquation.right)}</div>
                </div>
            `;
            stepsContainer.appendChild(stepDiv);
        });
    }

    checkIfSolved() {
        const left = this.currentEquation.left;
        const right = this.currentEquation.right;
        
        // Verificar si tenemos x = número o número = x
        const leftIsVariable = left.length === 2 && left.includes('x') && Math.abs(left[0]) === 1;
        const rightIsConstant = right.length === 1 && typeof right[0] === 'number';
        const rightIsVariable = right.length === 2 && right.includes('x') && Math.abs(right[0]) === 1;
        const leftIsConstant = left.length === 1 && typeof left[0] === 'number';
        
        if ((leftIsVariable && rightIsConstant) || (rightIsVariable && leftIsConstant)) {
            const solution = leftIsVariable ? right[0] / left[0] : left[0] / right[0];
            this.showSolution(solution);
        }
    }

    showSolution(solution) {
        const solutionDiv = document.createElement('div');
        solutionDiv.className = 'solution-alert';
        solutionDiv.innerHTML = `
            <div class="solution-content">
                <i class="fas fa-trophy solution-icon"></i>
                <h3>¡Ecuación Resuelta!</h3>
                <div class="solution-value">x = ${this.formatNumber(solution)}</div>
                <button class="verify-btn" onclick="algebraModule.verifySolution(${solution})">
                    <i class="fas fa-check"></i> Verificar Solución
                </button>
            </div>
        `;
        
        const stepsContainer = document.getElementById('algebraSteps');
        if (stepsContainer) {
            stepsContainer.appendChild(solutionDiv);
        }
    }

    verifySolution(solution) {
        if (!this.originalEquation) return;
        
        const leftValue = this.evaluateExpression(this.originalEquation.left, solution);
        const rightValue = this.evaluateExpression(this.originalEquation.right, solution);
        
        const tolerance = 0.0001;
        const isCorrect = Math.abs(leftValue - rightValue) < tolerance;
        
        const verificationDiv = document.createElement('div');
        verificationDiv.className = `verification ${isCorrect ? 'correct' : 'incorrect'}`;
        verificationDiv.innerHTML = `
            <h4>Verificación:</h4>
            <p>Lado izquierdo: ${leftValue.toFixed(3)}</p>
            <p>Lado derecho: ${rightValue.toFixed(3)}</p>
            <p class="verification-result">
                <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                ${isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </p>
        `;
        
        const solutionAlert = document.querySelector('.solution-alert');
        if (solutionAlert) {
            solutionAlert.appendChild(verificationDiv);
        }
    }

    evaluateExpression(expr, xValue) {
        let result = 0;
        let i = 0;
        
        while (i < expr.length) {
            if (expr[i] === 'x') {
                const coeff = i > 0 ? expr[i-1] : 1;
                result += coeff * xValue;
            } else if (typeof expr[i] === 'number' && (i >= expr.length - 1 || expr[i+1] !== 'x')) {
                result += expr[i];
            }
            i++;
        }
        
        return result;
    }

    resetEquation() {
        document.getElementById('equation').value = '2x+3=9';
        document.getElementById('operationValue').value = '1';
        this.setupEquation();
        this.clearError();
    }

    undoLastOperation() {
        if (this.operationHistory.length > 0) {
            this.operationHistory.pop();
            this.algebraSteps.pop();
            
            if (this.operationHistory.length > 0) {
                const lastState = this.operationHistory[this.operationHistory.length - 1];
                this.currentEquation = JSON.parse(JSON.stringify(lastState.equation));
            } else {
                this.currentEquation = JSON.parse(JSON.stringify(this.originalEquation));
            }
            
            this.updateBalance();
            this.updateSteps();
        }
    }

    animateBalance() {
        const leftSide = document.getElementById('leftSide');
        const rightSide = document.getElementById('rightSide');
        
        if (leftSide && rightSide) {
            leftSide.style.animation = 'balanceFloat 0.5s ease-in-out';
            rightSide.style.animation = 'balanceFloat 0.5s ease-in-out';
            
            setTimeout(() => {
                leftSide.style.animation = '';
                rightSide.style.animation = '';
            }, 500);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('algebraError') || this.createErrorDiv();
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> ${message}
        `;
        errorDiv.style.display = 'block';
        
        setTimeout(() => this.clearError(), 5000);
    }

    createErrorDiv() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'algebraError';
        errorDiv.className = 'error-message';
        
        const controlsContainer = document.querySelector('.experiment-controls');
        if (controlsContainer) {
            controlsContainer.appendChild(errorDiv);
        }
        
        return errorDiv;
    }

    clearError() {
        const errorDiv = document.getElementById('algebraError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    injectStyles() {
        if (document.getElementById('algebra-styles')) return;

        const style = document.createElement('style');
        style.id = 'algebra-styles';
        style.textContent = `
            .step {
                display: flex;
                align-items: flex-start;
                padding: 1rem;
                margin: 0.5rem 0;
                background: rgba(102, 126, 234, 0.05);
                border-radius: 10px;
                border-left: 4px solid var(--primary);
                transition: all 0.3s ease;
            }
            
            .step:hover {
                background: rgba(102, 126, 234, 0.1);
                transform: translateX(5px);
            }
            
            .step-number {
                background: var(--primary);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 1rem;
                flex-shrink: 0;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-equation {
                font-family: 'Space Grotesk', monospace;
                font-size: 1.1rem;
                color: var(--primary);
                margin-top: 0.5rem;
                font-weight: 600;
            }
            
            .solution-alert {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                margin: 1rem 0;
                animation: solutionPulse 0.6s ease-in-out;
            }
            
            .solution-content h3 {
                margin: 0.5rem 0;
                font-size: 1.5rem;
            }
            
            .solution-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                animation: bounce 1s infinite;
            }
            
            .solution-value {
                font-size: 2rem;
                font-weight: bold;
                font-family: 'Space Grotesk', monospace;
                margin: 1rem 0;
                background: rgba(255,255,255,0.2);
                padding: 0.5rem 1rem;
                border-radius: 10px;
                display: inline-block;
            }
            
            .verify-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 2px solid white;
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-top: 1rem;
            }
            
            .verify-btn:hover {
                background: white;
                color: #22c55e;
            }
            
            .verification {
                background: rgba(255,255,255,0.2);
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                text-align: left;
            }
            
            .verification.correct {
                border: 2px solid #22c55e;
            }
            
            .verification.incorrect {
                border: 2px solid #ef4444;
            }
            
            .verification-result {
                font-weight: bold;
                font-size: 1.1rem;
                margin-top: 0.5rem;
            }
            
            .error-message {
                background: #fed7d7;
                color: #c53030;
                padding: 1rem;
                border-radius: 10px;
                margin: 1rem 0;
                border: 1px solid #feb2b2;
                display: none;
            }
            
            @keyframes solutionPulse {
                0% { transform: scale(0.95); opacity: 0; }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            @keyframes balanceFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            .variable-block, .constant-block {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .variable-block:hover, .constant-block:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .operation-btn {
                position: relative;
                overflow: hidden;
            }
            
            .operation-btn::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease;
            }
            
            .operation-btn:active::after {
                width: 100%;
                height: 100%;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Crear instancia global del módulo
window.AlgebraModule = AlgebraModule;