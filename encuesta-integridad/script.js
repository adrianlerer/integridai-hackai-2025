// Encuesta de Integridad Empresarial - Ley 27401
// IntegridAI - HackAI 2025

class IntegritySurvey {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 5;
        this.responses = {};
        this.validationRules = {};
        
        this.initializeEventListeners();
        this.setupValidationRules();
        this.loadSavedData();
        this.updateProgress();
        this.updateNavigation();
        
        console.log('🏛️ IntegridAI Survey System Initialized');
    }

    initializeEventListeners() {
        // Navegación
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSection());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSection());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.submitForm(e));
        
        // Inputs principales
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', (e) => this.handleInputChange(e));
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });
        
        // Lógica condicional específica
        document.querySelectorAll('input[name="hasProgram"]').forEach(input => {
            input.addEventListener('change', () => this.toggleProgramSections());
        });
        
        document.querySelectorAll('input[name="hasResponsible"]').forEach(input => {
            input.addEventListener('change', () => this.toggleResponsibleSections());
        });
        
        document.querySelectorAll('input[name="exclusiveDedication"]').forEach(input => {
            input.addEventListener('change', () => this.toggleOtherFunctionsSections());
        });
        
        document.querySelectorAll('input[name="hasTraining"]').forEach(input => {
            input.addEventListener('change', () => this.toggleTrainingSections());
        });

        // Visual feedback para radio buttons y checkboxes
        this.setupVisualFeedback();
        
        // Auto-guardar cada 30 segundos
        setInterval(() => this.saveData(), 30000);
    }

    setupVisualFeedback() {
        document.querySelectorAll('.radio-item, .checkbox-item').forEach(item => {
            const input = item.querySelector('input');
            if (input) {
                input.addEventListener('change', () => {
                    this.updateVisualSelection();
                });
            }
        });
    }

    updateVisualSelection() {
        // Actualizar radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const container = radio.closest('.radio-item');
            if (container) {
                if (radio.checked) {
                    container.classList.add('selected');
                    // Remover selección de otros elementos del mismo grupo
                    document.querySelectorAll(`input[name="${radio.name}"]`).forEach(otherRadio => {
                        if (otherRadio !== radio) {
                            const otherContainer = otherRadio.closest('.radio-item');
                            if (otherContainer) {
                                otherContainer.classList.remove('selected');
                            }
                        }
                    });
                } else {
                    container.classList.remove('selected');
                }
            }
        });

        // Actualizar checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const container = checkbox.closest('.checkbox-item');
            if (container) {
                if (checkbox.checked) {
                    container.classList.add('selected');
                } else {
                    container.classList.remove('selected');
                }
            }
        });
    }

    setupValidationRules() {
        this.validationRules = {
            1: ['companyName', 'sector', 'contactEmail', 'position'],
            2: ['hasProgram'],
            3: ['hasResponsible'],
            4: ['hasTraining'],
            5: ['aiInterest']
        };
    }

    handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        
        if (type === 'checkbox') {
            if (!this.responses[name]) {
                this.responses[name] = [];
            }
            if (checked) {
                if (!this.responses[name].includes(value)) {
                    this.responses[name].push(value);
                }
            } else {
                this.responses[name] = this.responses[name].filter(v => v !== value);
            }
        } else {
            this.responses[name] = value;
        }
        
        this.updateVisualSelection();
        this.checkSectionCompletion();
        this.saveData();
        
        // Log para debugging
        console.log(`Updated ${name}:`, this.responses[name]);
    }

    toggleProgramSections() {
        const hasProgramValue = this.responses.hasProgram;
        const hasProgramSection = document.getElementById('hasProgramSection');
        const noProgramSection = document.getElementById('noProgramSection');
        
        if (hasProgramValue === 'si') {
            hasProgramSection.classList.add('show');
            noProgramSection.classList.remove('show');
        } else if (hasProgramValue === 'no') {
            noProgramSection.classList.add('show');
            hasProgramSection.classList.remove('show');
        } else {
            hasProgramSection.classList.remove('show');
            noProgramSection.classList.remove('show');
        }
    }

    toggleResponsibleSections() {
        const hasResponsibleValue = this.responses.hasResponsible;
        const hasResponsibleSection = document.getElementById('hasResponsibleSection');
        
        if (hasResponsibleValue === 'si') {
            hasResponsibleSection.classList.add('show');
        } else {
            hasResponsibleSection.classList.remove('show');
        }
    }

    toggleOtherFunctionsSections() {
        const exclusiveDedicationValue = this.responses.exclusiveDedication;
        const otherFunctionsSection = document.getElementById('otherFunctionsSection');
        
        if (exclusiveDedicationValue === 'no') {
            otherFunctionsSection.classList.add('show');
        } else {
            otherFunctionsSection.classList.remove('show');
        }
    }

    toggleTrainingSections() {
        const hasTrainingValue = this.responses.hasTraining;
        const hasTrainingSection = document.getElementById('hasTrainingSection');
        
        if (hasTrainingValue === 'si') {
            hasTrainingSection.classList.add('show');
        } else {
            hasTrainingSection.classList.remove('show');
        }
    }

    validateSection(sectionNumber) {
        const requiredFields = this.validationRules[sectionNumber] || [];
        const missingFields = [];
        
        for (const field of requiredFields) {
            const value = this.responses[field];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                missingFields.push(field);
            }
        }
        
        // Validaciones adicionales específicas
        if (sectionNumber === 1) {
            // Validar email
            const email = this.responses.contactEmail;
            if (email && !this.isValidEmail(email)) {
                missingFields.push('contactEmail_invalid');
            }
        }
        
        // Mostrar errores si los hay
        if (missingFields.length > 0) {
            this.showValidationErrors(sectionNumber, missingFields);
            return false;
        }
        
        this.clearValidationErrors(sectionNumber);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationErrors(sectionNumber, missingFields) {
        // Remover errores previos
        this.clearValidationErrors(sectionNumber);
        
        missingFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.style.borderColor = '#e74c3c';
                input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            }
        });
        
        // Mostrar mensaje de error
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
            margin: 20px 0;
            font-weight: 500;
        `;
        errorMessage.textContent = 'Por favor, complete todos los campos requeridos antes de continuar.';
        
        const section = document.getElementById(`section${sectionNumber}`);
        section.appendChild(errorMessage);
        
        // Scroll al error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    clearValidationErrors(sectionNumber) {
        // Limpiar estilos de error
        const section = document.getElementById(`section${sectionNumber}`);
        section.querySelectorAll('input, select, textarea').forEach(input => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
        
        // Remover mensajes de error
        section.querySelectorAll('.error-message').forEach(msg => msg.remove());
    }

    checkSectionCompletion() {
        for (let i = 1; i <= this.totalSections; i++) {
            const isComplete = this.validateSection(i);
            const indicator = document.getElementById(`indicator${i}`);
            if (indicator) {
                if (isComplete) {
                    indicator.classList.add('completed');
                } else {
                    indicator.classList.remove('completed');
                }
            }
        }
    }

    nextSection() {
        if (!this.validateSection(this.currentSection)) {
            return;
        }
        
        if (this.currentSection < this.totalSections) {
            this.switchToSection(this.currentSection + 1);
        }
    }

    previousSection() {
        if (this.currentSection > 1) {
            this.switchToSection(this.currentSection - 1);
        }
    }

    switchToSection(sectionNumber) {
        // Ocultar sección actual
        document.getElementById(`section${this.currentSection}`).classList.remove('active');
        
        // Mostrar nueva sección
        this.currentSection = sectionNumber;
        document.getElementById(`section${this.currentSection}`).classList.add('active');
        
        // Actualizar UI
        this.updateProgress();
        this.updateNavigation();
        
        // Scroll al top de la nueva sección
        document.getElementById(`section${this.currentSection}`).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Guardar progreso
        this.saveData();
    }

    updateProgress() {
        const progress = (this.currentSection / this.totalSections) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Botón anterior
        prevBtn.style.display = this.currentSection > 1 ? 'inline-block' : 'none';
        
        // Botones siguiente/enviar
        if (this.currentSection === this.totalSections) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    async submitForm(event) {
        event.preventDefault();
        
        // Validar todas las secciones
        let allValid = true;
        for (let i = 1; i <= this.totalSections; i++) {
            if (!this.validateSection(i)) {
                allValid = false;
                break;
            }
        }
        
        if (!allValid) {
            alert('Por favor, complete todos los campos requeridos antes de enviar la encuesta.');
            return;
        }
        
        // Procesar y mostrar resultados
        this.processResults();
        
        // Limpiar datos guardados
        localStorage.removeItem('integridai_survey_data');
        localStorage.removeItem('integridai_survey_progress');
        
        console.log('📋 Survey submitted successfully');
    }

    processResults() {
        // Ocultar formulario
        document.getElementById('integrityForm').style.display = 'none';
        
        // Mostrar sección de resultados
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.add('show');
        
        // Generar resumen de resultados
        this.generateResultsSummary();
        
        // Scroll a resultados
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultsSummary() {
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';
        
        const summaryCards = [
            {
                title: '🏢 Información de la Empresa',
                content: this.getCompanyInfoSummary()
            },
            {
                title: '⚖️ Programa de Integridad',
                content: this.getProgramSummary()
            },
            {
                title: '👤 Responsable de Integridad',
                content: this.getResponsibleSummary()
            },
            {
                title: '🎓 Capacitación',
                content: this.getTrainingSummary()
            },
            {
                title: '🤖 Interés en IA',
                content: this.getAISummary()
            }
        ];
        
        summaryCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'result-card';
            cardElement.innerHTML = `
                <h4>${card.title}</h4>
                <p>${card.content}</p>
            `;
            resultsGrid.appendChild(cardElement);
        });
    }

    getCompanyInfoSummary() {
        const company = this.responses.companyName || 'No especificado';
        const sector = this.responses.sector || 'No especificado';
        const size = this.responses.companySize || 'No especificado';
        const position = this.responses.position || 'No especificado';
        
        return `Empresa: ${company}<br>Sector: ${sector}<br>Tamaño: ${size}<br>Cargo: ${position}`;
    }

    getProgramSummary() {
        const hasProgram = this.responses.hasProgram;
        if (hasProgram === 'si') {
            const components = this.responses.components || [];
            return `Tiene programa implementado con ${components.length} componente(s): ${components.join(', ')}`;
        } else if (hasProgram === 'no') {
            const reason = this.responses.noImplementationReason || 'No especificado';
            return `No tiene programa pero planea implementarlo. Motivo: ${reason}`;
        } else {
            return 'No tiene programa de integridad ni planea implementarlo';
        }
    }

    getResponsibleSummary() {
        const hasResponsible = this.responses.hasResponsible;
        if (hasResponsible === 'si') {
            const exclusive = this.responses.exclusiveDedication;
            if (exclusive === 'si') {
                return 'Tiene responsable de integridad con dedicación exclusiva';
            } else {
                const otherFunctions = this.responses.otherFunctions || [];
                return `Tiene responsable con otras funciones: ${otherFunctions.join(', ')}`;
            }
        } else {
            return 'No tiene responsable de integridad designado';
        }
    }

    getTrainingSummary() {
        const hasTraining = this.responses.hasTraining;
        if (hasTraining === 'si') {
            const frequency = this.responses.trainingFrequency || 'No especificado';
            const modalities = this.responses.trainingModalities || [];
            return `Tiene plan de capacitación ${frequency}. Modalidades: ${modalities.join(', ')}`;
        } else {
            return 'No tiene plan de capacitación en integridad';
        }
    }

    getAISummary() {
        const interest = this.responses.aiInterest || 'No especificado';
        const features = this.responses.aiFeatures || [];
        let summary = `Nivel de interés: ${interest}`;
        if (features.length > 0) {
            summary += `<br>Funcionalidades de interés: ${features.join(', ')}`;
        }
        return summary;
    }

    saveData() {
        localStorage.setItem('integridai_survey_data', JSON.stringify(this.responses));
        localStorage.setItem('integridai_survey_progress', this.currentSection.toString());
    }

    loadSavedData() {
        const savedData = localStorage.getItem('integridai_survey_data');
        const savedProgress = localStorage.getItem('integridai_survey_progress');
        
        if (savedData) {
            this.responses = JSON.parse(savedData);
            this.populateForm();
        }
        
        if (savedProgress) {
            this.currentSection = parseInt(savedProgress);
        }
    }

    populateForm() {
        Object.keys(this.responses).forEach(name => {
            const value = this.responses[name];
            
            if (Array.isArray(value)) {
                // Checkboxes
                value.forEach(v => {
                    const input = document.querySelector(`input[name="${name}"][value="${v}"]`);
                    if (input) {
                        input.checked = true;
                    }
                });
            } else {
                // Radio buttons, selects, text inputs
                const input = document.querySelector(`[name="${name}"]`);
                if (input) {
                    if (input.type === 'radio') {
                        const radioInput = document.querySelector(`input[name="${name}"][value="${value}"]`);
                        if (radioInput) {
                            radioInput.checked = true;
                        }
                    } else {
                        input.value = value;
                    }
                }
            }
        });
        
        // Actualizar lógica condicional
        this.toggleProgramSections();
        this.toggleResponsibleSections();
        this.toggleOtherFunctionsSections();
        this.toggleTrainingSections();
        this.updateVisualSelection();
    }
}

// Funciones globales para exportación
function exportData(format) {
    const survey = window.integritySurvey;
    if (!survey) return;
    
    const data = survey.responses;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `encuesta_integridad_${data.companyName || 'empresa'}_${timestamp}`;
    
    if (format === 'json') {
        exportJSON(data, filename);
    } else if (format === 'csv') {
        exportCSV(data, filename);
    }
}

function exportJSON(data, filename) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
}

function exportCSV(data, filename) {
    // Convertir objeto a CSV
    const headers = Object.keys(data);
    const values = headers.map(key => {
        const value = data[key];
        if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
        } else {
            return `"${String(value).replace(/"/g, '""')}"`;
        }
    });
    
    const csvContent = headers.join(',') + '\n' + values.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
}

