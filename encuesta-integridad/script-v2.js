// Encuesta de Integridad Empresarial v2.0 - Ley 27401
// IntegridAI - HackAI 2025
// Sistema mejorado con validación robusta y almacenamiento confiable

class IntegritySurveyV2 {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 6;
        this.responses = {};
        this.validationErrors = [];
        
        // Configuración de validación por sección
        this.sectionRequirements = {
            1: ['companyName', 'sector', 'companySize', 'contactEmail', 'position'],
            2: ['hasProgram'],
            3: [], // Condicional basado en respuestas de sección 2
            4: ['hasResponsible'],
            5: ['hasTraining'],
            6: ['aiInterest']
        };
        
        this.init();
    }

    init() {
        console.log('🏛️ IntegridAI Survey System v2.0 Initialized');
        
        this.setupEventListeners();
        this.loadSavedData();
        this.updateUI();
        
        // Auto-guardar cada 15 segundos
        setInterval(() => this.autoSave(), 15000);
        
        // Validar sección actual al inicio
        setTimeout(() => this.validateCurrentSection(), 500);
    }

    setupEventListeners() {
        // Navegación
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSection());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSection());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.submitForm(e));
        
        // Todos los inputs del formulario
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleInputChange(e));
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });
        
        // Lógica condicional específica
        this.setupConditionalLogic();
        
        // Feedback visual
        this.setupVisualFeedback();
    }

    setupConditionalLogic() {
        // Programa de integridad
        document.querySelectorAll('input[name="hasProgram"]').forEach(input => {
            input.addEventListener('change', () => this.updateProgramSections());
        });
        
        // Responsable de integridad
        document.querySelectorAll('input[name="hasResponsible"]').forEach(input => {
            input.addEventListener('change', () => this.updateResponsibleSections());
        });
        
        // Capacitación
        document.querySelectorAll('input[name="hasTraining"]').forEach(input => {
            input.addEventListener('change', () => this.updateTrainingSections());
        });
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

    handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        
        if (!name) return;
        
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
        
        // Limpiar errores específicos del campo
        this.clearFieldError(name);
        
        // Actualizar UI
        this.updateVisualSelection();
        this.validateCurrentSection();
        
        // Log para debugging
        console.log(`Updated ${name}:`, this.responses[name]);
    }

    updateProgramSections() {
        const hasProgramValue = this.responses.hasProgram;
        const noProgramSection = document.getElementById('noProgramSection');
        const hasProgramElements = document.getElementById('hasProgramElements');
        
        // Limpiar sección anterior
        noProgramSection.classList.remove('show');
        
        if (hasProgramValue === 'no') {
            noProgramSection.classList.add('show');
            // Ocultar elementos del programa
            if (hasProgramElements) hasProgramElements.style.display = 'none';
        } else if (['completo', 'parcial', 'desarrollo'].includes(hasProgramValue)) {
            // Mostrar elementos del programa
            if (hasProgramElements) hasProgramElements.style.display = 'block';
        }
    }

    updateResponsibleSections() {
        const hasResponsibleValue = this.responses.hasResponsible;
        const sharedSection = document.getElementById('sharedResponsibilitySection');
        
        sharedSection.classList.remove('show');
        
        if (hasResponsibleValue === 'si_compartido') {
            sharedSection.classList.add('show');
        }
    }

    updateTrainingSections() {
        const hasTrainingValue = this.responses.hasTraining;
        const detailsSection = document.getElementById('trainingDetailsSection');
        
        detailsSection.classList.remove('show');
        
        if (['formal', 'informal', 'solo_induccion'].includes(hasTrainingValue)) {
            detailsSection.classList.add('show');
        }
    }

    updateVisualSelection() {
        // Radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const container = radio.closest('.radio-item');
            if (container) {
                if (radio.checked) {
                    container.classList.add('selected');
                    // Limpiar otros del mismo grupo
                    document.querySelectorAll(`input[name="${radio.name}"]`).forEach(other => {
                        if (other !== radio) {
                            const otherContainer = other.closest('.radio-item');
                            if (otherContainer) otherContainer.classList.remove('selected');
                        }
                    });
                }
            }
        });

        // Checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const container = checkbox.closest('.checkbox-item');
            if (container) {
                container.classList.toggle('selected', checkbox.checked);
            }
        });
    }

    validateCurrentSection() {
        const isValid = this.validateSection(this.currentSection);
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Actualizar estado de botones
        if (this.currentSection === this.totalSections) {
            if (submitBtn) submitBtn.disabled = !isValid;
        } else {
            if (nextBtn) nextBtn.disabled = !isValid;
        }
        
        return isValid;
    }

    validateSection(sectionNumber) {
        this.validationErrors = [];
        const requirements = this.sectionRequirements[sectionNumber] || [];
        
        // Validar campos requeridos básicos
        requirements.forEach(fieldName => {
            const value = this.responses[fieldName];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                this.validationErrors.push({
                    field: fieldName,
                    message: 'Este campo es requerido'
                });
            }
        });
        
        // Validaciones específicas por sección
        this.validateSectionSpecific(sectionNumber);
        
        // Mostrar/ocultar errores
        this.displayValidationErrors(sectionNumber);
        
        return this.validationErrors.length === 0;
    }

    validateSectionSpecific(sectionNumber) {
        switch (sectionNumber) {
            case 1:
                this.validateSection1();
                break;
            case 2:
                this.validateSection2();
                break;
            case 6:
                this.validateSection6();
                break;
        }
    }

    validateSection1() {
        // Validar email
        const email = this.responses.contactEmail;
        if (email && !this.isValidEmail(email)) {
            this.validationErrors.push({
                field: 'contactEmail',
                message: 'Por favor ingrese un email válido'
            });
        }
        
        // Validar número de empleados si está presente
        const employeeCount = this.responses.employeeCount;
        if (employeeCount && (employeeCount < 1 || employeeCount > 50000)) {
            this.validationErrors.push({
                field: 'employeeCount',
                message: 'Ingrese un número válido de empleados'
            });
        }
    }

    validateSection2() {
        const hasProgram = this.responses.hasProgram;
        
        if (hasProgram === 'no' && !this.responses.noImplementationReason) {
            this.validationErrors.push({
                field: 'noImplementationReason',
                message: 'Por favor seleccione el motivo principal'
            });
        }
    }

    validateSection6() {
        // Validar máximo de funcionalidades IA seleccionadas
        const aiFeatures = this.responses.aiFeatures || [];
        if (aiFeatures.length > 5) {
            this.validationErrors.push({
                field: 'aiFeatures',
                message: 'Por favor seleccione máximo 5 funcionalidades'
            });
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    displayValidationErrors(sectionNumber) {
        // Limpiar errores previos
        this.clearValidationErrors(sectionNumber);
        
        if (this.validationErrors.length > 0) {
            // Marcar campos con errores
            this.validationErrors.forEach(error => {
                this.markFieldError(error.field);
            });
            
            // Mostrar mensaje general si hay errores
            const section = document.getElementById(`section${sectionNumber}`);
            if (this.validationErrors.length > 0 && section) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `
                    <strong>Por favor corrija los siguientes errores:</strong><br>
                    ${this.validationErrors.map(e => `• ${e.message}`).join('<br>')}
                `;
                section.appendChild(errorDiv);
            }
        }
    }

    markFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.style.borderColor = '#e74c3c';
            field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        }
    }

    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    }

    clearValidationErrors(sectionNumber) {
        const section = document.getElementById(`section${sectionNumber}`);
        if (section) {
            // Remover mensajes de error
            section.querySelectorAll('.error-message').forEach(msg => msg.remove());
            
            // Limpiar estilos de campos
            section.querySelectorAll('input, select, textarea').forEach(field => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
            });
        }
    }

    nextSection() {
        if (!this.validateSection(this.currentSection)) {
            // Scroll al primer error
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        if (this.currentSection < this.totalSections) {
            this.goToSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.currentSection > 1) {
            this.goToSection(this.currentSection - 1);
        }
    }

    goToSection(sectionNumber) {
        // Ocultar sección actual
        const currentSection = document.getElementById(`section${this.currentSection}`);
        if (currentSection) currentSection.classList.remove('active');
        
        // Mostrar nueva sección
        this.currentSection = sectionNumber;
        const newSection = document.getElementById(`section${this.currentSection}`);
        if (newSection) {
            newSection.classList.add('active');
            newSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Actualizar UI
        this.updateUI();
        
        // Validar nueva sección
        setTimeout(() => this.validateCurrentSection(), 100);
        
        // Auto-guardar
        this.autoSave();
    }

    updateUI() {
        this.updateProgressBar();
        this.updateNavigationButtons();
        this.updateConditionalSections();
    }

    updateProgressBar() {
        const progress = (this.currentSection / this.totalSections) * 100;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Sección ${this.currentSection} de ${this.totalSections}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Botón anterior
        if (prevBtn) {
            prevBtn.style.display = this.currentSection > 1 ? 'inline-block' : 'none';
        }
        
        // Botones siguiente/enviar
        if (this.currentSection === this.totalSections) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    updateConditionalSections() {
        this.updateProgramSections();
        this.updateResponsibleSections();
        this.updateTrainingSections();
    }

    async submitForm(event) {
        event.preventDefault();
        
        // Validar todas las secciones
        let allValid = true;
        for (let i = 1; i <= this.totalSections; i++) {
            if (!this.validateSection(i)) {
                allValid = false;
                console.warn(`Sección ${i} tiene errores de validación`);
            }
        }
        
        if (!allValid) {
            alert('Por favor, complete correctamente todos los campos requeridos antes de enviar.');
            return;
        }
        
        try {
            // Mostrar loading
            this.showLoading();
            
            // Procesar datos
            const processedData = this.processFormData();
            
            // Guardar datos de forma confiable
            await this.saveDataReliably(processedData);
            
            // Mostrar resultados
            this.showResults(processedData);
            
        } catch (error) {
            console.error('Error al procesar la encuesta:', error);
            alert('Hubo un error al procesar la encuesta. Por favor, intente nuevamente.');
        }
    }

    processFormData() {
        const processedData = {
            ...this.responses,
            metadata: {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                completionTime: Date.now() - (this.startTime || Date.now()),
                version: '2.0'
            }
        };
        
        return processedData;
    }

    async saveDataReliably(data) {
        // 1. Guardar en localStorage como backup
        localStorage.setItem('integridai_survey_final_v2', JSON.stringify(data));
        
        // 2. Intentar enviar a servidor si está disponible
        try {
            const response = await fetch('/api/survey-responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log('✅ Datos enviados al servidor correctamente');
                data.metadata.serverSaved = true;
            } else {
                console.warn('⚠️ No se pudo enviar al servidor, guardado localmente');
            }
        } catch (error) {
            console.warn('⚠️ Servidor no disponible, datos guardados localmente:', error.message);
        }
        
        // 3. Generar ID único para la respuesta
        data.responseId = this.generateResponseId();
        
        // 4. Guardar en IndexedDB para mayor confiabilidad
        await this.saveToIndexedDB(data);
        
        console.log('💾 Datos guardados con ID:', data.responseId);
        return data;
    }

    generateResponseId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `INTGRD_${timestamp}_${random}`;
    }

    async saveToIndexedDB(data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('IntegridAI_Survey', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['responses'], 'readwrite');
                const store = transaction.objectStore('responses');
                
                store.add(data);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
            
            request.onupgradeneeded = () => {
                const db = request.result;
                const store = db.createObjectStore('responses', { keyPath: 'responseId' });
                store.createIndex('timestamp', 'metadata.timestamp');
            };
        });
    }

    showLoading() {
        const form = document.getElementById('integrityForm');
        if (form) {
            form.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h3>Procesando encuesta...</h3>
                    <div style="margin: 20px 0;">⏳ Guardando respuestas de forma segura</div>
                </div>
            `;
        }
    }

    showResults(data) {
        // Ocultar formulario
        const form = document.getElementById('integrityForm');
        if (form) form.style.display = 'none';
        
        // Mostrar sección de resultados
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.add('show');
            
            // Mostrar preview de datos
            this.displayDataPreview(data);
            
            // Scroll a resultados
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Limpiar datos de sesión
        localStorage.removeItem('integridai_survey_progress_v2');
        
        console.log('✅ Encuesta completada exitosamente');
    }

    displayDataPreview(data) {
        const preview = document.getElementById('dataPreview');
        if (preview) {
            preview.innerHTML = `
                <h4>📊 Resumen de Respuestas</h4>
                <p><strong>ID de Respuesta:</strong> ${data.responseId}</p>
                <p><strong>Empresa:</strong> ${data.companyName}</p>
                <p><strong>Sector:</strong> ${data.sector}</p>
                <p><strong>Programa de Integridad:</strong> ${data.hasProgram}</p>
                <p><strong>Interés en IA:</strong> ${data.aiInterest}</p>
                <p><strong>Completado:</strong> ${new Date(data.metadata.timestamp).toLocaleString()}</p>
                
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; font-weight: bold;">Ver datos completos (JSON)</summary>
                    <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 0.8em; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
                </details>
            `;
        }
    }

    autoSave() {
        if (Object.keys(this.responses).length > 0) {
            const saveData = {
                responses: this.responses,
                currentSection: this.currentSection,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('integridai_survey_progress_v2', JSON.stringify(saveData));
            console.log('💾 Auto-guardado completado');
        }
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('integridai_survey_progress_v2');
            if (saved) {
                const data = JSON.parse(saved);
                this.responses = data.responses || {};
                this.currentSection = data.currentSection || 1;
                
                console.log('📂 Datos previos cargados');
                this.populateForm();
            }
        } catch (error) {
            console.warn('Error al cargar datos guardados:', error);
        }
        
        this.startTime = Date.now();
    }

    populateForm() {
        Object.keys(this.responses).forEach(name => {
            const value = this.responses[name];
            
            if (Array.isArray(value)) {
                // Checkboxes
                value.forEach(v => {
                    const input = document.querySelector(`input[name="${name}"][value="${v}"]`);
                    if (input) input.checked = true;
                });
            } else {
                // Otros tipos de input
                const inputs = document.querySelectorAll(`[name="${name}"]`);
                inputs.forEach(input => {
                    if (input.type === 'radio') {
                        if (input.value === value) input.checked = true;
                    } else {
                        input.value = value;
                    }
                });
            }
        });
        
        // Actualizar UI después de cargar datos
        setTimeout(() => {
            this.updateUI();
            this.updateVisualSelection();
        }, 100);
    }
}

// Funciones globales para exportación y email
window.exportData = function(format) {
    const finalData = localStorage.getItem('integridai_survey_final_v2');
    if (!finalData) {
        alert('No hay datos de encuesta para exportar.');
        return;
    }
    
    const data = JSON.parse(finalData);
    const timestamp = new Date().toISOString().split('T')[0];
    const companyName = (data.companyName || 'empresa').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `encuesta_integridad_${companyName}_${timestamp}`;
    
    if (format === 'json') {
        exportJSON(data, filename);
    } else if (format === 'csv') {
        exportCSV(data, filename);
    }
};

window.sendByEmail = function() {
    const finalData = localStorage.getItem('integridai_survey_final_v2');
    if (!finalData) {
        alert('No hay datos de encuesta para enviar.');
        return;
    }
    
    const data = JSON.parse(finalData);
    
    // Crear resumen para email
    const emailBody = createEmailSummary(data);
    
    // Preparar email usando configuración
    const subject = encodeURIComponent(getEmailSubject(data.companyName, data.responseId));
    const body = encodeURIComponent(emailBody);
    
    // Obtener emails del equipo desde configuración
    const teamEmails = getTeamEmails();
    const integridaiEmails = teamEmails.join(',');
    
    // Abrir cliente de email
    window.open(`mailto:${integridaiEmails}?subject=${subject}&body=${body}`);
    
    // También copiar al clipboard como backup
    copyToClipboard(emailBody);
    alert('Email preparado y datos copiados al clipboard como respaldo.');
};

window.resetForm = function() {
    if (confirm('¿Está seguro de que desea reiniciar? Se perderán todos los datos no guardados.')) {
        localStorage.removeItem('integridai_survey_progress_v2');
        localStorage.removeItem('integridai_survey_final_v2');
        location.reload();
    }
};

// Funciones auxiliares
function exportJSON(data, filename) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
}

function exportCSV(data, filename) {
    const flattenedData = flattenObject(data);
    const headers = Object.keys(flattenedData);
    const values = headers.map(key => {
        const value = flattenedData[key];
        return `"${String(value).replace(/"/g, '""')}"`;
    });
    
    const csvContent = headers.join(',') + '\n' + values.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
}

