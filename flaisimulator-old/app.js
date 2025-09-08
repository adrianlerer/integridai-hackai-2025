// FlaiSimulator - Application Logic
class FlaiSimulator {
    constructor() {
        this.currentCharacter = 'mentor';
        this.gameData = {};
        this.conversationHistory = [];
        this.userStats = this.loadUserStats();
        this.characters = this.loadCharacters();
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDashboard();
        this.setupGaming();
        this.setupTraining();
        this.setupCharacters();
        this.loadInitialData();
    }

    // Navigation Management
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.getAttribute('data-section');
                
                // Update navigation
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Update sections
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
            });
        });
    }

    // Dashboard Management
    setupDashboard() {
        this.updateDashboardStats();
        this.loadRecentActivity();
    }

    updateDashboardStats() {
        document.getElementById('totalGames').textContent = this.userStats.gamesCompleted;
        document.getElementById('trainingTime').textContent = `${this.userStats.trainingHours}h`;
        document.getElementById('averageScore').textContent = this.userStats.averageScore;
        document.getElementById('conversationCount').textContent = this.userStats.conversationCount;
    }

    loadRecentActivity() {
        const activities = [
            {
                icon: 'fas fa-gamepad',
                title: 'Completado: Escenario Corporativo',
                time: 'Hace 2 horas'
            },
            {
                icon: 'fas fa-comments',
                title: 'Conversación con Dr. Mentor',
                time: 'Hace 4 horas'
            },
            {
                icon: 'fas fa-trophy',
                title: 'Nueva puntuación récord: 95',
                time: 'Ayer'
            },
            {
                icon: 'fas fa-graduation-cap',
                title: 'Sesión de capacitación completada',
                time: 'Hace 2 días'
            }
        ];

        const activityContainer = document.getElementById('recentActivity');
        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.time}</p>
                </div>
            </div>
        `).join('');
    }

    // Gaming Management
    setupGaming() {
        const gameCards = document.querySelectorAll('.game-card');
        const gameModal = document.getElementById('gameModal');
        const closeBtn = gameModal.querySelector('.close-btn');

        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameType = card.getAttribute('data-game');
                this.startGame(gameType);
            });
        });

        closeBtn.addEventListener('click', () => {
            gameModal.classList.remove('active');
        });

        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) {
                gameModal.classList.remove('active');
            }
        });
    }

    startGame(gameType) {
        const games = {
            scenario1: {
                title: 'Escenario Corporativo',
                description: 'Te encuentras en una reunión donde un cliente potencial sugiere un "regalo especial" para acelerar la aprobación de un contrato. ¿Cómo respondes?',
                options: [
                    'Acepto el regalo para cerrar el negocio rápidamente',
                    'Rechazo educadamente y explico nuestras políticas de compliance',
                    'Sugiero una alternativa legal que beneficie a ambas partes',
                    'Consulto con mi supervisor antes de tomar una decisión'
                ],
                correctAnswer: 1,
                feedback: {
                    0: 'Incorrecto. Aceptar regalos inapropiados viola las políticas de compliance y puede constituir soborno.',
                    1: '¡Excelente! Rechazar educadamente y explicar las políticas es la respuesta correcta.',
                    2: 'Buena respuesta. Buscar alternativas legales demuestra proactividad en compliance.',
                    3: 'Correcto. Consultar con supervisores en situaciones dudosas es una práctica recomendada.'
                }
            },
            scenario2: {
                title: 'Negociación Ética',
                description: 'Durante una negociación importante, descubres información confidencial sobre la competencia que podría darte ventaja. ¿Qué haces?',
                options: [
                    'Uso la información para ganar la negociación',
                    'Ignoro la información y continúo éticamente',
                    'Reporto cómo obtuve esta información',
                    'Comparto la información con mi equipo'
                ],
                correctAnswer: 1,
                feedback: {
                    0: 'Incorrecto. Usar información obtenida ilegalmente es antiético y potencialmente ilegal.',
                    1: '¡Correcto! Ignorar información obtenida inapropiadamente mantiene la integridad ética.',
                    2: 'Buena práctica. Reportar cómo se obtuvo información sospechosa es responsable.',
                    3: 'Incorrecto. Compartir información obtenida ilegalmente extiende el problema ético.'
                }
            },
            scenario3: {
                title: 'Detección de Riesgos',
                description: 'Notas que un colega está procesando transacciones inusuales fuera del horario normal. ¿Cuál es tu respuesta?',
                options: [
                    'Ignoro la situación, no es mi responsabilidad',
                    'Confronto directamente al colega',
                    'Reporto mis observaciones al canal de integridad',
                    'Investigo por mi cuenta antes de actuar'
                ],
                correctAnswer: 2,
                feedback: {
                    0: 'Incorrecto. Todos los empleados tienen responsabilidad en la detección de riesgos.',
                    1: 'Riesgoso. La confrontación directa puede comprometer una investigación.',
                    2: '¡Excelente! Reportar al canal de integridad es el procedimiento correcto.',
                    3: 'Peligroso. La investigación personal puede interferir con procesos oficiales.'
                }
            }
        };

        const game = games[gameType];
        if (!game) return;

        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameContent').innerHTML = `
            <div class="game-scenario">
                <div class="scenario-image">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="scenario-description">
                    ${game.description}
                </div>
                <div class="scenario-options">
                    ${game.options.map((option, index) => `
                        <button class="option-btn" data-option="${index}">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add option click handlers
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedOption = parseInt(btn.getAttribute('data-option'));
                this.handleGameAnswer(game, selectedOption);
            });
        });

        document.getElementById('gameModal').classList.add('active');
    }

    handleGameAnswer(game, selectedOption) {
        const isCorrect = selectedOption === game.correctAnswer;
        const feedback = game.feedback[selectedOption];
        
        // Update stats
        this.userStats.gamesCompleted++;
        if (isCorrect) {
            this.userStats.averageScore = Math.min(100, this.userStats.averageScore + 2);
        }
        this.saveUserStats();
        this.updateDashboardStats();

        // Show result
        document.getElementById('gameContent').innerHTML = `
            <div class="game-result">
                <div class="result-icon ${isCorrect ? 'success' : 'warning'}">
                    <i class="fas ${isCorrect ? 'fa-check' : 'fa-exclamation'}"></i>
                </div>
                <div class="result-text">
                    ${feedback}
                </div>
                <button class="play-again-btn" onclick="document.getElementById('gameModal').classList.remove('active')">
                    Continuar
                </button>
            </div>
        `;
    }

    // Training Management
    setupTraining() {
        const characterCards = document.querySelectorAll('.character-card');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessage');
        const clearBtn = document.getElementById('clearConversation');

        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                characterCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const characterType = card.getAttribute('data-character');
                this.switchCharacter(characterType);
            });
        });

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        clearBtn.addEventListener('click', () => {
            this.clearConversation();
        });
    }

    switchCharacter(characterType) {
        this.currentCharacter = characterType;
        const character = this.characters[characterType];
        
        document.getElementById('activeCharacterName').textContent = character.name;
        
        // Update avatar in conversation header
        const activeCharacterIcon = document.querySelector('.active-character i');
        activeCharacterIcon.className = character.icon;
        
        // Clear conversation and show welcome message
        this.clearConversation();
        this.addAIMessage(character.welcomeMessage);
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        messageInput.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response);
        }, 1000);
        
        // Update stats
        this.userStats.conversationCount++;
        this.userStats.trainingHours += 0.1; // Assume 6 minutes per conversation
        this.saveUserStats();
        this.updateDashboardStats();
    }

    addUserMessage(message) {
        const conversationArea = document.getElementById('conversationArea');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        conversationArea.appendChild(messageElement);
        conversationArea.scrollTop = conversationArea.scrollHeight;
    }

    addAIMessage(message) {
        const conversationArea = document.getElementById('conversationArea');
        const character = this.characters[this.currentCharacter];
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="${character.icon}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        conversationArea.appendChild(messageElement);
        conversationArea.scrollTop = conversationArea.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const character = this.characters[this.currentCharacter];
        const responses = character.responses;
        
        // Simple keyword matching for responses
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('compliance') || lowerMessage.includes('cumplimiento')) {
            return responses.compliance[Math.floor(Math.random() * responses.compliance.length)];
        } else if (lowerMessage.includes('riesgo') || lowerMessage.includes('risk')) {
            return responses.risk[Math.floor(Math.random() * responses.risk.length)];
        } else if (lowerMessage.includes('ética') || lowerMessage.includes('etica') || lowerMessage.includes('ethics')) {
            return responses.ethics[Math.floor(Math.random() * responses.ethics.length)];
        } else if (lowerMessage.includes('capacitación') || lowerMessage.includes('training') || lowerMessage.includes('entrenamiento')) {
            return responses.training[Math.floor(Math.random() * responses.training.length)];
        } else {
            return responses.general[Math.floor(Math.random() * responses.general.length)];
        }
    }

    clearConversation() {
        const conversationArea = document.getElementById('conversationArea');
        conversationArea.innerHTML = '';
    }

    // Characters Management
    setupCharacters() {
        const editBtns = document.querySelectorAll('.edit-btn');
        const configureBtns = document.querySelectorAll('.configure-btn');
        const saveBtn = document.getElementById('saveCharacter');
        const cancelBtn = document.getElementById('cancelEdit');

        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const characterType = e.target.closest('.character-item').getAttribute('data-character');
                this.editCharacter(characterType);
            });
        });

        configureBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const characterType = e.target.closest('.character-item').getAttribute('data-character');
                this.configureCharacter(characterType);
            });
        });

        saveBtn.addEventListener('click', () => {
            this.saveCharacterConfiguration();
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelCharacterEdit();
        });
    }

    editCharacter(characterType) {
        const character = this.characters[characterType];
        
        document.getElementById('characterName').value = character.name;
        document.getElementById('characterSpecialty').value = character.specialty;
        document.getElementById('characterPersonality').value = character.personality;
        document.getElementById('characterDescription').value = character.description;
        
        // Store current editing character
        this.editingCharacter = characterType;
    }

    configureCharacter(characterType) {
        this.editCharacter(characterType);
    }

    saveCharacterConfiguration() {
        if (!this.editingCharacter) return;
        
        const character = this.characters[this.editingCharacter];
        character.name = document.getElementById('characterName').value;
        character.specialty = document.getElementById('characterSpecialty').value;
        character.personality = document.getElementById('characterPersonality').value;
        character.description = document.getElementById('characterDescription').value;
        
        this.saveCharacters();
        this.editingCharacter = null;
        
        // Update display
        this.updateCharacterDisplay(this.editingCharacter);
        
        alert('Configuración guardada exitosamente');
    }

    cancelCharacterEdit() {
        this.editingCharacter = null;
        
        // Clear form
        document.getElementById('characterName').value = '';
        document.getElementById('characterSpecialty').value = '';
        document.getElementById('characterPersonality').value = '';
        document.getElementById('characterDescription').value = '';
    }

    updateCharacterDisplay(characterType) {
        // Update character list display
        const characterItem = document.querySelector(`[data-character="${characterType}"]`);
        const character = this.characters[characterType];
        
        if (characterItem) {
            characterItem.querySelector('h3').textContent = character.name;
            characterItem.querySelector('p').textContent = character.specialty;
        }
    }

    // Data Management
    loadUserStats() {
        const defaultStats = {
            gamesCompleted: 0,
            trainingHours: 0,
            averageScore: 0,
            conversationCount: 0
        };
        
        const saved = localStorage.getItem('flaisimulator_stats');
        return saved ? JSON.parse(saved) : defaultStats;
    }

    saveUserStats() {
        localStorage.setItem('flaisimulator_stats', JSON.stringify(this.userStats));
    }

    loadCharacters() {
        const defaultCharacters = {
            mentor: {
                name: 'Dr. Mentor',
                specialty: 'Especialista en Compliance',
                personality: 'mentor',
                description: 'Experto en regulaciones y mejores prácticas de compliance',
                icon: 'fas fa-user-tie',
                welcomeMessage: '¡Hola! Soy el Dr. Mentor. Estoy aquí para ayudarte con cualquier pregunta sobre compliance y ética empresarial. ¿En qué tema te gustaría profundizar hoy?',
                responses: {
                    compliance: [
                        'El compliance efectivo requiere un enfoque integral que incluya políticas claras, capacitación regular y monitoreo continuo.',
                        'Las mejores prácticas de compliance incluyen evaluaciones de riesgo regulares, debido diligencia de terceros y un programa sólido de ética.',
                        'Un programa de compliance robusto debe adaptarse continuamente a los cambios regulatorios y las mejores prácticas de la industria.',
                    ],
                    risk: [
                        'La gestión de riesgos debe ser proactiva, identificando y mitigando riesgos potenciales antes de que se materialicen.',
                        'Es fundamental establecer una matriz de riesgos que priorice las amenazas según su probabilidad e impacto.',
                        'Los riesgos de terceros requieren particular atención, con procesos de due diligence exhaustivos.',
                    ],
                    ethics: [
                        'La ética empresarial va más allá del cumplimiento legal; implica hacer lo correcto incluso cuando nadie está mirando.',
                        'Un código de ética efectivo debe ser claro, aplicable y comunicado regularmente a todos los niveles de la organización.',
                        'Los dilemas éticos requieren análisis cuidadoso de todas las partes interesadas y consecuencias potenciales.',
                    ],
                    training: [
                        'La capacitación en compliance debe ser específica para cada rol y actualizarse regularmente.',
                        'Los programas de capacitación más efectivos combinan teoría con casos prácticos y escenarios reales.',
                        'Es importante medir la efectividad de la capacitación a través de evaluaciones y monitoreo del comportamiento.',
                    ],
                    general: [
                        '¿Podrías ser más específico sobre el tema que te interesa? Puedo ayudarte con compliance, gestión de riesgos, ética o capacitación.',
                        'Estoy aquí para guiarte en cualquier aspecto de integridad empresarial. ¿Hay algún desafío particular que estés enfrentando?',
                        'Mi experiencia abarca todos los aspectos del compliance. ¿Te gustaría explorar algún tema específico?',
                    ]
                }
            },
            auditor: {
                name: 'Ana Auditora',
                specialty: 'Experta en Auditorías',
                personality: 'strict',
                description: 'Especialista en auditorías internas y evaluación de controles',
                icon: 'fas fa-search',
                welcomeMessage: 'Hola, soy Ana Auditora. Mi enfoque está en la evaluación rigurosa de controles y procesos. ¿Qué aspecto de auditoría o control interno te interesa revisar?',
                responses: {
                    compliance: [
                        'Desde una perspectiva de auditoría, el compliance debe ser verificable y medible a través de controles documentados.',
                        'Los hallazgos de auditoría son oportunidades de mejora; cada deficiencia identificada debe tener un plan de acción correctivo.',
                        'Un programa de compliance auditable requiere documentación exhaustiva y evidencia de implementación efectiva.',
                    ],
                    risk: [
                        'Los controles de riesgo deben ser evaluados regularmente para asegurar su efectividad operativa.',
                        'Una auditoría de riesgos efectiva examina tanto el diseño como la implementación de los controles.',
                        'Los riesgos no mitigados representan exposiciones significativas que requieren atención inmediata de la gerencia.',
                    ],
                    ethics: [
                        'La cultura ética se audita observando comportamientos, no solo políticas escritas.',
                        'Los indicadores de una cultura ética sólida incluyen reportes de incidentes y resolución transparente.',
                        'Las pruebas de cumplimiento ético deben incluir revisiones de transacciones y entrevistas con el personal.',
                    ],
                    training: [
                        'La efectividad de la capacitación debe medirse a través de pruebas de conocimiento y observación del comportamiento.',
                        'Los registros de capacitación deben ser completos y demostrables para propósitos de auditoría.',
                        'Las brechas en capacitación identificadas durante auditorías requieren planes de remediación inmediatos.',
                    ],
                    general: [
                        'Como auditora, necesito detalles específicos para proporcionar una evaluación precisa. ¿Qué proceso quieres examinar?',
                        '¿Hay algún control específico o área de riesgo que necesite evaluación detallada?',
                        'Mi enfoque es identificar brechas y oportunidades de mejora. ¿Qué área requiere escrutinio?',
                    ]
                }
            },
            executive: {
                name: 'Carlos CEO',
                specialty: 'Director Ejecutivo',
                personality: 'formal',
                description: 'Líder empresarial enfocado en estrategia y resultados',
                icon: 'fas fa-crown',
                welcomeMessage: 'Saludos, soy Carlos CEO. Mi perspectiva se centra en cómo el compliance y la ética contribuyen al éxito empresarial sostenible. ¿Cómo puedo ayudarte desde una perspectiva estratégica?',
                responses: {
                    compliance: [
                        'El compliance no es solo un costo; es una inversión en la sostenibilidad y reputación del negocio.',
                        'Un programa de compliance efectivo debe alinearse con los objetivos estratégicos y crear ventaja competitiva.',
                        'Los fallos de compliance pueden destruir décadas de construcción de marca en cuestión de días.',
                    ],
                    risk: [
                        'La gestión de riesgos debe estar integrada en todas las decisiones estratégicas y operativas.',
                        'Los riesgos de reputación y regulatorios pueden tener impactos financieros devastadores si no se gestionan adecuadamente.',
                        'Una cultura de gestión de riesgos robusta permite innovación responsable y crecimiento sostenible.',
                    ],
                    ethics: [
                        'La ética empresarial es fundamental para la confianza de stakeholders y el éxito a largo plazo.',
                        'Como líderes, debemos modelar los comportamientos éticos que esperamos de nuestros equipos.',
                        'Las decisiones éticas a veces requieren sacrificar ganancias a corto plazo por beneficios a largo plazo.',
                    ],
                    training: [
                        'La inversión en capacitación es una inversión en el capital humano más importante de la organización.',
                        'Los programas de desarrollo deben preparar a los empleados para enfrentar desafíos éticos complejos.',
                        'El ROI de la capacitación en compliance se mide en prevención de pérdidas y protección de reputación.',
                    ],
                    general: [
                        'Desde una perspectiva ejecutiva, todo se trata de crear valor sostenible. ¿Cómo puedo ayudarte con eso?',
                        'Mi enfoque está en cómo estos temas impactan los resultados del negocio. ¿Qué desafío estratégico enfrentas?',
                        '¿Hay alguna decisión empresarial donde los aspectos de compliance y ética sean cruciales?',
                    ]
                }
            }
        };
        
        const saved = localStorage.getItem('flaisimulator_characters');
        return saved ? JSON.parse(saved) : defaultCharacters;
    }

    saveCharacters() {
        localStorage.setItem('flaisimulator_characters', JSON.stringify(this.characters));
    }

    loadInitialData() {
        // Initialize with some demo data if first time
        if (this.userStats.gamesCompleted === 0 && this.userStats.conversationCount === 0) {
            this.userStats = {
                gamesCompleted: 3,
                trainingHours: 2.5,
                averageScore: 87,
                conversationCount: 12
            };
            this.saveUserStats();
            this.updateDashboardStats();
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FlaiSimulator();
    
    // Make app globally available for debugging
    window.flaiSimulator = app;
});