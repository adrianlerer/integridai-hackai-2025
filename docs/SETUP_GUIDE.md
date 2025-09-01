# 🚀 Setup Guide - IntegridAI HackAI 2025

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: 18.0+ (Recommended: 20.x LTS)
- **Python**: 3.9+ (Recommended: 3.11+)
- **Git**: Latest version
- **Package Managers**: npm/yarn + pip

### **Development Tools (Optional)**
- **VS Code** with recommended extensions
- **Docker Desktop** (for containerized development)
- **Postman/Insomnia** (for API testing)

---

## ⚡ **Quick Start**

### **1. Repository Setup**

```bash
# Clone the repository
git clone https://github.com/adrianlerer/integridai-hackai-2025.git
cd integridai-hackai-2025

# Create your development branch
git checkout -b hackathon/your-team-name
```

### **2. Environment Configuration**

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables (optional for development)
nano .env.local
```

### **3. Dependencies Installation**

#### **Frontend Dependencies (Node.js)**
```bash
# Install Node.js dependencies
npm install

# Or using yarn
yarn install

# Verify installation
npm run check-deps
```

#### **Backend Dependencies (Python)**
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi, sqlite3; print('Dependencies OK')"
```

### **4. Initialize Development Database**

```bash
# Run database setup
npm run db:setup

# Seed with demo data
npm run seed:demo

# Verify database
npm run db:check
```

### **5. Start Development Servers**

```bash
# Option A: Start all services with one command
npm run dev

# Option B: Start services individually
npm run dev:frontend    # Frontend dev server (port 3000)
npm run dev:backend     # Backend API server (port 8000)
npm run dev:mock-apis   # Mock API services (port 3001)
```

### **6. Verify Setup**

Open your browser and navigate to:

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Mock APIs**: http://localhost:3001/api/mock/health

---

## 🛠️ **Detailed Setup Instructions**

### **Environment Variables Explained**

```bash
# .env.local configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=sqlite:./integridai_hackathon.db

# Mock API Configuration
MOCK_API_PORT=3001
ENABLE_MOCK_APIS=true

# Development Features
ENABLE_DEBUG_MODE=true
ENABLE_HOT_RELOAD=true
LOG_LEVEL=debug

# External APIs (Mock only for hackathon)
AFIP_API_URL=http://localhost:3001/api/mock/afip
BCRA_API_URL=http://localhost:3001/api/mock/bcra
CNV_API_URL=http://localhost:3001/api/mock/cnv
UIF_API_URL=http://localhost:3001/api/mock/uif
```

### **Project Structure**
```
integridai-hackai-2025/
├── src/
│   ├── frontend/          # React frontend code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   ├── backend/           # FastAPI backend code
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Backend utilities
│   └── analytics/         # Data analytics code
├── api/
│   └── mock/              # Mock API implementations
├── mobile/                # Mobile app code
├── docs/                  # Documentation
├── hackathon/             # Challenge-specific resources
├── deployment/            # Deployment configurations
└── tests/                 # Test files
```

---

## 🧪 **Development Workflows**

### **Frontend Development**

#### **React Development Server**
```bash
# Start with hot reload
npm run dev:frontend

# Build for production
npm run build:frontend

# Preview production build
npm run preview:frontend

# Lint and format
npm run lint:frontend
npm run format:frontend
```

#### **Component Development with Storybook**
```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### **Backend Development**

#### **FastAPI Development Server**
```bash
# Start with auto-reload
npm run dev:backend

# Or directly with Python
cd src/backend
uvicorn main:app --reload --port 8000

# Run migrations
npm run migrate

# Create new migration
npm run migration:create "migration_name"
```

#### **API Testing**
```bash
# Run API tests
npm run test:api

# Test specific endpoints
npm run test:endpoint -- providers

# Load test with sample data
npm run load-test:basic
```

### **Mobile Development**

#### **React Native Setup**
```bash
# Install mobile dependencies
cd mobile
npm install

# iOS Development (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# Android Development
npx react-native run-android
```

#### **PWA Development**
```bash
# Build PWA
npm run build:pwa

# Test PWA locally
npm run serve:pwa

# Validate PWA
npm run audit:pwa
```

---

## 📊 **Database Setup**

### **SQLite Development Database**

```bash
# Initialize database
npm run db:init

# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Reset database (careful!)
npm run db:reset

# Database backup
npm run db:backup
```

### **Database Schema Overview**
```sql
-- Core tables for hackathon
CREATE TABLE providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cuit TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sector TEXT,
    risk_score REAL DEFAULT 0,
    compliance_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER REFERENCES providers(id),
    analysis_type TEXT NOT NULL,
    analysis_data JSON,
    risk_score REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    score REAL,
    completion_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 **Testing Setup**

### **Frontend Testing**

