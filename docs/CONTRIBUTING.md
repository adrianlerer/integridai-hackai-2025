# 🤝 Contributing Guidelines - IntegridAI HackAI 2025

## 🎯 **Welcome Contributors!**

¡Gracias por participar en el HackAI 2025! Este documento te guiará para que puedas contribuir de manera efectiva y colaborativa durante el hackathon.

---

## 🚀 **Quick Start para Contribuir**

### **1. Setup Inicial**
```bash
# Fork y clone del repositorio
git clone https://github.com/tu-usuario/integridai-hackai-2025.git
cd integridai-hackai-2025

# Crear rama de trabajo
git checkout -b hackathon/tu-equipo-nombre

# Instalar dependencias
npm install
pip install -r requirements.txt

# Verificar que todo funciona
npm run dev
```

### **2. Elegir tu Challenge**
- **🎨 Frontend UX/UI**: `/hackathon/challenges/frontend-ux-ui.md`
- **🔌 Backend APIs**: `/hackathon/challenges/backend-apis.md` 
- **📊 Data Analytics**: `/hackathon/challenges/data-analytics.md`
- **📱 Mobile Experience**: `/hackathon/challenges/mobile-experience.md`

### **3. Estructura de Trabajo**
```
tu-rama/
├── src/
│   ├── frontend/     # Si trabajas en Frontend
│   ├── backend/      # Si trabajas en Backend  
│   ├── analytics/    # Si trabajas en Analytics
│   └── mobile/       # Si trabajas en Mobile
├── docs/
│   └── tu-challenge/ # Documentación específica
└── tests/
    └── tu-challenge/ # Tests para tu implementación
```

---

## 📋 **Code Standards & Best Practices**

### **General Guidelines**

#### **Naming Conventions**
```typescript
// Archivos y carpetas: kebab-case
components/provider-analysis-card.tsx
utils/risk-score-calculator.ts
pages/dashboard-analytics.tsx

// Variables y funciones: camelCase  
const providerData = {...};
function calculateRiskScore() {...}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';
const MAX_RETRY_ATTEMPTS = 3;

// Componentes React: PascalCase
export const ProviderAnalysisCard = () => {...};
export const DashboardMetrics = () => {...};

// Tipos TypeScript: PascalCase
interface ProviderData {...}
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
```

#### **Project Structure Standards**
```typescript
// ✅ Good: Organized by feature
src/
├── components/
│   ├── providers/
│   │   ├── ProviderCard.tsx
│   │   ├── ProviderList.tsx
│   │   └── index.ts
│   └── analytics/
│       ├── DashboardChart.tsx
│       └── MetricsCard.tsx

// ❌ Bad: Organized by file type
src/
├── components/
│   ├── ProviderCard.tsx
│   ├── DashboardChart.tsx
│   └── MetricsCard.tsx
└── types/
    ├── provider.ts
    └── analytics.ts
```

### **Frontend Standards (React/TypeScript)**

#### **Component Structure**
```typescript
// ✅ Good component structure
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProviderAnalysis } from '../hooks/useProviderAnalysis';
import { ProviderData, AnalysisResult } from '../types/provider';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProviderAnalysisCardProps {
  provider: ProviderData;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  className?: string;
}

export const ProviderAnalysisCard: React.FC<ProviderAnalysisCardProps> = ({
  provider,
  onAnalysisComplete,
  className = ''
}) => {
  const { 
    analysis, 
    loading, 
    error, 
    startAnalysis 
  } = useProviderAnalysis(provider.id);

  useEffect(() => {
    if (analysis && onAnalysisComplete) {
      onAnalysisComplete(analysis);
    }
  }, [analysis, onAnalysisComplete]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Component content */}
    </motion.div>
  );
};

// Export component and types
export type { ProviderAnalysisCardProps };
```

#### **Custom Hooks Pattern**
```typescript
// ✅ Good custom hook
import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { ProviderData, AnalysisResult } from '../types/provider';

export const useProviderAnalysis = (providerId: string) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startAnalysis = async (providerData: ProviderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.analyzeProvider(providerData);
      setAnalysis(result);
      
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    startAnalysis,
    refetch: () => startAnalysis(providerId)
  };
};
```

### **Backend Standards (Python/FastAPI)**

