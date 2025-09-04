# IntegridAI Suite - HackAI 2025 Public Platform

## 🎯 Overview

**IntegridAI Suite** is Argentina's leading RegTech platform for corporate integrity and compliance management, built around **Ley 27.401** (Argentine Corporate Criminal Liability Law). This public repository provides a collaborative environment for HackAI 2025 participants to explore, extend, and innovate on real-world compliance technology.

## 🏗️ Architecture

### Core Components

#### **🌐 IntegridAI Landing** (`integridai-landing-real/`)
Professional landing page showcasing the complete IntegridAI ecosystem. Built with React and optimized for production deployment.

**Key Features:**
- Corporate branding and messaging
- Feature demonstrations
- Integration points overview
- Production-ready build

#### **🎮 FlaiSimulator** (`flaisimulator-fixed/`)
Interactive compliance training platform with conversational AI capabilities for Ley 27.401 education.

**Key Features:**
- AI-powered conversation engine (P4 framework)
- Three specialized characters: Dr. Mentor, Ana Auditora, Carlos CEO
- Real-world compliance scenarios
- Progress tracking and certification paths

#### **🔧 Backend APIs** (`api/`, `src/`)
Mock API endpoints and backend infrastructure for development and experimentation.

**Available Endpoints:**
- Compliance assessment APIs
- Risk management simulators  
- Integration testing frameworks
- Data processing pipelines

## 🚀 Quick Start

### Prerequisites
- Git
- Python 3.8+ or Node.js 16+
- Web browser

### Local Development

```bash
# Clone the repository
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025

# Option 1: IntegridAI Landing
cd integridai-landing-real
python -m http.server 3000
# Access: http://localhost:3000

# Option 2: FlaiSimulator  
cd flaisimulator-fixed
python -m http.server 3001
# Access: http://localhost:3001

# Option 3: Backend Development
cd api
python -m http.server 3002
# Access: http://localhost:3002
```

## 🎯 HackAI 2025 Collaboration Opportunities

### **🎨 Frontend Enhancement**
Modernize and enhance user interfaces across all platform components:

- **Landing Page Optimization**: Improve UX/UI of `integridai-landing-real/`
- **Component Library**: Create reusable UI components
- **Responsive Design**: Enhanced mobile experience
- **Accessibility**: WCAG compliance implementation

### **🔌 API Integration**
Connect platform modules through robust API architecture:

- **Microservices Architecture**: Design scalable service connections
- **Real-time Communication**: WebSocket implementations  
- **Data Synchronization**: Cross-platform state management
- **Authentication Systems**: Secure access control

### **🧠 FlaiSimulator Extensions**
Enhance the conversational AI training platform:

- **New Training Modules**: Additional compliance scenarios
- **Advanced AI Conversations**: Enhanced natural language processing
- **Gamification Features**: Progress systems and achievements  
- **Multi-language Support**: Spanish/English localization

### **🔗 Module Integration**
Create seamless connections between platform components:

- **Unified Dashboard**: Single-point access to all features
- **Data Analytics**: Cross-platform insights and reporting
- **Workflow Automation**: Compliance process orchestration
- **Third-party Integrations**: External service connections

## 📁 Repository Structure

```
integridai-hackai-2025/
├── integridai-landing-real/     # Production landing page
│   ├── assets/                  # Images, fonts, compiled JS/CSS
│   ├── images/                  # Content images
│   ├── index.html              # Main landing page
│   ├── _headers                # Netlify headers configuration
│   └── _redirects              # Netlify routing rules
│
├── flaisimulator-fixed/         # Interactive training platform
│   ├── index.html              # Main application
│   ├── app.js                  # Core functionality and AI engine
│   ├── netlify.toml            # Deployment configuration
│   └── _redirects              # SPA routing
│
├── api/                         # Mock API endpoints
│   ├── mock/                   # Simulated data services
│   ├── endpoints/              # API route definitions
│   └── middleware/             # Request/response processing
│
├── src/                         # Source code and utilities
│   ├── components/             # Reusable UI components  
│   ├── services/              # Business logic
│   └── utils/                 # Helper functions
│
├── hackathon/                   # HackAI 2025 specific resources
│   ├── challenges/             # Development challenges
│   ├── guidelines/             # Contribution guidelines
│   └── resources/              # Documentation and assets
│
└── docs/                        # Technical documentation
    ├── API.md                  # API documentation
    ├── DEPLOYMENT.md           # Deployment guides
    └── ARCHITECTURE.md         # System architecture
```

## 🛠️ Development Guidelines

### **Code Standards**
- **ES6+ JavaScript** for frontend development
- **Python 3.8+** for backend services
- **Semantic versioning** for releases
- **Conventional commits** for git history

### **Testing Requirements**
- **Unit tests** for core functionality
- **Integration tests** for API endpoints  
- **E2E tests** for user workflows
- **Performance benchmarks** for optimization

### **Documentation**
- **Code comments** for complex logic
- **API documentation** using OpenAPI/Swagger
- **README files** for each major component
- **Change logs** for version updates

## 🔐 Security Considerations

This public repository contains **demonstration and development code only**:

- ❌ **No production credentials** or sensitive data
- ❌ **No real user information** or corporate data
- ❌ **No production API keys** or authentication tokens
- ✅ **Mock data and simulated responses** for safe development
- ✅ **Sanitized examples** and test cases
- ✅ **Public documentation** and open-source components

## 🎯 Production vs Development

| Component | Development (This Repo) | Production (Private) |
|-----------|------------------------|---------------------|
| **Authentication** | Mock/Disabled | Full OAuth/SAML |
| **Data Sources** | Simulated | Real AFIP/BCRA/CNV APIs |
| **Database** | SQLite/JSON files | PostgreSQL cluster |
| **Analytics** | Local logging | Enterprise monitoring |
| **Compliance** | Demo scenarios | Real corporate data |

## 🌟 Contributing

### **Getting Started**
1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Contribution Areas**
- **🐛 Bug fixes** and stability improvements  
- **✨ New features** and functionality enhancements
- **📚 Documentation** updates and improvements
- **🎨 UI/UX** design and user experience enhancements
- **⚡ Performance** optimizations and refactoring
- **🧪 Testing** coverage and quality assurance

## 📞 Support & Resources

### **HackAI 2025 Resources**
- **Project Repository**: [github.com/adrianlerer/integridai-hackai-2025](https://github.com/adrianlerer/integridai-hackai-2025)
- **Live Demos**: Available during hackathon sessions
- **Technical Support**: Via GitHub Issues and discussions
- **Documentation**: Comprehensive guides in `/docs` directory

### **Technology Stack**
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, Node.js
- **Database**: SQLite (dev), PostgreSQL (production)
- **Deployment**: Netlify, Vercel, Docker
- **APIs**: REST, WebSocket, GraphQL

---

## 📋 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🎯 Acknowledgments

- **Universidad Austral** - HackAI 2025 Organization
- **MiniMax AI** - Original landing page development
- **IntegridAI Team** - Platform architecture and design
- **Open Source Community** - Libraries and frameworks

---

**Built for HackAI 2025 | Universidad Austral | RegTech Innovation Challenge**