#### **Unit Tests (Jest + RTL)**
```bash
# Run all tests
npm run test:frontend

# Run tests in watch mode
npm run test:frontend:watch

# Generate coverage report
npm run test:frontend:coverage

# Update snapshots
npm run test:frontend:update-snapshots
```

#### **E2E Tests (Playwright)**
```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- providers.spec.ts

# Generate test report
npm run test:e2e:report
```

### **Backend Testing**

#### **Python Tests (pytest)**
```bash
# Run all backend tests
npm run test:backend

# Run specific test file
npm run test:backend -- test_providers.py

# Generate coverage report
npm run test:backend:coverage

# Run integration tests
npm run test:integration
```

### **API Testing**

#### **Automated API Tests**
```bash
# Test all endpoints
npm run test:api:all

# Test specific challenge endpoints
npm run test:api:providers
npm run test:api:training
npm run test:api:analytics

# Performance tests
npm run test:api:performance
```

---

## 🚀 **Deployment Options**

### **Local Production Build**

```bash
# Build all components
npm run build

# Start production server
npm run start:prod

# Health check
curl http://localhost:3000/health
```

### **Docker Development**

```bash
# Build development container
docker-compose up --build

# Run specific services
docker-compose up frontend backend

# View logs
docker-compose logs -f frontend

# Clean up
docker-compose down -v
```

### **Netlify/Vercel Deployment**

```bash
# Deploy to Netlify
npm run deploy:netlify

# Deploy to Vercel  
npm run deploy:vercel

# Preview deployment
npm run deploy:preview
```

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **Port Conflicts**
```bash
# Check what's using port 3000
lsof -ti:3000

# Kill process on port
kill -9 $(lsof -ti:3000)

# Use alternative ports
PORT=3001 npm run dev:frontend
```

#### **Node Version Issues**
```bash
# Check current version
node --version

# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify npm version
npm --version
```

#### **Python Virtual Environment Issues**
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

#### **Database Connection Issues**
```bash
# Check database file exists
ls -la *.db

# Recreate database
rm integridai_hackathon.db
npm run db:init
npm run db:seed
```

#### **Mock API Issues**
```bash
# Restart mock API server
npm run restart:mock-apis

# Check mock API health
curl http://localhost:3001/api/mock/health

# View mock API logs
npm run logs:mock-apis
```

### **Performance Issues**

#### **Slow Startup**
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Use npm ci for faster install
npm ci
```

#### **Memory Issues**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"

# Or add to package.json scripts:
"dev": "NODE_OPTIONS='--max_old_space_size=4096' vite dev"
```

---

## 📱 **Platform-Specific Setup**

### **Windows Setup**

```powershell
# Install Windows-specific dependencies
npm install --global windows-build-tools

# Use PowerShell as administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Alternative to bash commands
# Use Git Bash or WSL2 for best experience
```

### **macOS Setup**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies via Homebrew
brew install node python
```

### **Linux Setup**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm python3 python3-pip python3-venv

# CentOS/RHEL
sudo yum install nodejs npm python3 python3-pip

# Arch Linux
sudo pacman -S nodejs npm python python-pip
```

---

## 🎯 **Development Best Practices**

### **Code Style & Formatting**

```bash
# Format all code
npm run format

# Lint all code
npm run lint

# Type checking
npm run type-check

# Pre-commit hooks (automatic)
npm run prepare
```

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit with conventional commits
git commit -m "feat: add provider analysis component"

# Push and create PR
git push -u origin feature/your-feature-name
```

### **Environment Management**
```bash
# Never commit .env files with secrets
# Use .env.example for templates
# Use different .env files per environment:
.env.local           # Local development
.env.development     # Development deployment
.env.production      # Production (never commit)
```

---

## 📞 **Getting Help**

### **Documentation Resources**
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Architecture Overview](./ARQUITECTURA.md)** - System design
- **[Contribution Guidelines](./CONTRIBUTING.md)** - How to contribute

### **Support Channels**
- **GitHub Issues**: Technical bugs and feature requests
- **Discord #hackathon-support**: Real-time help during event
- **Mentor Office Hours**: Friday 2-4 PM at Universidad Austral

### **Quick Commands Reference**
```bash
# Essential commands for hackathon day
npm run dev          # Start everything
npm run test         # Run all tests
npm run build        # Production build
npm run help         # Show all available commands
```

---

## 🎉 **Ready to Hack!**

After completing this setup, you should have:

✅ **Local development environment** running  
✅ **All dependencies** installed and verified  
✅ **Database** initialized with sample data  
✅ **Mock APIs** responding correctly  
✅ **Tests** passing  
✅ **Development servers** running on correct ports  

### **Next Steps:**
1. **Choose your challenge** from `/hackathon/challenges/`
2. **Read the specific challenge documentation**
3. **Start coding** and changing the world!

**¡Éxito en el HackAI 2025! 🚀**