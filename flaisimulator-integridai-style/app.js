// FlaiSimulator - Aplicación Completa con Estética Minimax
class FlaiSimulator {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentCharacter = 'mentor';
        this.userProgress = this.loadUserProgress();
        this.characters = this.loadCharacters();
        this.scenarios = this.loadScenarios();
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        this.setupTabs();
        this.loadInitialData();
        
        // Initialize with demo data if first time
        if (Object.keys(this.userProgress).length === 0) {
            this.initializeDemoData();
        }
    }

    // Navigation Management
    setupNavigation() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const accessBtn = document.getElementById('accessBtn');
        const startTrainingBtn = document.getElementById('startTrainingBtn');
        const learnLawBtn = document.getElementById('learnLawBtn');

        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Modal triggers
        [accessBtn, startTrainingBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.openSimulator();
                });
            }
        });

        if (learnLawBtn) {
            learnLawBtn.addEventListener('click', () => {
                this.openSimulator('training');
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Modal Management
    setupModal() {
        const modal = document.getElementById('simulatorModal');
        const closeBtn = document.getElementById('closeSimulatorModal');

        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Tab System
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'text-primary-600', 'border-primary-600');
            btn.classList.add('text-gray-500');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.add('active', 'text-primary-600', 'border-primary-600', 'border-b-2');
        activeBtn.classList.remove('text-gray-500');

        // Update content
        this.currentTab = tabName;
        this.renderTabContent();
    }

    renderTabContent() {
        const content = document.getElementById('simulatorContent');
        
        switch (this.currentTab) {
            case 'dashboard':
                content.innerHTML = this.getDashboardContent();
                this.setupDashboardEvents();
                break;
            case 'gaming':
                content.innerHTML = this.getGamingContent();
                this.setupGamingEvents();
                break;
            case 'training':
                content.innerHTML = this.getTrainingContent();
                this.setupTrainingEvents();
                break;
            case 'characters':
                content.innerHTML = this.getCharactersContent();
                this.setupCharactersEvents();
                break;
        }
        
        // Reinitialize Lucide icons for new content
        lucide.createIcons();
    }

    // Dashboard Content
    getDashboardContent() {
        const stats = this.getUserStats();
        
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-primary-600 text-sm font-medium">Juegos Completados</p>
                                <p class="text-2xl font-bold text-primary-900">${stats.gamesCompleted}</p>
                            </div>
                            <i data-lucide="gamepad-2" class="w-8 h-8 text-primary-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-secondary-600 text-sm font-medium">Horas de Capacitación</p>
                                <p class="text-2xl font-bold text-secondary-900">${stats.trainingHours}h</p>
                            </div>
                            <i data-lucide="clock" class="w-8 h-8 text-secondary-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 border border-accent-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-accent-600 text-sm font-medium">Puntuación Promedio</p>
                                <p class="text-2xl font-bold text-accent-900">${stats.averageScore}/100</p>
                            </div>
                            <i data-lucide="star" class="w-8 h-8 text-accent-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 border border-neutral-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-neutral-600 text-sm font-medium">Conversaciones IA</p>
                                <p class="text-2xl font-bold text-neutral-900">${stats.conversations}</p>
                            </div>
                            <i data-lucide="message-circle" class="w-8 h-8 text-neutral-600"></i>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Progreso de Certificación</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-600">Teoría Ley 27.401</span>
                                    <span class="font-medium text-primary-600">${stats.theoryProgress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: ${stats.theoryProgress}%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-600">Escenarios Prácticos</span>
                                    <span class="font-medium text-secondary-600">${stats.practicalProgress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-secondary-600 h-2 rounded-full transition-all duration-300" style="width: ${stats.practicalProgress}%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-gray-600">Evaluación Final</span>
                                    <span class="font-medium text-accent-600">${stats.evaluationProgress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-accent-600 h-2 rounded-full transition-all duration-300" style="width: ${stats.evaluationProgress}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <button id="continueCertification" class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                                Continuar Certificación
                            </button>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                        <div class="space-y-4">
                            ${this.getRecentActivities().map(activity => `
                                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div class="w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center">
                                        <i data-lucide="${activity.icon}" class="w-4 h-4 text-${activity.color}-600"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                                        <p class="text-xs text-gray-500">${activity.time}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Gaming Content
    getGamingContent() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h3 class="text-2xl font-heading font-bold text-gray-900 mb-2">Escenarios Interactivos</h3>
                    <p class="text-gray-600">Practica con situaciones reales del mundo empresarial argentino</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${this.scenarios.map(scenario => `
                        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer scenario-card" data-scenario="${scenario.id}">
                            <div class="w-12 h-12 bg-gradient-to-br from-${scenario.color}-500 to-${scenario.color}-600 rounded-xl flex items-center justify-center mb-4">
                                <i data-lucide="${scenario.icon}" class="w-6 h-6 text-white"></i>
                            </div>
                            
                            <h4 class="text-lg font-heading font-semibold text-gray-900 mb-2">${scenario.title}</h4>
                            <p class="text-gray-600 text-sm mb-4">${scenario.description}</p>
                            
                            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span><i data-lucide="clock" class="w-4 h-4 inline mr-1"></i> ${scenario.duration} min</span>
                                <span><i data-lucide="users" class="w-4 h-4 inline mr-1"></i> ${scenario.difficulty}</span>
                            </div>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-xs px-2 py-1 bg-${scenario.color}-100 text-${scenario.color}-800 rounded-full">
                                    ${scenario.category}
                                </span>
                                <div class="flex items-center">
                                    ${Array.from({length: 5}, (_, i) => `
                                        <i data-lucide="star" class="w-4 h-4 ${i < scenario.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Game Modal Placeholder -->
                <div id="gameModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div class="p-8" id="gameContent">
                            <!-- Game content will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Training Content
    getTrainingContent() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Character Selection -->
                <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Seleccionar Personaje</h3>
                    
                    <div class="space-y-3">
                        ${Object.entries(this.characters).map(([key, character]) => `
                            <div class="character-option p-3 rounded-lg border cursor-pointer hover:border-primary-300 transition-colors ${key === this.currentCharacter ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}" data-character="${key}">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-gradient-to-br from-${character.color}-500 to-${character.color}-600 rounded-full flex items-center justify-center">
                                        <i data-lucide="${character.icon}" class="w-6 h-6 text-white"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">${character.name}</h4>
                                        <p class="text-xs text-gray-600">${character.specialty}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Conversation Panel -->
                <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col h-96">
                    <!-- Header -->
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-${this.characters[this.currentCharacter].color}-500 to-${this.characters[this.currentCharacter].color}-600 rounded-full flex items-center justify-center">
                                <i data-lucide="${this.characters[this.currentCharacter].icon}" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900" id="activeCharacterName">${this.characters[this.currentCharacter].name}</h4>
                                <p class="text-xs text-gray-600">${this.characters[this.currentCharacter].specialty}</p>
                            </div>
                        </div>
                        <button id="clearConversation" class="text-gray-500 hover:text-gray-700">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Conversation Area -->
                    <div class="flex-1 p-4 overflow-y-auto space-y-4" id="conversationArea">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-gradient-to-br from-${this.characters[this.currentCharacter].color}-500 to-${this.characters[this.currentCharacter].color}-600 rounded-full flex items-center justify-center">
                                <i data-lucide="${this.characters[this.currentCharacter].icon}" class="w-4 h-4 text-white"></i>
                            </div>
                            <div class="bg-gray-100 rounded-xl p-3 max-w-xs">
                                <p class="text-sm text-gray-800">${this.characters[this.currentCharacter].welcomeMessage}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="p-4 border-t border-gray-200">
                        <div class="flex space-x-3">
                            <input 
                                type="text" 
                                id="messageInput" 
                                placeholder="Escribe tu mensaje sobre compliance..." 
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                            <button id="sendMessage" class="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors">
                                <i data-lucide="send" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Characters Management Content
    getCharactersContent() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Character List -->
                <div class="space-y-4">
                    <h3 class="text-lg font-heading font-semibold text-gray-900">Gestión de Personajes</h3>
                    
                    ${Object.entries(this.characters).map(([key, character]) => `
                        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div class="w-16 h-16 bg-gradient-to-br from-${character.color}-500 to-${character.color}-600 rounded-full flex items-center justify-center">
                                        <i data-lucide="${character.icon}" class="w-8 h-8 text-white"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-semibold text-gray-900">${character.name}</h4>
                                        <p class="text-sm text-gray-600">${character.specialty}</p>
                                        <p class="text-xs text-gray-500 mt-1">${character.personality}</p>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button class="edit-character-btn px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors" data-character="${key}">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Character Editor -->
                <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                    <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Editor de Personaje</h3>
                    
                    <form id="characterEditor" class="space-y-4">
                        <input type="hidden" id="editingCharacter" value="">
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" id="characterName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                            <input type="text" id="characterSpecialty" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Personalidad</label>
                            <select id="characterPersonality" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="formal">Formal y Profesional</option>
                                <option value="friendly">Amigable y Cercano</option>
                                <option value="strict">Estricto y Detallado</option>
                                <option value="mentor">Mentor y Guía</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje de Bienvenida</label>
                            <textarea id="characterWelcome" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button type="submit" class="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                Guardar Cambios
                            </button>
                            <button type="button" id="cancelEdit" class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Event Handlers Setup
    setupDashboardEvents() {
        const continueBtn = document.getElementById('continueCertification');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.switchTab('training');
            });
        }
    }

    setupGamingEvents() {
        // Scenario cards
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                const scenarioId = card.getAttribute('data-scenario');
                this.startScenario(scenarioId);
            });
        });
    }

    setupTrainingEvents() {
        // Character selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', () => {
                const characterKey = option.getAttribute('data-character');
                this.selectCharacter(characterKey);
            });
        });

        // Message sending
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessage');
        const clearBtn = document.getElementById('clearConversation');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearConversation());
        }
    }

    setupCharactersEvents() {
        // Edit character buttons
        document.querySelectorAll('.edit-character-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const characterKey = btn.getAttribute('data-character');
                this.editCharacter(characterKey);
            });
        });

        // Character editor form
        const form = document.getElementById('characterEditor');
        const cancelBtn = document.getElementById('cancelEdit');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCharacter();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
    }

    // Game Logic
    startScenario(scenarioId) {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        const modal = document.getElementById('gameModal');
        const content = document.getElementById('gameContent');
        
        content.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-${scenario.color}-500 to-${scenario.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${scenario.icon}" class="w-8 h-8 text-white"></i>
                </div>
                <h3 class="text-2xl font-heading font-bold text-gray-900 mb-4">${scenario.title}</h3>
                <p class="text-gray-600 mb-6">${scenario.fullDescription}</p>
                
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3">¿Cuál sería tu decisión?</h4>
                    <div class="space-y-3">
                        ${scenario.options.map((option, index) => `
                            <button class="scenario-option w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-white transition-all" data-option="${index}">
                                <span class="font-medium">${String.fromCharCode(65 + index)}.</span> ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="document.getElementById('gameModal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700">
                    Cerrar
                </button>
            </div>
        `;

        // Add option event listeners
        content.querySelectorAll('.scenario-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const optionIndex = parseInt(btn.getAttribute('data-option'));
                this.processScenarioAnswer(scenario, optionIndex);
            });
        });

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    processScenarioAnswer(scenario, optionIndex) {
        const isCorrect = optionIndex === scenario.correctAnswer;
        const content = document.getElementById('gameContent');
        
        // Update user progress
        this.userProgress.gamesCompleted++;
        if (isCorrect) {
            this.userProgress.averageScore = Math.min(100, this.userProgress.averageScore + 2);
        }
        this.saveUserProgress();

        content.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 ${isCorrect ? 'bg-secondary-500' : 'bg-yellow-500'} rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${isCorrect ? 'check' : 'alert-triangle'}" class="w-8 h-8 text-white"></i>
                </div>
                <h3 class="text-2xl font-heading font-bold text-gray-900 mb-4">
                    ${isCorrect ? '¡Excelente Decisión!' : 'Buena Reflexión'}
                </h3>
                <p class="text-gray-600 mb-6">${scenario.feedback[optionIndex]}</p>
                
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 class="font-semibold text-gray-900 mb-2">Puntuación obtenida:</h4>
                    <div class="text-3xl font-bold ${isCorrect ? 'text-secondary-600' : 'text-yellow-600'}">${isCorrect ? '+10' : '+5'} puntos</div>
                </div>
                
                <div class="flex space-x-3">
                    <button onclick="document.getElementById('gameModal').classList.add('hidden')" class="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors">
                        Continuar
                    </button>
                    <button onclick="document.getElementById('gameModal').classList.add('hidden'); window.flaiSimulator.switchTab('gaming')" class="px-6 py-3 text-primary-600 border border-primary-600 rounded-xl hover:bg-primary-50 transition-colors">
                        Más Escenarios
                    </button>
                </div>
            </div>
        `;
        
        lucide.createIcons();
    }

    // Training Logic
    selectCharacter(characterKey) {
        this.currentCharacter = characterKey;
        
        // Update UI
        document.querySelectorAll('.character-option').forEach(option => {
            option.classList.remove('border-primary-500', 'bg-primary-50');
            option.classList.add('border-gray-200');
        });
        
        document.querySelector(`[data-character="${characterKey}"]`).classList.add('border-primary-500', 'bg-primary-50');
        
        // Update conversation header
        const character = this.characters[characterKey];
        document.getElementById('activeCharacterName').textContent = character.name;
        
        // Clear and reset conversation
        this.clearConversation();
        this.addAIMessage(character.welcomeMessage);
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Update progress
        this.userProgress.conversations++;
        this.userProgress.trainingHours += 0.1;
        this.saveUserProgress();
        
        // Generate AI response
        try {
            const response = await this.generateAIResponse(message);
            this.addAIMessage(response);
        } catch (error) {
            console.error('Error generating AI response:', error);
            this.addAIMessage("Disculpa, tuve un problema técnico. ¿Podrías repetir tu pregunta?");
        }
    }

    addUserMessage(message) {
        const area = document.getElementById('conversationArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 justify-end';
        messageDiv.innerHTML = `
            <div class="bg-primary-600 text-white rounded-xl p-3 max-w-xs">
                <p class="text-sm">${message}</p>
            </div>
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <i data-lucide="user" class="w-4 h-4 text-white"></i>
            </div>
        `;
        area.appendChild(messageDiv);
        area.scrollTop = area.scrollHeight;
        lucide.createIcons();
    }

    addAIMessage(message) {
        const area = document.getElementById('conversationArea');
        const character = this.characters[this.currentCharacter];
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3';
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-br from-${character.color}-500 to-${character.color}-600 rounded-full flex items-center justify-center">
                <i data-lucide="${character.icon}" class="w-4 h-4 text-white"></i>
            </div>
            <div class="bg-gray-100 rounded-xl p-3 max-w-xs">
                <p class="text-sm text-gray-800">${message}</p>
            </div>
        `;
        area.appendChild(messageDiv);
        area.scrollTop = area.scrollHeight;
        lucide.createIcons();
    }

    clearConversation() {
        const area = document.getElementById('conversationArea');
        area.innerHTML = '';
    }

    async generateAIResponse(message) {
        try {
            // Show typing indicator
            this.showTypingIndicator();
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    character: this.currentCharacter
                })
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (data.success) {
                return data.response;
            } else {
                console.error('AI API Error:', data.error);
                return this.getFallbackResponse(message);
            }
            
        } catch (error) {
            console.error('Network Error:', error);
            this.hideTypingIndicator();
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const character = this.characters[this.currentCharacter];
        const lowerMessage = message.toLowerCase();
        
        // Intelligent fallback responses per character
        const fallbackResponses = {
            mentor: {
                default: "Como experto en compliance, te puedo decir que es una excelente pregunta. La Ley 27.401 establece marcos claros para estos casos. ¿Podrías ser más específico sobre tu situación?",
                regalos: "Según la normativa, las políticas de regalos deben establecer límites claros. Recomiendo máximo $500 ARS y registro obligatorio para cualquier obsequio.",
                compliance: "El compliance efectivo requiere tres elementos: prevención, detección y respuesta. ¿En cuál de estos aspectos necesitas más orientación?"
            },
            auditora: {
                default: "En mi experiencia auditando programas de integridad, veo que necesitas una solución práctica. ¿Qué controles tienes implementados actualmente?",
                regalos: "Para control de regalos implementamos: registro digital, aprobaciones automáticas hasta $300 y manual para superiores. ¿Tienes algún sistema similar?",
                compliance: "Como auditora, siempre evalúo efectividad vs esfuerzo. ¿Tu programa actual está generando los resultados esperados?"
            },
            ceo: {
                default: "Desde la perspectiva ejecutiva, el compliance debe crear valor para el negocio. ¿Cómo está impactando este tema en tus objetivos estratégicos?",
                regalos: "Las políticas deben equilibrar relaciones comerciales y cumplimiento. ¿Has evaluado el impacto en tus clientes y proveedores?",
                compliance: "El compliance es inversión estratégica que protege reputación y reduce riesgos. ¿Necesitas ayuda con el business case?"
            }
        };
        
        const charResponses = fallbackResponses[this.currentCharacter] || fallbackResponses.mentor;
        
        if (lowerMessage.includes('regalo') || lowerMessage.includes('obsequio')) {
            return charResponses.regalos || charResponses.default;
        } else if (lowerMessage.includes('compliance') || lowerMessage.includes('cumplimiento')) {
            return charResponses.compliance || charResponses.default;
        } else {
            return charResponses.default;
        }
    }

    showTypingIndicator() {
        const area = document.getElementById('conversationArea');
        const character = this.characters[this.currentCharacter];
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'flex items-start space-x-3';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-br from-${character.color}-500 to-${character.color}-600 rounded-full flex items-center justify-center">
                <i data-lucide="${character.icon}" class="w-4 h-4 text-white"></i>
            </div>
            <div class="bg-gray-100 rounded-xl p-3 max-w-xs">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        area.appendChild(typingDiv);
        area.scrollTop = area.scrollHeight;
        lucide.createIcons();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Character Management
    editCharacter(characterKey) {
        const character = this.characters[characterKey];
        
        document.getElementById('editingCharacter').value = characterKey;
        document.getElementById('characterName').value = character.name;
        document.getElementById('characterSpecialty').value = character.specialty;
        document.getElementById('characterPersonality').value = character.personality;
        document.getElementById('characterWelcome').value = character.welcomeMessage;
    }

    saveCharacter() {
        const characterKey = document.getElementById('editingCharacter').value;
        if (!characterKey) return;
        
        const character = this.characters[characterKey];
        character.name = document.getElementById('characterName').value;
        character.specialty = document.getElementById('characterSpecialty').value;
        character.personality = document.getElementById('characterPersonality').value;
        character.welcomeMessage = document.getElementById('characterWelcome').value;
        
        this.saveCharacters();
        this.renderTabContent(); // Refresh the display
        
        // Show success message
        this.showNotification('Personaje actualizado exitosamente', 'success');
    }

    cancelEdit() {
        document.getElementById('characterEditor').reset();
        document.getElementById('editingCharacter').value = '';
    }

    // Modal Management
    openSimulator(tab = 'dashboard') {
        const modal = document.getElementById('simulatorModal');
        modal.classList.remove('hidden');
        this.switchTab(tab);
    }

    // Utility Functions
    getUserStats() {
        return {
            gamesCompleted: this.userProgress.gamesCompleted || 0,
            trainingHours: Math.round((this.userProgress.trainingHours || 0) * 10) / 10,
            averageScore: this.userProgress.averageScore || 0,
            conversations: this.userProgress.conversations || 0,
            theoryProgress: Math.min(100, (this.userProgress.gamesCompleted || 0) * 5),
            practicalProgress: Math.min(100, (this.userProgress.conversations || 0) * 2),
            evaluationProgress: this.userProgress.averageScore || 0
        };
    }

    getRecentActivities() {
        return [
            { icon: 'gamepad-2', title: 'Completado: Escenario Corporativo', time: 'Hace 2 horas', color: 'primary' },
            { icon: 'message-circle', title: 'Conversación con Dr. Mentor', time: 'Hace 4 horas', color: 'secondary' },
            { icon: 'star', title: 'Nueva puntuación récord: 95', time: 'Ayer', color: 'accent' },
            { icon: 'book-open', title: 'Módulo Ley 27.401 completado', time: 'Hace 2 días', color: 'neutral' }
        ];
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-secondary-600 text-white' : 
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-primary-600 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Data Management
    initializeDemoData() {
        this.userProgress = {
            gamesCompleted: 5,
            trainingHours: 3.2,
            averageScore: 87,
            conversations: 15
        };
        this.saveUserProgress();
    }

    loadUserProgress() {
        const saved = localStorage.getItem('flaisimulator_progress');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserProgress() {
        localStorage.setItem('flaisimulator_progress', JSON.stringify(this.userProgress));
    }

    loadCharacters() {
        const defaultCharacters = {
            mentor: {
                name: 'Dr. Mentor',
                specialty: 'Especialista en Compliance',
                personality: 'mentor',
                color: 'primary',
                icon: 'user-tie',
                welcomeMessage: '¡Hola! Soy el Dr. Mentor. Estoy aquí para ayudarte con cualquier pregunta sobre compliance y la Ley 27.401. ¿En qué tema te gustaría profundizar hoy?',
                responses: {
                    compliance: [
                        'El compliance efectivo según la Ley 27.401 requiere un enfoque integral que incluya políticas claras, capacitación regular y monitoreo continuo.',
                        'Un programa de compliance robusto debe adaptarse continuamente a los cambios regulatorios y las mejores prácticas de la industria.',
                        'La evaluación de riesgos es fundamental para un compliance efectivo bajo la Ley 27.401.'
                    ],
                    risk: [
                        'La gestión de riesgos debe ser proactiva, identificando y mitigando riesgos potenciales antes de que se materialicen según la normativa argentina.',
                        'Es fundamental establecer una matriz de riesgos que priorice las amenazas según su probabilidad e impacto en el contexto de la Ley 27.401.'
                    ],
                    ethics: [
                        'La ética empresarial va más allá del cumplimiento legal de la Ley 27.401; implica hacer lo correcto incluso cuando nadie está mirando.',
                        'Un código de ética efectivo debe ser claro, aplicable y comunicado regularmente a todos los niveles de la organización.'
                    ],
                    law: [
                        'La Ley 27.401 establece la responsabilidad penal de las personas jurídicas por delitos de cohecho y cohecho transnacional.',
                        'El programa de integridad contemplado en el artículo 23 de la Ley 27.401 es fundamental para la defensa empresarial.',
                        'Los elementos clave del programa incluyen código de ética, procedimientos, capacitación, sistema de denuncias y evaluación de riesgos.'
                    ],
                    general: [
                        'Estoy aquí para ayudarte con cualquier aspecto de compliance y la Ley 27.401. ¿Hay algún tema específico que te interese?',
                        '¿Te gustaría que profundicemos en algún aspecto particular de la implementación de programas de integridad?'
                    ]
                }
            },
            auditor: {
                name: 'Ana Auditora',
                specialty: 'Experta en Auditorías',
                personality: 'strict',
                color: 'secondary',
                icon: 'search',
                welcomeMessage: 'Hola, soy Ana Auditora. Mi enfoque está en la evaluación rigurosa de controles y procesos bajo la Ley 27.401. ¿Qué aspecto quieres revisar?',
                responses: {
                    compliance: [
                        'Desde una perspectiva de auditoría, el compliance debe ser verificable y medible a través de controles documentados según la Ley 27.401.',
                        'Los hallazgos de auditoría son oportunidades de mejora; cada deficiencia debe tener un plan de acción correctivo.',
                        'Un programa auditable requiere documentación exhaustiva y evidencia de implementación efectiva.'
                    ],
                    risk: [
                        'Los controles de riesgo deben evaluarse regularmente para asegurar su efectividad operativa bajo los estándares de la Ley 27.401.',
                        'Una auditoría de riesgos efectiva examina tanto el diseño como la implementación de los controles.'
                    ],
                    ethics: [
                        'La cultura ética se audita observando comportamientos, no solo políticas escritas.',
                        'Los indicadores de una cultura ética sólida incluyen reportes de incidentes y resolución transparente.'
                    ],
                    law: [
                        'La Ley 27.401 requiere evidencia documental de todos los componentes del programa de integridad.',
                        'Los auditores deben verificar la implementación efectiva, no solo la existencia formal de políticas.',
                        'La trazabilidad y documentación son clave para demostrar cumplimiento ante autoridades.'
                    ],
                    general: [
                        'Como auditora, necesito detalles específicos para proporcionar una evaluación precisa. ¿Qué proceso quieres examinar?',
                        '¿Hay algún control específico o área de riesgo que necesite evaluación detallada?'
                    ]
                }
            },
            executive: {
                name: 'Carlos CEO',
                specialty: 'Director Ejecutivo',
                personality: 'formal',
                color: 'accent',
                icon: 'crown',
                welcomeMessage: 'Saludos, soy Carlos CEO. Mi perspectiva se centra en cómo la Ley 27.401 impacta la estrategia empresarial. ¿Cómo puedo ayudarte desde una perspectiva ejecutiva?',
                responses: {
                    compliance: [
                        'El compliance bajo la Ley 27.401 no es solo un costo; es una inversión en la sostenibilidad y reputación del negocio.',
                        'Un programa efectivo debe alinearse con los objetivos estratégicos y crear ventaja competitiva.',
                        'Los fallos de compliance pueden destruir décadas de construcción de marca en días.'
                    ],
                    risk: [
                        'La gestión de riesgos debe integrarse en todas las decisiones estratégicas y operativas.',
                        'Los riesgos reputacionales pueden tener impactos financieros devastadores si no se gestionan adecuadamente.',
                        'Una cultura de gestión de riesgos robusta permite innovación responsable y crecimiento sostenible.'
                    ],
                    ethics: [
                        'La ética empresarial es fundamental para la confianza de stakeholders y el éxito a largo plazo.',
                        'Como líderes, debemos modelar los comportamientos éticos que esperamos de nuestros equipos.',
                        'Las decisiones éticas requieren sacrificar ganancias a corto plazo por beneficios a largo plazo.'
                    ],
                    law: [
                        'La Ley 27.401 representa una oportunidad para diferenciarnos competitivamente a través del compliance.',
                        'La implementación proactiva del programa de integridad puede ser un factor diferenciador en licitaciones.',
                        'El cumplimiento de la Ley 27.401 protege no solo legalmente sino también la valoración de la empresa.'
                    ],
                    general: [
                        'Desde una perspectiva ejecutiva, todo se trata de crear valor sostenible. ¿Cómo puedo ayudarte con eso?',
                        'Mi enfoque está en cómo estos temas impactan los resultados del negocio. ¿Qué desafío estratégico enfrentas?'
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

    loadScenarios() {
        return [
            {
                id: 'corporate-gift',
                title: 'Regalo Corporativo',
                description: 'Un cliente ofrece un regalo costoso para acelerar un proceso.',
                fullDescription: 'Te encuentras en una reunión donde un cliente potencial sugiere un "regalo especial" para acelerar la aprobación de un contrato importante. El regalo tiene un valor considerable y podría influir en tu decisión.',
                category: 'Soborno',
                difficulty: 'Intermedio',
                duration: 15,
                rating: 5,
                color: 'primary',
                icon: 'gift',
                options: [
                    'Acepto el regalo para cerrar el negocio rápidamente',
                    'Rechazo educadamente y explico nuestras políticas',
                    'Sugiero una alternativa legal que beneficie a ambas partes',
                    'Consulto con mi supervisor antes de decidir'
                ],
                correctAnswer: 1,
                feedback: {
                    0: 'Incorrecto. Aceptar regalos inapropiados viola la Ley 27.401 y puede constituir soborno.',
                    1: '¡Excelente! Rechazar y explicar políticas es la respuesta correcta según la Ley 27.401.',
                    2: 'Buena respuesta. Buscar alternativas legales demuestra proactividad en compliance.',
                    3: 'Correcto. Consultar supervisores en situaciones dudosas es práctica recomendada.'
                }
            },
            {
                id: 'confidential-info',
                title: 'Información Confidencial',
                description: 'Descubres información privilegiada de la competencia.',
                fullDescription: 'Durante una negociación importante, descubres información confidencial sobre la competencia que podría darte una ventaja significativa. La información llegó a ti de manera irregular.',
                category: 'Ética',
                difficulty: 'Avanzado',
                duration: 20,
                rating: 4,
                color: 'secondary',
                icon: 'eye-off',
                options: [
                    'Uso la información para ganar la negociación',
                    'Ignoro la información y continúo éticamente',
                    'Reporto cómo obtuve esta información',
                    'Comparto la información con mi equipo'
                ],
                correctAnswer: 1,
                feedback: {
                    0: 'Incorrecto. Usar información obtenida ilegalmente es antiético y potencialmente ilegal.',
                    1: '¡Correcto! Ignorar información inapropiada mantiene la integridad ética.',
                    2: 'Excelente práctica. Reportar información sospechosa es responsable.',
                    3: 'Incorrecto. Compartir información obtenida ilegalmente extiende el problema ético.'
                }
            },
            {
                id: 'suspicious-transaction',
                title: 'Transacción Sospechosa',
                description: 'Observas transacciones inusuales de un colega.',
                fullDescription: 'Notas que un colega está procesando transacciones inusuales fuera del horario normal, con patrones que no siguen los procedimientos estándar. La situación te genera dudas.',
                category: 'Detección',
                difficulty: 'Básico',
                duration: 12,
                rating: 5,
                color: 'accent',
                icon: 'alert-triangle',
                options: [
                    'Ignoro la situación, no es mi responsabilidad',
                    'Confronto directamente al colega',
                    'Reporto mis observaciones al canal de integridad',
                    'Investigo por mi cuenta antes de actuar'
                ],
                correctAnswer: 2,
                feedback: {
                    0: 'Incorrecto. Todos tienen responsabilidad en la detección de riesgos según la Ley 27.401.',
                    1: 'Riesgoso. La confrontación directa puede comprometer una investigación.',
                    2: '¡Excelente! Reportar al canal de integridad es el procedimiento correcto.',
                    3: 'Peligroso. La investigación personal puede interferir con procesos oficiales.'
                }
            }
        ];
    }

    loadInitialData() {
        // Initialize demo data if needed
        if (Object.keys(this.userProgress).length === 0) {
            this.initializeDemoData();
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flaiSimulator = new FlaiSimulator();
});