#### **API Route Structure**
```python
# ✅ Good API route structure
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.provider import Provider
from ..schemas.provider import ProviderCreate, ProviderResponse, AnalysisRequest
from ..services.analysis_engine import AnalysisEngine

router = APIRouter(prefix="/providers", tags=["providers"])

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_provider(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    analysis_engine: AnalysisEngine = Depends()
) -> AnalysisResult:
    """
    Analyze a provider according to Law 27.401 compliance requirements.
    
    - **cuit**: Provider's CUIT number
    - **name**: Provider's business name  
    - **sector**: Business sector
    - **additional_data**: Optional additional information
    
    Returns comprehensive analysis including risk score and recommendations.
    """
    try:
        # Validate input
        if not request.cuit or not request.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CUIT and name are required fields"
            )
        
        # Check if provider exists
        provider = db.query(Provider).filter(Provider.cuit == request.cuit).first()
        if not provider:
            provider = create_provider(db, request)
        
        # Perform analysis
        analysis_result = await analysis_engine.analyze_provider(
            provider_id=provider.id,
            additional_data=request.additional_data
        )
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Analysis failed for CUIT {request.cuit}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis processing failed"
        )
```

#### **Service Layer Pattern**
```python
# ✅ Good service layer structure
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.provider import Provider, Analysis
from ..external.afip_client import AFIPClient
from ..external.bcra_client import BCRAClient
from ..utils.risk_calculator import RiskCalculator

class AnalysisEngine:
    def __init__(self, db: Session):
        self.db = db
        self.afip_client = AFIPClient()
        self.bcra_client = BCRAClient()
        self.risk_calculator = RiskCalculator()
    
    async def analyze_provider(
        self, 
        provider_id: int, 
        additional_data: Optional[Dict[str, Any]] = None
    ) -> AnalysisResult:
        """
        Perform comprehensive provider analysis.
        """
        provider = self.db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            raise ValueError(f"Provider {provider_id} not found")
        
        # External verifications
        verifications = await self._perform_external_verifications(provider)
        
        # Risk calculation
        risk_score = self.risk_calculator.calculate_risk_score(
            provider_data=provider,
            verifications=verifications,
            additional_data=additional_data
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(risk_score, verifications)
        
        # Store analysis
        analysis = Analysis(
            provider_id=provider_id,
            risk_score=risk_score,
            verification_data=verifications,
            recommendations=recommendations,
            created_at=datetime.utcnow()
        )
        
        self.db.add(analysis)
        self.db.commit()
        
        return AnalysisResult.from_orm(analysis)
    
    async def _perform_external_verifications(self, provider: Provider) -> Dict[str, Any]:
        """Perform external API verifications (mock for hackathon)."""
        return {
            'afip': await self.afip_client.verify_provider(provider.cuit),
            'bcra': await self.bcra_client.get_financial_data(provider.cuit),
            # ... other verifications
        }
```

---

## 🧪 **Testing Standards**

### **Frontend Testing (Jest + RTL)**
```typescript
// ✅ Good component test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProviderAnalysisCard } from '../ProviderAnalysisCard';
import { mockProviderData, mockAnalysisResult } from '../../__mocks__/provider';

describe('ProviderAnalysisCard', () => {
  const defaultProps = {
    provider: mockProviderData,
    onAnalysisComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders provider information correctly', () => {
    render(<ProviderAnalysisCard {...defaultProps} />);
    
    expect(screen.getByText(mockProviderData.name)).toBeInTheDocument();
    expect(screen.getByText(`CUIT: ${mockProviderData.cuit}`)).toBeInTheDocument();
    expect(screen.getByText(mockProviderData.sector)).toBeInTheDocument();
  });

  test('starts analysis when button is clicked', async () => {
    render(<ProviderAnalysisCard {...defaultProps} />);
    
    const analyzeButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(analyzeButton);
    
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(defaultProps.onAnalysisComplete).toHaveBeenCalledWith(mockAnalysisResult);
    });
  });

  test('displays error message when analysis fails', async () => {
    // Mock API to return error
    jest.mocked(analyzeProvider).mockRejectedValue(new Error('Analysis failed'));
    
    render(<ProviderAnalysisCard {...defaultProps} />);
    
    const analyzeButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/analysis failed/i)).toBeInTheDocument();
    });
  });
});
```