function downloadFile(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function resetForm() {
    if (confirm('¿Está seguro de que desea reiniciar la encuesta? Se perderán todos los datos.')) {
        localStorage.removeItem('integridai_survey_data');
        localStorage.removeItem('integridai_survey_progress');
        location.reload();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.integritySurvey = new IntegritySurvey();
});

// Prevenir pérdida de datos al salir de la página
window.addEventListener('beforeunload', function(e) {
    const survey = window.integritySurvey;
    if (survey && Object.keys(survey.responses).length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return 'Tiene datos sin guardar. ¿Está seguro de que desea salir?';
    }
});

// Analytics básico (sin tracking personal)
class SurveyAnalytics {
    static trackEvent(event, data = {}) {
        const analyticsData = {
            event,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ...data
        };
        
        // Solo log local para debugging - no se envía a ningún servidor
        console.log('📊 Survey Analytics:', analyticsData);
        
        // Aquí se podría implementar envío a analytics server si se requiere
    }
    
    static trackSectionComplete(sectionNumber) {
        this.trackEvent('section_completed', { section: sectionNumber });
    }
    
    static trackFormSubmit(responses) {
        // Solo trackear métricas agregadas, no datos sensibles
        this.trackEvent('form_submitted', {
            totalResponses: Object.keys(responses).length,
            hasProgramOfIntegrity: responses.hasProgram,
            sector: responses.sector,
            companySize: responses.companySize,
            aiInterestLevel: responses.aiInterest
        });
    }
}

// Integración con analytics
document.addEventListener('DOMContentLoaded', function() {
    SurveyAnalytics.trackEvent('survey_loaded');
});