function flattenObject(obj, prefix = '') {
    let flattened = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (Array.isArray(obj[key])) {
                flattened[newKey] = obj[key].join('; ');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(flattened, flattenObject(obj[key], newKey));
            } else {
                flattened[newKey] = obj[key];
            }
        }
    }
    
    return flattened;
}

function createEmailSummary(data) {
    return `
ENCUESTA DE INTEGRIDAD EMPRESARIAL - LEY 27401
=============================================

ID de Respuesta: ${data.responseId}
Fecha: ${new Date(data.metadata.timestamp).toLocaleString()}

INFORMACIÓN DE LA EMPRESA
-------------------------
Empresa: ${data.companyName}
Sector: ${data.sector}
Tamaño: ${data.companySize}
Empleados: ${data.employeeCount || 'No especificado'}
Ubicación: ${data.companyLocation || 'No especificado'}
Contacto: ${data.contactEmail}
Cargo encuestado: ${data.position}

PROGRAMA DE INTEGRIDAD
----------------------
Estado del programa: ${data.hasProgram}
Elementos implementados: ${(data.programElements || []).join(', ') || 'Ninguno'}
Código de ética: ${data.ethicsCodeStatus || 'No especificado'}

RESPONSABLE DE INTEGRIDAD
-------------------------
Tiene responsable: ${data.hasResponsible}
Funciones adicionales: ${(data.otherResponsibilities || []).join(', ') || 'N/A'}
Capacitación del responsable: ${data.responsibleTraining || 'No especificado'}

CAPACITACIÓN
------------
Plan de capacitación: ${data.hasTraining}
Frecuencia: ${data.trainingFrequency || 'N/A'}
Duración: ${data.trainingDuration || 'N/A'}
Modalidades: ${(data.trainingModalities || []).join(', ') || 'N/A'}
Contenidos: ${(data.trainingContent || []).join(', ') || 'N/A'}

INTERÉS EN SOLUCIONES IA
------------------------
Nivel de interés: ${data.aiInterest}
Funcionalidades de interés: ${(data.aiFeatures || []).join(', ') || 'Ninguna'}
Plazo implementación: ${data.aiImplementationTimeframe || 'No especificado'}
Presupuesto: ${data.aiInvestmentBudget || 'No especificado'}

COMENTARIOS ADICIONALES
-----------------------
${data.additionalComments || 'Sin comentarios adicionales'}

---
Encuesta generada por IntegridAI - HackAI 2025
Plataforma RegTech especializada en Ley 27401
`;
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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.warn('No se pudo copiar al clipboard:', err);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.integritySurvey = new IntegritySurveyV2();
});

// Prevenir pérdida de datos
window.addEventListener('beforeunload', function(e) {
    const survey = window.integritySurvey;
    if (survey && Object.keys(survey.responses).length > 0) {
        survey.autoSave();
        e.preventDefault();
        e.returnValue = 'Tiene datos sin guardar. ¿Está seguro de que desea salir?';
        return e.returnValue;
    }
});