### **Backend Testing (pytest)**
```python
# ✅ Good service test
import pytest
from unittest.mock import AsyncMock, MagicMock
from sqlalchemy.orm import Session

from app.services.analysis_engine import AnalysisEngine
from app.models.provider import Provider
from tests.factories import ProviderFactory

class TestAnalysisEngine:
    @pytest.fixture
    def db_session(self):
        # Mock database session
        return MagicMock(spec=Session)
    
    @pytest.fixture
    def analysis_engine(self, db_session):
        return AnalysisEngine(db_session)
    
    @pytest.fixture
    def sample_provider(self, db_session):
        provider = ProviderFactory()
        db_session.query.return_value.filter.return_value.first.return_value = provider
        return provider
    
    @pytest.mark.asyncio
    async def test_analyze_provider_success(self, analysis_engine, sample_provider):
        # Arrange
        analysis_engine.afip_client.verify_provider = AsyncMock(return_value={'status': 'active'})
        analysis_engine.bcra_client.get_financial_data = AsyncMock(return_value={'rating': 'A'})
        
        # Act
        result = await analysis_engine.analyze_provider(sample_provider.id)
        
        # Assert
        assert result.provider_id == sample_provider.id
        assert result.risk_score >= 0
        assert result.risk_score <= 100
        assert 'afip' in result.verification_data
        assert 'bcra' in result.verification_data
    
    @pytest.mark.asyncio
    async def test_analyze_provider_not_found(self, analysis_engine, db_session):
        # Arrange
        db_session.query.return_value.filter.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(ValueError, match="Provider .* not found"):
            await analysis_engine.analyze_provider(999)
```

---

## 📦 **Git Workflow**

### **Branch Strategy**
```bash
# Estructura de branches
main                    # Código base del hackathon
├── hackathon/team-1   # Rama del equipo 1
├── hackathon/team-2   # Rama del equipo 2  
└── feature/new-feature # Features específicas

# Convención de nombres
hackathon/[team-name]          # Rama principal del equipo
feature/[challenge]-[feature]   # Features específicas
bugfix/[issue-description]     # Bug fixes
docs/[documentation-update]    # Updates de documentación
```

### **Commit Message Standards**
```bash
# Formato: tipo(scope): descripción

# Tipos válidos:
feat:     # Nueva funcionalidad
fix:      # Bug fix
docs:     # Cambios en documentación
style:    # Formato, espacios, etc (no cambios de lógica)
refactor: # Refactoring de código
test:     # Agregar o modificar tests
chore:    # Tareas de mantenimiento

# Ejemplos:
feat(providers): add risk score calculation algorithm
fix(dashboard): resolve chart rendering issue on mobile
docs(api): update provider analysis endpoint documentation
style(frontend): apply consistent formatting to components
refactor(backend): extract analysis logic to separate service
test(providers): add unit tests for risk calculator
chore(deps): update dependencies to latest versions
```

### **Pull Request Process**
```markdown
# Template para Pull Requests

## 📋 **Challenge**: [Frontend/Backend/Analytics/Mobile]

### **Descripción**
Breve descripción de los cambios implementados.

### **Cambios Realizados**
- [ ] Feature 1: Descripción
- [ ] Feature 2: Descripción  
- [ ] Bug fix: Descripción

### **Testing**
- [ ] Unit tests agregados/actualizados
- [ ] Integration tests passing
- [ ] Manual testing completado

### **Screenshots/Demos**
<!-- Agregar screenshots o links a demos si aplica -->

### **Checklist**
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan exitosamente
- [ ] Documentación actualizada
- [ ] No hay console.logs o debug code
- [ ] Performance considerado
- [ ] Responsive design (para frontend)

### **Comentarios Adicionales**
<!-- Cualquier información adicional para los reviewers -->
```

### **Code Review Guidelines**

#### **Para Reviewers**
```markdown
# ✅ Good Code Review Comments

## Constructivos
"Consider using useMemo here to optimize re-renders when providerList changes"
"Great implementation! Could we add error handling for the API call?"
"Love the component structure. Maybe extract this logic to a custom hook?"

## Específicos  
"Line 45: This could cause a memory leak. Consider adding cleanup in useEffect"
"The risk calculation logic looks solid. Can we add unit tests for edge cases?"

## Educativos
"FYI: TailwindCSS has a built-in class for this: 'truncate' instead of custom CSS"
"Pro tip: React Query would handle the caching automatically here"

# ❌ Avoid
"This is wrong"
"Bad code"  
"Rewrite this"
```

#### **Para Contributors**
```markdown
# Respondiendo a Code Review

## ✅ Good Responses
"Great point! I'll add the error handling and push an update"
"Thanks for catching that! Fixed in the latest commit"  
"Interesting approach! I'll try that and see how it works"

## ❌ Avoid
"This works fine"
"It's just for the hackathon"
"Will fix later"
```

---

## 🚀 **Development Workflow**

### **Daily Workflow**
```bash
# 1. Sincronizar con main (inicio del día)
git checkout main
git pull origin main
git checkout hackathon/tu-equipo
git merge main

# 2. Trabajar en features
git checkout -b feature/nueva-funcionalidad
# ... trabajo de desarrollo ...
git add .
git commit -m "feat(providers): implement real-time analysis"

# 3. Merge a rama del equipo
git checkout hackathon/tu-equipo
git merge feature/nueva-funcionalidad
git push origin hackathon/tu-equipo

# 4. Crear Pull Request (final del día o feature completa)
# Usar GitHub UI para crear PR hacia main
```

