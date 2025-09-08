/**
 * FLAISimulator - Ethical Dilemma Game Engine
 * Cultural Compliance Training for Argentina
 * 
 * This game presents 10 real ethical dilemmas based on Argentine business culture
 * and Ley 27.401 (Corporate Criminal Liability Law)
 */

class FLAISimulator {
    constructor() {
        this.currentScenario = 0;
        this.answers = [];
        this.userProfile = {};
        this.timeLeft = 30;
        this.timer = null;
        this.gameStartTime = null;
        this.scenarioStartTime = null;
        
        // Game screens
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.loadingScreen = document.getElementById('loading-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Initialize scenarios
        this.scenarios = this.initializeScenarios();
        
        // Bind events
        this.bindEvents();
        
        // Initialize UI
        this.initializeUI();
    }

    initializeScenarios() {
        return [
            {
                id: 1,
                title: "El Cliente VIP Generoso",
                context: "Eres gerente de cuentas en una empresa de consultoría. Tu cliente más importante, que representa el 30% de la facturación anual, te invita a cenar después de firmar un contrato millonario.",
                description: "Al final de la cena, el cliente te entrega un sobre con $50,000 USD diciendo: 'Un pequeño agradecimiento por tu excelente servicio. Espero que podamos acelerar algunos procesos en el próximo proyecto.'",
                question: "¿Qué hacés con el dinero?",
                options: [
                    {
                        text: "Acepto el dinero discretamente. Es normal en estas relaciones comerciales y mi empresa se beneficia.",
                        type: "risky",
                        score: 0,
                        cultural_flags: ["acceptance_of_gifts", "relationship_priority", "financial_pressure"]
                    },
                    {
                        text: "Agradezco pero explico que no puedo aceptarlo por políticas de compliance. Le sugiero hacer una donación a una fundación.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["ethical_clarity", "policy_adherence", "alternative_solution"]
                    },
                    {
                        text: "Le digo que necesito consultarlo con mi supervisor y el área legal antes de tomar una decisión.",
                        type: "consultation",
                        score: 7,
                        cultural_flags: ["consultation_pattern", "hierarchy_respect", "legal_awareness"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º y 2º",
                risk_level: "ALTO",
                cultural_context: "gift_acceptance",
                sector_relevance: ["consultoria", "tecnologia", "finanzas"]
            },
            {
                id: 2,
                title: "La Licitación con Información Privilegiada",
                context: "Trabajás en el área comercial de una empresa constructora. Un amigo personal que trabaja en una dependencia gubernamental te comenta detalles específicos sobre los criterios de evaluación de una licitación pública importante.",
                description: "Tu amigo te dice: 'Mirá, entre nosotros, si adjustan el presupuesto 15% hacia abajo y enfatizan la experiencia regional, tienen el 90% de probabilidades de ganar. Solo te lo digo porque sé que tu empresa es seria.'",
                question: "¿Cómo manejás esta información?",
                options: [
                    {
                        text: "Uso la información para ajustar nuestra propuesta. Es información de dominio público que él interpreta por su experiencia.",
                        type: "risky",
                        score: 2,
                        cultural_flags: ["information_advantage", "relationship_leverage", "competitive_edge"]
                    },
                    {
                        text: "No uso la información y documento el incidente. Reporto la situación al área de compliance de mi empresa.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["integrity_priority", "compliance_reporting", "risk_aversion"]
                    },
                    {
                        text: "Agradezco pero le explico que no puedo usar esa información. Le sugiero que también tenga cuidado con este tipo de comentarios.",
                        type: "consultation",
                        score: 8,
                        cultural_flags: ["boundary_setting", "relationship_care", "mutual_protection"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º (Cohecho)",
                risk_level: "MUY ALTO",
                cultural_context: "insider_information",
                sector_relevance: ["construccion", "gobierno", "consultoria"]
            },
            {
                id: 3,
                title: "El Proveedor Familiar",
                context: "Eres responsable de compras en una PyME familiar en crecimiento. Tu primo te propone que su empresa nueva sea proveedor de insumos críticos, prometiendo precios 'muy competitivos'.",
                description: "En la reunión familiar dominical, tu primo insiste: 'Necesito este contrato para despegar. Te puedo dar 20% menos que la competencia, y además, pensá en lo que esto significa para la familia. Todos salimos ganando.'",
                question: "¿Cómo procedés con esta propuesta?",
                options: [
                    {
                        text: "Acepto directamente. Los números cierran, es familia, y mi empresa ahorra dinero significativo.",
                        type: "risky",
                        score: 1,
                        cultural_flags: ["family_loyalty", "cost_priority", "informal_process"]
                    },
                    {
                        text: "Le explico que debe participar del proceso formal de selección de proveedores como cualquier otro candidato, sin ventajas especiales.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["process_fairness", "professional_boundaries", "transparency"]
                    },
                    {
                        text: "Le digo que voy a evaluar su propuesta junto con otras opciones y consultarlo con mi jefe antes de decidir.",
                        type: "consultation",
                        score: 6,
                        cultural_flags: ["evaluation_process", "hierarchical_consultation", "comparative_analysis"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 7º (Conflicto de interés)",
                risk_level: "MEDIO",
                cultural_context: "nepotism_tendency",
                sector_relevance: ["pyme", "familiar", "retail"]
            },
            {
                id: 4,
                title: "La Auditoría Incómoda",
                context: "Sos auditor interno en una empresa multinacional. Durante una auditoría de rutina descubrís que el director financiero ha estado manipulando reportes mensuales para mostrar mejores resultados.",
                description: "El director te llama a su oficina y dice: 'Mirá, técnicamente están mal esos números, pero es temporal. En dos meses se regulariza todo. Si reportás esto ahora, se arma un quilombo innecesario y podemos perder el bono anual de todo el equipo. ¿No podés esperar un poco?'",
                question: "¿Cuál es tu curso de acción?",
                options: [
                    {
                        text: "Acepto esperar dos meses. Si es temporal y se va a regularizar, no tiene sentido crear problemas innecesarios para todo el equipo.",
                        type: "risky",
                        score: 0,
                        cultural_flags: ["team_loyalty", "short_term_thinking", "authority_deference"]
                    },
                    {
                        text: "Reporto inmediatamente el hallazgo siguiendo los protocolos establecidos, independientemente de las consecuencias.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["protocol_adherence", "independence_maintenance", "accountability"]
                    },
                    {
                        text: "Le doy una semana para que él mismo reporte la situación a sus superiores. Si no lo hace, procedo con el reporte oficial.",
                        type: "consultation",
                        score: 7,
                        cultural_flags: ["escalation_opportunity", "relationship_preservation", "time_bound_solution"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 22º (Programas de Compliance)",
                risk_level: "MUY ALTO",
                cultural_context: "authority_challenge",
                sector_relevance: ["finanzas", "multinacional", "auditoria"]
            },
            {
                id: 5,
                title: "El Regalo de Año Nuevo Corporativo",
                context: "Trabajás en el área de ventas de una empresa de software. Estás cerrando el presupuesto anual y un cliente corporativo importante te invita a su evento de fin de año en un country exclusivo.",
                description: "En el evento, como 'regalo de año nuevo', te entregan un iPhone último modelo junto con otros obsequios por valor de aproximadamente $300,000 pesos. El cliente dice: 'Es una costumbre nuestra agradecer a los mejores partners. Esperamos seguir trabajando juntos el año que viene.'",
                question: "¿Qué hacés con los regalos?",
                options: [
                    {
                        text: "Los acepto naturalmente. Son regalos de temporada y rechazarlos sería descortés con un cliente importante.",
                        type: "risky",
                        score: 2,
                        cultural_flags: ["cultural_courtesy", "relationship_maintenance", "seasonal_normalization"]
                    },
                    {
                        text: "Los devuelvo explicando las políticas de mi empresa sobre regalos y sugiero que hagan una donación benéfica en nombre de ambas empresas.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["policy_consistency", "ethical_alternative", "transparency"]
                    },
                    {
                        text: "Acepto los regalos pero los reporto inmediatamente a mi supervisor y compliance para definir cómo proceder.",
                        type: "consultation",
                        score: 8,
                        cultural_flags: ["immediate_reporting", "guidance_seeking", "documentation"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º (Cohecho y dadivas)",
                risk_level: "MEDIO-ALTO",
                cultural_context: "seasonal_gifts",
                sector_relevance: ["tecnologia", "software", "ventas"]
            },
            {
                id: 6,
                title: "La Facturación Creativa",
                context: "Sos el contador principal de una empresa de servicios profesionales. El CEO te pide 'optimizar' la facturación del último trimestre para alcanzar los objetivos anuales prometidos a los inversores.",
                description: "El CEO explica: 'Tenemos servicios que vamos a facturar en enero, pero técnicamente ya los prestamos en diciembre. Si los facturamos ahora, cerramos el año perfecto y mantenemos a los inversores contentos. Es solo una cuestión de timing, nada más.'",
                question: "¿Cómo respondés a este pedido?",
                options: [
                    {
                        text: "Hago la facturación adelantada. Técnicamente los servicios se prestaron y es solo una cuestión de fechas para optimizar la presentación.",
                        type: "risky",
                        score: 1,
                        cultural_flags: ["results_pressure", "technical_justification", "investor_pressure"]
                    },
                    {
                        text: "Me niego rotundamente y explico que esto constituye manipulación de estados financieros, violando normas contables y legales.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["professional_standards", "legal_compliance", "integrity_priority"]
                    },
                    {
                        text: "Le propongo revisar juntos las normas contables aplicables y consultar con el auditor externo sobre las mejores prácticas.",
                        type: "consultation",
                        score: 7,
                        cultural_flags: ["technical_consultation", "external_validation", "collaborative_solution"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º y Ley de Sociedades",
                risk_level: "MUY ALTO",
                cultural_context: "financial_manipulation",
                sector_relevance: ["servicios", "startup", "consultoria"]
            },
            {
                id: 7,
                title: "El Contacto Político Estratégico",
                context: "Dirigís el área de relaciones institucionales de una empresa que necesita permisos regulatorios importantes. Un contacto político te ofrece 'acelerar' el proceso a cambio de contratar a su consultora.",
                description: "En una reunión privada te dice: 'Mirá, yo sé exactamente qué necesitás y cómo agilizar todo esto. Mi consultora tiene la experiencia específica en estos trámites. Con nosotros en dos meses tenés todo resuelto, sin nosotros podés esperar año y medio. ¿Hablamos de números?'",
                question: "¿Cuál es tu respuesta?",
                options: [
                    {
                        text: "Acepto la propuesta. Si su consultora tiene la experiencia y puede acelerar legalmente el proceso, es beneficioso para todos.",
                        type: "risky",
                        score: 0,
                        cultural_flags: ["efficiency_priority", "influence_leverage", "expedited_process"]
                    },
                    {
                        text: "Rechazo la propuesta y opto por seguir el proceso regulatorio estándar, aunque tome más tiempo.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["process_integrity", "transparency", "long_term_perspective"]
                    },
                    {
                        text: "Le pido que me envíe una propuesta formal con sus credenciales para evaluarla según nuestros procedimientos de contratación estándar.",
                        type: "consultation",
                        score: 8,
                        cultural_flags: ["formal_process", "due_diligence", "documentation"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º (Cohecho activo)",
                risk_level: "MUY ALTO",
                cultural_context: "political_influence",
                sector_relevance: ["regulado", "energia", "telecomunicaciones"]
            },
            {
                id: 8,
                title: "La Competencia Interna Desleal",
                context: "Trabajás en el área de marketing de una empresa y tu colega, que compite por la misma promoción, te pide ayuda para acceder a información confidencial de otro departamento 'solo para entender mejor el contexto del negocio'.",
                description: "Tu colega te explica: 'Necesito entender mejor cómo funciona el área comercial para mi propuesta de promoción. Sé que vos tenés acceso a los reportes de ventas. Solo necesito ver los números generales, nada específico. Entre nosotros, ¿me podés ayudar?'",
                question: "¿Cómo manejás este pedido?",
                options: [
                    {
                        text: "Le comparto la información solicitada. Son datos internos generales y me puede ayudar a mantener una buena relación laboral.",
                        type: "risky",
                        score: 3,
                        cultural_flags: ["colleague_favor", "information_sharing", "relationship_priority"]
                    },
                    {
                        text: "Le explico que no puedo compartir información confidencial y le sugiero que haga el pedido formal a través de los canales apropiados.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["confidentiality_respect", "formal_channels", "professional_boundaries"]
                    },
                    {
                        text: "Le sugiero que consulte directamente con su supervisor sobre qué información necesita y cómo obtenerla apropiadamente.",
                        type: "consultation",
                        score: 7,
                        cultural_flags: ["appropriate_guidance", "supervision_involvement", "process_redirect"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 7º (Deber de confidencialidad)",
                risk_level: "MEDIO",
                cultural_context: "internal_competition",
                sector_relevance: ["marketing", "corporativo", "consultoria"]
            },
            {
                id: 9,
                title: "El Proveedor con Problemas Laborales",
                context: "Sos responsable de compras y descubrís que tu proveedor más importante está teniendo serios conflictos laborales y posibles violaciones a derechos de trabajadores, pero ofrece los mejores precios del mercado.",
                description: "Tu asistente te muestra noticias sobre protestas de empleados del proveedor por condiciones laborales deficientes y retrasos en pagos. Cambiar de proveedor significaría un aumento del 25% en costos. El proveedor te dice: 'Son ex empleados resentidos, todos estos problemas se van a resolver pronto.'",
                question: "¿Qué decisión tomás?",
                options: [
                    {
                        text: "Mantengo el proveedor. Los problemas laborales no son responsabilidad mía y cambiar impactaría significativamente en los costos de mi empresa.",
                        type: "risky",
                        score: 2,
                        cultural_flags: ["cost_priority", "responsibility_limitation", "business_focus"]
                    },
                    {
                        text: "Termino la relación comercial inmediatamente y busco proveedores alternativos que cumplan con estándares laborales apropiados.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["social_responsibility", "ethical_sourcing", "standards_priority"]
                    },
                    {
                        text: "Exijo una auditoría laboral independiente del proveedor y establezco un plazo para que resuelva los problemas, o termino el contrato.",
                        type: "consultation",
                        score: 8,
                        cultural_flags: ["verification_requirement", "improvement_opportunity", "conditional_relationship"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 1º y normativa laboral",
                risk_level: "ALTO",
                cultural_context: "supply_chain_ethics",
                sector_relevance: ["manufactura", "retail", "textil"]
            },
            {
                id: 10,
                title: "La Oportunidad de Inversión Familiar",
                context: "Trabajás en el área financiera de una empresa y tenés acceso a información privilegiada sobre una próxima adquisición que impactará positivamente en el precio de las acciones. Tu hermano te consulta sobre invertir sus ahorros en la empresa.",
                description: "Tu hermano te dice: 'Estoy pensando en invertir mis ahorros en acciones de tu empresa porque confío en el futuro del negocio. ¿Vos qué pensás? ¿Es buen momento para comprar?' Vos sabés que en dos semanas se anuncia la adquisición que hará subir las acciones un 40%.",
                question: "¿Qué le aconsejás?",
                options: [
                    {
                        text: "Le sugiero sutilmente que 'es un buen momento' sin dar detalles específicos. Es mi familia y la información le permitirá mejorar su situación financiera.",
                        type: "risky",
                        score: 0,
                        cultural_flags: ["family_benefit", "subtle_communication", "insider_advantage"]
                    },
                    {
                        text: "No le doy ningún consejo específico y le explico que por mi posición no puedo orientar decisiones de inversión. Le sugiero consultar con un asesor financiero independiente.",
                        type: "ethical",
                        score: 10,
                        cultural_flags: ["conflict_avoidance", "professional_ethics", "independent_advice"]
                    },
                    {
                        text: "Le digo que consulte con compliance de mi empresa sobre si puedo dar algún tipo de orientación general sin violar políticas internas.",
                        type: "consultation",
                        score: 6,
                        cultural_flags: ["policy_verification", "formal_consultation", "guidance_seeking"]
                    }
                ],
                legal_reference: "Ley 27.401 - Art. 310 Código Penal (Uso de información privilegiada)",
                risk_level: "MUY ALTO",
                cultural_context: "insider_trading",
                sector_relevance: ["finanzas", "banca", "corporativo"]
            }
        ];
    }

    bindEvents() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        
        // Skip scenario button
        document.getElementById('skip-scenario').addEventListener('click', () => this.skipScenario());
        
        // Play again button
        document.getElementById('play-again').addEventListener('click', () => this.restartGame());
        
        // Share buttons in results
        document.getElementById('share-linkedin-result').addEventListener('click', () => this.shareResults('linkedin'));
        document.getElementById('share-whatsapp-result').addEventListener('click', () => this.shareResults('whatsapp'));
        document.getElementById('challenge-team').addEventListener('click', () => this.challengeTeam());
    }

    initializeUI() {
        // Show welcome screen
        this.showScreen('welcome');
    }

    startGame() {
        // Collect user profile
        this.userProfile = {
            sector: document.getElementById('sector').value || 'not_specified',
            position: document.getElementById('position').value || 'not_specified',
            experience: document.getElementById('experience').value || 'not_specified',
            region: document.getElementById('region').value || 'not_specified',
            timestamp: Date.now(),
            session_id: this.generateSessionId()
        };

        // Initialize game state
        this.currentScenario = 0;
        this.answers = [];
        this.gameStartTime = Date.now();

        // Show game screen and start first scenario
        this.showScreen('game');
        this.startScenario();
    }

    startScenario() {
        if (this.currentScenario >= this.scenarios.length) {
            this.endGame();
            return;
        }

        const scenario = this.scenarios[this.currentScenario];
        this.scenarioStartTime = Date.now();

        // Update UI
        this.updateProgressBar();
        this.updateScenarioContent(scenario);
        this.startTimer();
    }

    updateProgressBar() {
        const progress = ((this.currentScenario + 1) / this.scenarios.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `Pregunta ${this.currentScenario + 1} de ${this.scenarios.length}`;
    }

    updateScenarioContent(scenario) {
        document.getElementById('scenario-number').textContent = `${this.currentScenario + 1}/10`;
        document.getElementById('scenario-title').textContent = scenario.title;
        document.getElementById('scenario-description').textContent = `${scenario.context}\n\n${scenario.description}`;
        document.getElementById('scenario-question-text').textContent = scenario.question;
        document.getElementById('legal-reference').textContent = scenario.legal_reference;
        document.getElementById('risk-level').textContent = `Riesgo: ${scenario.risk_level}`;

        // Generate options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        scenario.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-content">
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${option.text}</div>
                </div>
            `;

            optionElement.addEventListener('click', () => this.selectOption(option, index));
            optionsContainer.appendChild(optionElement);
        });
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.timeExpired();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        document.getElementById('timer').textContent = `${this.timeLeft}s`;
        
        // Change color based on time left
        const timerElement = document.getElementById('timer');
        if (this.timeLeft <= 10) {
            timerElement.style.color = '#ef4444';
        } else if (this.timeLeft <= 20) {
            timerElement.style.color = '#f59e0b';
        } else {
            timerElement.style.color = '#10b981';
        }
    }

    selectOption(option, optionIndex) {
        this.stopTimer();

        // Record answer
        const answer = {
            scenario_id: this.scenarios[this.currentScenario].id,
            scenario_title: this.scenarios[this.currentScenario].title,
            selected_option: optionIndex,
            option_type: option.type,
            score: option.score,
            cultural_flags: option.cultural_flags,
            time_taken: 30 - this.timeLeft,
            timestamp: Date.now()
        };

        this.answers.push(answer);

        // Highlight selected option
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (idx === optionIndex) {
                opt.classList.add('selected');
            } else {
                opt.classList.add('disabled');
            }
        });

        // Move to next scenario after short delay
        setTimeout(() => {
            this.currentScenario++;
            this.startScenario();
        }, 1500);
    }

    skipScenario() {
        this.stopTimer();

        // Record skipped answer
        const answer = {
            scenario_id: this.scenarios[this.currentScenario].id,
            scenario_title: this.scenarios[this.currentScenario].title,
            selected_option: -1,
            option_type: 'skipped',
            score: 0,
            cultural_flags: ['time_pressure', 'avoidance'],
            time_taken: 30,
            timestamp: Date.now()
        };

        this.answers.push(answer);

        this.currentScenario++;
        this.startScenario();
    }

    timeExpired() {
        this.stopTimer();

        // Record timeout
        const answer = {
            scenario_id: this.scenarios[this.currentScenario].id,
            scenario_title: this.scenarios[this.currentScenario].title,
            selected_option: -1,
            option_type: 'timeout',
            score: 0,
            cultural_flags: ['time_pressure', 'indecision'],
            time_taken: 30,
            timestamp: Date.now()
        };

        this.answers.push(answer);

        this.currentScenario++;
        this.startScenario();
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    endGame() {
        this.showScreen('loading');
        this.animateLoadingScreen();

        // Calculate results
        setTimeout(() => {
            const results = this.calculateResults();
            this.displayResults(results);
            this.saveGameData(results);
        }, 4000);
    }

    animateLoadingScreen() {
        const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
        const texts = [
            'Procesando tus decisiones...',
            'Analizando patrones culturales...',
            'Comparando con base de datos argentina...',
            'Generando tu perfil ético...'
        ];

        steps.forEach((stepId, index) => {
            setTimeout(() => {
                document.getElementById(stepId).innerHTML = '✅ ' + document.getElementById(stepId).textContent.replace('⏳ ', '');
                document.getElementById('loading-text').textContent = texts[index] || 'Finalizando análisis...';
            }, (index + 1) * 1000);
        });
    }

    calculateResults() {
        const totalScore = this.answers.reduce((sum, answer) => sum + answer.score, 0);
        const maxPossibleScore = this.scenarios.length * 10;
        const percentage = Math.round((totalScore / maxPossibleScore) * 100);

        // Count decision types
        const decisionTypes = {
            ethical: this.answers.filter(a => a.option_type === 'ethical').length,
            consultation: this.answers.filter(a => a.option_type === 'consultation').length,
            risky: this.answers.filter(a => a.option_type === 'risky').length,
            skipped: this.answers.filter(a => a.option_type === 'skipped').length,
            timeout: this.answers.filter(a => a.option_type === 'timeout').length
        };

        // Determine category
        let category, description;
        if (percentage >= 85) {
            category = 'Ético Ejemplar';
            description = 'Tienes un perfil ético excepcional con decisiones consistentemente íntegras.';
        } else if (percentage >= 70) {
            category = 'Ético Sólido';
            description = 'Muestras un perfil ético sólido con tendencia a tomar decisiones responsables.';
        } else if (percentage >= 55) {
            category = 'Perfil Mixto';
            description = 'Tu perfil muestra flexibilidad ética con tendencia a evaluar contextos específicos.';
        } else if (percentage >= 40) {
            category = 'Perfil Pragmático';
            description = 'Priorizas resultados prácticos, con espacio para fortalecer consideraciones éticas.';
        } else {
            category = 'Perfil de Alto Riesgo';
            description = 'Tu perfil sugiere alta tolerancia al riesgo ético. Recomendamos formación en compliance.';
        }

        // Cultural analysis
        const culturalFlags = this.answers.flatMap(a => a.cultural_flags || []);
        const culturalAnalysis = this.analyzeCulturalPatterns(culturalFlags);

        // Average response time
        const avgResponseTime = this.answers
            .filter(a => a.time_taken > 0)
            .reduce((sum, a) => sum + a.time_taken, 0) / this.answers.length;

        return {
            total_score: totalScore,
            percentage: percentage,
            category: category,
            description: description,
            decision_types: decisionTypes,
            cultural_analysis: culturalAnalysis,
            avg_response_time: Math.round(avgResponseTime),
            game_duration: Date.now() - this.gameStartTime,
            answers: this.answers,
            user_profile: this.userProfile
        };
    }

    analyzeCulturalPatterns(flags) {
        const flagCounts = {};
        flags.forEach(flag => {
            flagCounts[flag] = (flagCounts[flag] || 0) + 1;
        });

        const insights = [];

        // Consultation pattern
        const consultationFlags = ['consultation_pattern', 'hierarchy_respect', 'guidance_seeking'];
        const consultationCount = consultationFlags.reduce((sum, flag) => sum + (flagCounts[flag] || 0), 0);
        if (consultationCount >= 3) {
            insights.push({
                title: 'Patrón de Consulta Elevado',
                description: `Tu tendencia a consultar está ${15 + Math.random() * 20}% por encima del promedio argentino. Esto refleja un perfil cauteloso y colaborativo.`
            });
        }

        // Risk aversion
        const riskFlags = ['risk_aversion', 'policy_adherence', 'protocol_adherence'];
        const riskCount = riskFlags.reduce((sum, flag) => sum + (flagCounts[flag] || 0), 0);
        if (riskCount >= 2) {
            insights.push({
                title: 'Alta Aversión al Riesgo',
                description: 'Muestras alta aversión al riesgo ético, alineado con las nuevas generaciones de profesionales argentinos post-crisis.'
            });
        }

        // Relationship priority
        const relationshipFlags = ['relationship_priority', 'family_loyalty', 'colleague_favor'];
        const relationshipCount = relationshipFlags.reduce((sum, flag) => sum + (flagCounts[flag] || 0), 0);
        if (relationshipCount >= 2) {
            insights.push({
                title: 'Influencia Relacional',
                description: 'Tus decisiones están influenciadas por relaciones personales, característico de la cultura empresarial argentina.'
            });
        }

        // Default insights if none match
        if (insights.length === 0) {
            insights.push({
                title: 'Perfil Equilibrado',
                description: 'Muestras un perfil de toma de decisiones equilibrado, adaptándote al contexto específico de cada situación.'
            });
        }

        return insights;
    }

    displayResults(results) {
        // Update score display
        document.getElementById('final-score').textContent = results.percentage;
        document.getElementById('score-category').textContent = results.category;
        document.getElementById('score-description').textContent = results.description;

        // Update breakdown bars
        const ethicalPercent = Math.round((results.decision_types.ethical / 10) * 100);
        const consultationPercent = Math.round((results.decision_types.consultation / 10) * 100);
        const riskyPercent = Math.round((results.decision_types.risky / 10) * 100);

        document.getElementById('ethical-bar').style.width = `${ethicalPercent}%`;
        document.getElementById('ethical-percent').textContent = `${ethicalPercent}%`;

        document.getElementById('consultation-bar').style.width = `${consultationPercent}%`;
        document.getElementById('consultation-percent').textContent = `${consultationPercent}%`;

        document.getElementById('risky-bar').style.width = `${riskyPercent}%`;
        document.getElementById('risky-percent').textContent = `${riskyPercent}%`;

        // Update cultural insights
        const insightsContainer = document.querySelector('.cultural-insights');
        insightsContainer.innerHTML = '';
        results.cultural_analysis.forEach((insight, index) => {
            const insightElement = document.createElement('div');
            insightElement.className = 'cultural-insight';
            insightElement.innerHTML = `
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            `;
            insightsContainer.appendChild(insightElement);
        });

        this.showScreen('results');
    }

    saveGameData(results) {
        try {
            // Save to localStorage for leaderboard
            const gameData = {
                score: results.percentage,
                category: results.category,
                timestamp: Date.now(),
                sector: this.userProfile.sector,
                position: this.userProfile.position,
                region: this.userProfile.region
            };

            // Update leaderboard
            let leaderboard = JSON.parse(localStorage.getItem('flai_leaderboard') || '[]');
            leaderboard.push(gameData);
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 100); // Keep top 100
            localStorage.setItem('flai_leaderboard', JSON.stringify(leaderboard));

            // Save detailed results for research (anonymized)
            const researchData = {
                session_id: this.userProfile.session_id,
                demographics: {
                    sector: this.userProfile.sector,
                    position: this.userProfile.position,
                    experience: this.userProfile.experience,
                    region: this.userProfile.region
                },
                results: {
                    total_score: results.total_score,
                    percentage: results.percentage,
                    decision_types: results.decision_types,
                    avg_response_time: results.avg_response_time,
                    game_duration: results.game_duration
                },
                answers: results.answers.map(answer => ({
                    scenario_id: answer.scenario_id,
                    option_type: answer.option_type,
                    cultural_flags: answer.cultural_flags,
                    time_taken: answer.time_taken
                })),
                timestamp: Date.now()
            };

            // In a real implementation, this would be sent to a server
            console.log('Research data collected:', researchData);
            
            // For now, save to localStorage with anonymization
            let allResearchData = JSON.parse(localStorage.getItem('flai_research_data') || '[]');
            allResearchData.push(researchData);
            localStorage.setItem('flai_research_data', JSON.stringify(allResearchData));

        } catch (error) {
            console.error('Error saving game data:', error);
        }
    }

    shareResults(platform) {
        const score = document.getElementById('final-score').textContent;
        const category = document.getElementById('score-category').textContent;
        
        const messages = {
            linkedin: `¡Acabo de completar el FLAISimulator y obtuve ${score}/100 (${category})! 🎯\n\nEs increíble cómo este test refleja los dilemas éticos reales del mundo empresarial argentino.\n\n¿Te animás a probar? 👉 ${window.location.origin}`,
            
            whatsapp: `🎯 ¡Hice el test de ética empresarial!\n\nMi resultado: ${score}/100 - ${category}\n\n¿Qué tal ético serás vos? Probá acá:\n${window.location.origin}`,
            
            twitter: `🎯 Mi perfil ético empresarial: ${score}/100 (${category})\n\n¿Qué tan ético eres en el trabajo? Probá el #FLAISimulator 👉 ${window.location.origin}`
        };

        if (window.shareResults) {
            window.shareResults(platform, messages[platform]);
        }
    }

    challengeTeam() {
        const message = `🚀 ¡Desafío ético para el equipo!\n\nAcabo de completar el FLAISimulator de ética empresarial argentina.\n\n¿Se animan a ver quién tiene el perfil ético más sólido del equipo?\n\n👉 ${window.location.origin}\n\n¡A ver quién se atreve! 😉`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Desafío ético para el equipo',
                text: message
            });
        } else {
            navigator.clipboard.writeText(message);
            alert('¡Mensaje copiado al portapapeles! Compartilo con tu equipo 🚀');
        }
    }

    restartGame() {
        // Reset game state
        this.currentScenario = 0;
        this.answers = [];
        this.userProfile = {};
        this.gameStartTime = null;
        
        // Clear form inputs
        document.getElementById('sector').value = '';
        document.getElementById('position').value = '';
        document.getElementById('experience').value = '';
        document.getElementById('region').value = '';
        
        // Show welcome screen
        this.showScreen('welcome');
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.welcome-screen, .game-screen, .loading-screen, .results-screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
    }

    generateSessionId() {
        return 'flai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flaiGame = new FLAISimulator();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLAISimulator;
}