### **Resolving Conflicts**
```bash
# Cuando hay conflictos al hacer merge
git status  # Ver archivos en conflicto

# Editar archivos para resolver conflictos
# Buscar markers: <<<<<<<, =======, >>>>>>>

# Después de resolver
git add archivo-resuelto.ts
git commit -m "resolve: merge conflicts in provider analysis"
git push origin hackathon/tu-equipo
```

---

## 🔧 **Tools & Setup**

### **Recommended VS Code Extensions**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.black-formatter",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.test-adapter-converter",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### **VS Code Settings**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### **Pre-commit Hooks**
```bash
# Setup automático de pre-commit hooks
npm run prepare

# Los hooks verifican:
# - Linting (ESLint, Flake8)
# - Formatting (Prettier, Black)  
# - Tests (Jest, pytest)
# - Type checking (TypeScript, mypy)
```

---

## 📊 **Performance Guidelines**

### **Frontend Performance**
```typescript
// ✅ Good: Optimized component
import { memo, useMemo, useCallback } from 'react';

export const ProviderList = memo(({ providers, onProviderSelect }) => {
  // Memoize expensive calculations
  const sortedProviders = useMemo(() => 
    providers.sort((a, b) => b.riskScore - a.riskScore), 
    [providers]
  );
  
  // Memoize event handlers
  const handleProviderClick = useCallback((provider) => {
    onProviderSelect(provider);
  }, [onProviderSelect]);
  
  return (
    <div className="grid gap-4">
      {sortedProviders.map(provider => (
        <ProviderCard 
          key={provider.id}
          provider={provider}
          onClick={handleProviderClick}
        />
      ))}
    </div>
  );
});
```

### **Backend Performance**
```python
# ✅ Good: Optimized database queries
from sqlalchemy.orm import joinedload, selectinload

class ProviderRepository:
    def get_providers_with_latest_analysis(self, limit: int = 50):
        return self.db.query(Provider)\
            .options(
                selectinload(Provider.analyses)
                .joinedload(Analysis.verification_data)
            )\
            .limit(limit)\
            .all()
    
    def get_dashboard_metrics(self):
        # Use raw SQL for complex aggregations
        return self.db.execute("""
            SELECT 
                COUNT(*) as total_providers,
                AVG(latest_analysis.risk_score) as avg_risk_score,
                COUNT(CASE WHEN latest_analysis.risk_level = 'high' THEN 1 END) as high_risk_count
            FROM providers 
            LEFT JOIN LATERAL (
                SELECT risk_score, risk_level 
                FROM analyses 
                WHERE analyses.provider_id = providers.id 
                ORDER BY created_at DESC 
                LIMIT 1
            ) latest_analysis ON true
        """).fetchone()
```

---

## 🛡️ **Security Guidelines**

### **Frontend Security**
```typescript
// ✅ Good: Secure input handling
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

const validateCuit = (cuit: string): boolean => {
  const cuitRegex = /^\d{2}-\d{8}-\d$/;
  return cuitRegex.test(cuit);
};

// ❌ Bad: Direct innerHTML
element.innerHTML = userInput; // XSS vulnerability

// ✅ Good: Safe rendering
element.textContent = sanitizeInput(userInput);
```

### **Backend Security**
```python
# ✅ Good: Input validation and sanitization
from pydantic import BaseModel, validator
import re

class ProviderCreate(BaseModel):
    cuit: str
    name: str
    sector: str
    
    @validator('cuit')
    def validate_cuit(cls, v):
        if not re.match(r'^\d{2}-\d{8}-\d$', v):
            raise ValueError('Invalid CUIT format')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()

# ✅ Good: SQL injection prevention
def get_provider_by_cuit(db: Session, cuit: str):
    return db.query(Provider).filter(Provider.cuit == cuit).first()

# ❌ Bad: SQL injection vulnerability  
def get_provider_by_cuit_bad(db: Session, cuit: str):
    return db.execute(f"SELECT * FROM providers WHERE cuit = '{cuit}'")
```

---

## 📱 **Mobile-Specific Guidelines**

### **React Native Best Practices**
```typescript
// ✅ Good: Performance optimized list
import { FlatList, memo } from 'react-native';

const ProviderListItem = memo(({ provider, onPress }) => (
  <TouchableOpacity onPress={() => onPress(provider)}>
    <ProviderCard provider={provider} />
  </TouchableOpacity>
));

export const ProviderList = ({ providers, onProviderPress }) => (
  <FlatList
    data={providers}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <ProviderListItem 
        provider={item} 
        onPress={onProviderPress}
      />
    )}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
  />
);
```

---

## 🎯 **Challenge-Specific Guidelines**

### **Frontend Challenge**
- Priorizar **UX/UI excellence** sobre funcionalidad compleja
- Implementar **responsive design** desde móvil hasta desktop  
- Usar **animations** sutiles pero impactantes
- **Accessibility** es importante - usar semantic HTML y ARIA labels

### **Backend Challenge**
- Enfocar en **API design** limpia y RESTful
- Implementar **error handling** robusto
- **Performance** en queries de base de datos
- **Documentation** clara con OpenAPI/Swagger

### **Analytics Challenge**  
- **Data visualization** clara e interactiva
- **Performance** en procesamiento de datos grandes
- **Real-time updates** donde sea apropiado
- **Export functionality** para reports

### **Mobile Challenge**
- **Offline-first** approach es clave
- **Camera integration** debe ser fluida
- **Performance** en dispositivos de gama baja
- **Platform-specific** optimizations

---

## 🆘 **Getting Help**

### **Durante el Hackathon**
```markdown
# Canales de Support

## 🔥 Urgente (Blockers)
- Slack: @adrianlerer
- Discord: #hackathon-emergency  
- En persona: Booth IntegridAI

## 🤔 Preguntas Técnicas
- GitHub Issues: tag @adrianlerer
- Discord: #hackathon-tech-help
- Stack Overflow: tag hackathon-integridai

## 💡 Ideas y Feedback
- Discord: #hackathon-ideas
- Slack: #integridai-feedback

## 📚 Documentación
- README.md principales
- /docs/* archivos específicos
- API docs: localhost:3001/docs
```

### **Code Review Requests**
```bash
# Para solicitar review urgent
git push origin hackathon/tu-equipo
gh pr create --title "🔥 URGENT: [Challenge] Feature Description" \
            --body "Need review ASAP for presentation" \
            --reviewer adrianlerer \
            --label "urgent,hackathon"
```

---

## 🏆 **Evaluation Criteria Alignment**

### **Code Quality (25%)**
- **Clean Code**: Seguir guidelines de este documento
- **Architecture**: Separación clara de responsabilidades  
- **Performance**: Optimizaciones aplicadas apropiadamente
- **Security**: Input validation y secure coding practices

### **Functionality (35%)**  
- **Core Features**: Implementación completa de features clave
- **Integration**: APIs funcionando correctamente
- **Error Handling**: Manejo robusto de edge cases
- **Testing**: Coverage adecuado de tests

### **Innovation (25%)**
- **Creative Solutions**: Approaches únicos a problemas comunes
- **User Experience**: Interfaces intuitivas y atractivas  
- **Technical Excellence**: Uso avanzado de tecnologías
- **Business Impact**: Valor real para compliance officers

### **Collaboration (15%)**
- **Git History**: Commits claros y branches organizados
- **Documentation**: README y docs actualizados
- **Code Review**: Participación activa en review process
- **Team Communication**: Colaboración efectiva

---

## 🎉 **Final Tips for Success**

### **✅ Do's**
- **Start Early**: Setup environment el primer día
- **Commit Often**: Small, focused commits con mensajes claros
- **Test Continuously**: No dejar testing para el final
- **Document as You Go**: Mantener docs actualizados
- **Ask for Help**: No quedarse stuck, hay mentors disponibles
- **Focus on UX**: Siempre pensar en el usuario final

### **❌ Don'ts**  
- **Don't Over-Engineer**: KISS principle - Keep It Simple
- **Don't Ignore Performance**: Optimizar desde el principio
- **Don't Skip Testing**: Tests previenen regressions
- **Don't Work in Isolation**: Colaborar y compartir conocimiento
- **Don't Leave Broken Code**: Siempre commit código que funciona
- **Don't Forget the Demo**: Preparar presentación desde temprano

---

## 🚀 **¡Ready to Change the World!**

Con estas guidelines, tienes todo lo necesario para contribuir efectivamente al proyecto IntegridAI y crear soluciones que realmente impacten el compliance en Argentina.

**Recuerda**: No es solo un hackathon, ¡es tu oportunidad de co-crear el futuro del RegTech en Latinoamérica!

### **¡Éxito en el HackAI 2025! 🎯🏆**

---

*¿Preguntas sobre estas guidelines? Abre un issue o pregunta en Discord #hackathon-help*