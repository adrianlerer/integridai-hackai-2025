# 📊 Data Analytics Challenge - Genius Level

## 🏆 **Tu Misión: Transformar Datos en Insights**

Crear dashboards ejecutivos y analytics predictivos que conviertan los datos de compliance y capacitación en inteligencia actionable para la toma de decisiones estratégicas.

---

## 🎯 **Objetivos del Challenge**

### **1. Dashboard Ejecutivo Inteligente**
Desarrollar visualizaciones que respondan:
- 📈 **¿Cuál es el estado actual** de compliance organizacional?
- 🔮 **¿Qué riesgos** se pueden predecir antes de que ocurran?
- 💡 **¿Qué acciones** debe tomar el CEO/CRO inmediatamente?
- 🎯 **¿Dónde enfocar** recursos de capacitación y control?

### **2. Analytics Predictivos**
Implementar modelos que predigan:
- 🚨 **Probabilidad de incidentes** de compliance por proveedor
- 📊 **Efectividad de capacitación** por área/perfil
- 💰 **ROI de inversiones** en integridad corporativa
- 🔍 **Proveedores en riesgo** antes de problemas reales

### **3. Reportes Automáticos Inteligentes**
Generar reportes que:
- 📋 **Se adapten al usuario** (CEO, CRO, Gerente, Auditor)
- ⚡ **Se actualicen en tiempo real** con nuevos datos
- 🎯 **Destaquen insights críticos** automáticamente
- 📤 **Se distribuyan automáticamente** según eventos

---

## 🛠️ **Tech Stack Recomendado**

### **Analytics Framework:**
```json
{
  "python": "pandas, numpy, scikit-learn",
  "visualization": "plotly, dash, streamlit",
  "web": "React + D3.js o Observable",
  "database": "PostgreSQL + TimescaleDB", 
  "ml": "scikit-learn, statsmodels"
}
```

### **Visualization Stack:**
- **Plotly/Dash** - Dashboards interactivos Python
- **D3.js** - Visualizaciones web custom
- **Chart.js/Recharts** - Charts React-ready
- **Streamlit** - Rapid prototyping analytics
- **Jupyter** - Exploratory data analysis

---

## 📂 **Estructura de Archivos**

```
src/analytics/
├── dashboards/
│   ├── executive/
│   │   ├── compliance_overview.py
│   │   ├── risk_heatmap.py
│   │   └── predictive_alerts.py
│   ├── operational/
│   │   ├── provider_analytics.py
│   │   ├── training_metrics.py
│   │   └── performance_trends.py
│   └── components/
│       ├── charts.py
│       ├── filters.py
│       └── exports.py
├── models/
│   ├── risk_prediction.py
│   ├── compliance_scoring.py
│   ├── training_effectiveness.py
│   └── anomaly_detection.py
├── data/
│   ├── processors/
│   │   ├── regtech_data.py
│   │   ├── flaisim_data.py
│   │   └── unified_metrics.py
│   ├── pipelines/
│   │   ├── etl.py
│   │   ├── real_time.py
│   │   └── batch.py
│   └── warehouse/
│       ├── schemas.sql
│       ├── views.sql
│       └── aggregations.sql
├── reports/
│   ├── generators/
│   │   ├── executive_report.py
│   │   ├── audit_report.py
│   │   └── compliance_report.py
│   ├── templates/
│   │   ├── executive.html
│   │   ├── technical.html
│   │   └── regulatory.html
│   └── schedulers/
│       ├── daily.py
│       ├── weekly.py
│       └── on_demand.py
└── api/
    ├── endpoints.py
    ├── models.py
    └── cache.py
```

---

## 📊 **Datasets Disponibles**

### **1. Provider Analytics Data:**
```python
# /data/samples/provider_analyses.json
{
  "provider_id": "prov_001",
  "name": "Construcciones Demo SA",
  "sector": "construccion", 
  "compliance_score": 72.5,
  "risk_level": "medio",
  "analysis_date": "2025-08-30",
  "verifications": {
    "afip": {"verified": true, "confidence": 0.9},
    "bcra": {"verified": true, "confidence": 0.8},
    "cnv": {"verified": false, "confidence": 0.7},
    "uif": {"verified": true, "confidence": 0.95}
  },
  "risk_factors": [
    {
      "category": "Documentacion",
      "level": "medium", 
      "impact": "medium"
    }
  ],
  "historical_scores": [68.2, 70.1, 72.5],
  "contract_value": 150000,
  "relationship_months": 18
}
```

### **2. Training Metrics Data:**
```python
# /data/samples/training_sessions.json
{
  "session_id": "train_001",
  "user_id": "user_123",
  "scenario": "corruption_dilemma_01",
  "department": "procurement",
  "role": "manager",
  "completion_time_minutes": 45,
  "score": 87.5,
  "decisions": [
    {
      "scenario_step": 1,
      "chosen_option": "report_to_compliance",
      "correct": true,
      "reasoning_quality": 0.8
    }
  ],
  "improvement_areas": ["regulatory_knowledge", "risk_assessment"],
  "timestamp": "2025-08-30T10:30:00Z"
}
```

### **3. Unified Metrics Data:**
```python
# /data/samples/unified_metrics.json
{
  "timestamp": "2025-08-30T15:00:00Z",
  "organizational_health": {
    "compliance_score": 78.3,
    "risk_distribution": {"low": 65, "medium": 25, "high": 10},
    "training_effectiveness": 82.1,
    "incident_rate": 0.02
  },
  "operational_metrics": {
    "providers_active": 24,
    "analyses_completed": 156,
    "training_sessions": 89,
    "users_trained": 45
  },
  "financial_impact": {
    "risk_mitigation_value": 2400000,
    "training_investment": 185000,
    "compliance_roi": 12.97
  }
}
```

---

## 🎨 **Dashboard Specifications**

### **1. Executive Overview Dashboard**

#### **KPI Cards Section:**
```python
import plotly.graph_objects as go
import plotly.express as px

def create_kpi_cards(metrics_data):
    """Crear tarjetas KPI principales"""
    
    kpis = [
        {
            "title": "Compliance Score",
            "value": f"{metrics_data['compliance_score']:.1f}%",
            "delta": "+2.3%",
            "color": "green" if metrics_data['compliance_score'] > 75 else "orange"
        },
        {
            "title": "Providers at Risk", 
            "value": str(metrics_data['high_risk_providers']),
            "delta": "-1",
            "color": "red" if metrics_data['high_risk_providers'] > 5 else "green"
        },
        {
            "title": "Training Effectiveness",
            "value": f"{metrics_data['training_effectiveness']:.1f}%",
            "delta": "+5.2%", 
            "color": "green"
        },
        {
            "title": "ROI Compliance",
            "value": f"{metrics_data['compliance_roi']:.1f}x",
            "delta": "+0.8x",
            "color": "green"
        }
    ]
    
    return kpis

def create_risk_heatmap(provider_data):
    """Mapa de calor de riesgo por sector"""
    
    # Procesar datos por sector y nivel de riesgo
    heatmap_data = process_sector_risk_data(provider_data)
    
    fig = px.density_heatmap(
        heatmap_data,
        x='sector',
        y='risk_level', 
        z='count',
        color_continuous_scale='Reds',
        title='Risk Distribution by Sector'
    )
    
    return fig
```

#### **Risk Prediction Chart:**
```python
def create_risk_prediction_chart(historical_data):
    """Gráfico de predicción de riesgo"""
    
    # Modelo predictivo simple
    from sklearn.linear_model import LinearRegression
    import numpy as np
    
    # Preparar datos históricos
    X = np.array(range(len(historical_data))).reshape(-1, 1)
    y = [d['risk_score'] for d in historical_data]
    
    # Entrenar modelo
    model = LinearRegression()
    model.fit(X, y)
    
    # Predecir próximos 30 días
    future_X = np.array(range(len(historical_data), len(historical_data) + 30)).reshape(-1, 1)
    predictions = model.predict(future_X)
    
    # Crear gráfico
    fig = go.Figure()
    
    # Datos históricos
    fig.add_trace(go.Scatter(
        x=[d['date'] for d in historical_data],
        y=[d['risk_score'] for d in historical_data],
        mode='lines+markers',
        name='Historical Risk',
        line=dict(color='blue')
    ))
    
    # Predicciones
    future_dates = pd.date_range(
        start=historical_data[-1]['date'],
        periods=30,
        freq='D'
    )
    
    fig.add_trace(go.Scatter(
        x=future_dates,
        y=predictions,
        mode='lines',
        name='Predicted Risk',
        line=dict(color='red', dash='dash')
    ))
    
    return fig
```

### **2. Provider Deep Dive Dashboard**

#### **Provider Comparison Matrix:**
```python
def create_provider_comparison(providers_data):
    """Matriz de comparación de proveedores"""
    
    # Preparar datos para radar chart
    categories = ['Compliance', 'Financial Health', 'Reputation', 'Operational Risk', 'Legal Risk']
    
    fig = go.Figure()
    
    for provider in providers_data:
        fig.add_trace(go.Scatterpolar(
            r=[
                provider['compliance_score'],
                provider['financial_score'],
                provider['reputation_score'],
                100 - provider['operational_risk'],
                100 - provider['legal_risk']
            ],
            theta=categories,
            fill='toself',
            name=provider['name']
        ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100]
            )),
        showlegend=True,
        title="Provider Risk Profile Comparison"
    )
    
    return fig

def create_provider_timeline(provider_id, analyses_history):
    """Timeline de evolución de proveedor"""
    
    provider_data = [a for a in analyses_history if a['provider_id'] == provider_id]
    
    fig = go.Figure()
    
    # Score evolution
    fig.add_trace(go.Scatter(
        x=[a['date'] for a in provider_data],
        y=[a['compliance_score'] for a in provider_data],
        mode='lines+markers',
        name='Compliance Score',
        line=dict(color='green')
    ))
    
    # Risk events
    risk_events = [a for a in provider_data if len(a['risk_factors']) > 0]
    if risk_events:
        fig.add_trace(go.Scatter(
            x=[e['date'] for e in risk_events],
            y=[e['compliance_score'] for e in risk_events],
            mode='markers',
            marker=dict(color='red', size=10, symbol='x'),
            name='Risk Events'
        ))
    
    return fig
```

### **3. Training Analytics Dashboard**

#### **Learning Effectiveness Analysis:**
```python
def analyze_training_effectiveness(training_data):
    """Análisis de efectividad de capacitación"""
    
    # Agrupar por departamento y escenario
    effectiveness_by_dept = training_data.groupby(['department', 'scenario']).agg({
        'score': ['mean', 'std', 'count'],
        'completion_time_minutes': 'mean',
        'improvement_areas': lambda x: len(set([item for sublist in x for item in sublist]))
    }).round(2)
    
    # Crear heatmap de efectividad
    pivot_data = effectiveness_by_dept.pivot_table(
        values=('score', 'mean'),
        index='department',
        columns='scenario'
    )
    
    fig = px.imshow(
        pivot_data.values,
        x=pivot_data.columns,
        y=pivot_data.index,
        color_continuous_scale='RdYlGn',
        title='Training Effectiveness Heatmap'
    )
    
    return fig, effectiveness_by_dept

def predict_learning_outcomes(user_profile, scenario_data):
    """Predicir resultados de aprendizaje"""
    
    from sklearn.ensemble import RandomForestRegressor
    
    # Features: role, department, previous_scores, scenario_difficulty
    # Target: predicted_score
    
    # Preparar dataset de entrenamiento
    X_train, y_train = prepare_training_dataset(scenario_data)
    
    # Entrenar modelo
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Predecir para usuario específico
    user_features = encode_user_profile(user_profile)
    predicted_score = model.predict([user_features])[0]
    
    # Feature importance
    feature_importance = dict(zip(
        ['role', 'department', 'experience', 'previous_avg'],
        model.feature_importances_
    ))
    
    return {
        'predicted_score': predicted_score,
        'confidence': model.score(X_train, y_train),
        'key_factors': feature_importance
    }
```

---

## 🤖 **Machine Learning Models**

### **1. Risk Prediction Model:**
```python
class ComplianceRiskPredictor:
    def __init__(self):
        from sklearn.ensemble import GradientBoostingClassifier
        from sklearn.preprocessing import StandardScaler
        
        self.model = GradientBoostingClassifier()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, provider_data):
        """Preparar features para el modelo"""
        
        features = []
        for provider in provider_data:
            feature_vector = [
                provider['compliance_score'],
                provider['contract_value'],
                provider['relationship_months'],
                len(provider['risk_factors']),
                sum(1 for v in provider['verifications'].values() if v['verified']),
                self.encode_sector(provider['sector']),
                provider.get('financial_health_score', 0),
                provider.get('previous_incidents', 0)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def train(self, historical_data):
        """Entrenar modelo con datos históricos"""
        
        X = self.prepare_features(historical_data)
        y = [1 if p['had_incident'] else 0 for p in historical_data]
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        return self.model.score(X_scaled, y)
    
    def predict_risk(self, provider_data):
        """Predecir riesgo de incidente"""
        
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        X = self.prepare_features([provider_data])
        X_scaled = self.scaler.transform(X)
        
        risk_probability = self.model.predict_proba(X_scaled)[0][1]
        risk_level = 'high' if risk_probability > 0.7 else 'medium' if risk_probability > 0.3 else 'low'
        
        return {
            'risk_probability': risk_probability,
            'risk_level': risk_level,
            'confidence': max(self.model.predict_proba(X_scaled)[0])
        }

# Uso del modelo
predictor = ComplianceRiskPredictor()
accuracy = predictor.train(historical_provider_data)
risk_assessment = predictor.predict_risk(new_provider_data)
```

### **2. Anomaly Detection Model:**
```python
class ComplianceAnomalyDetector:
    def __init__(self):
        from sklearn.ensemble import IsolationForest
        self.model = IsolationForest(contamination=0.1, random_state=42)
        
    def detect_anomalies(self, metrics_data):
        """Detectar anomalías en métricas de compliance"""
        
        # Preparar features temporales
        features = self.prepare_time_series_features(metrics_data)
        
        # Detectar anomalías
        anomaly_scores = self.model.decision_function(features)
        is_anomaly = self.model.predict(features) == -1
        
        # Clasificar severidad
        anomalies = []
        for i, (is_anom, score) in enumerate(zip(is_anomaly, anomaly_scores)):
            if is_anom:
                severity = 'critical' if score < -0.5 else 'moderate'
                anomalies.append({
                    'timestamp': metrics_data[i]['timestamp'],
                    'metric_type': 'compliance_score',
                    'value': metrics_data[i]['value'],
                    'anomaly_score': score,
                    'severity': severity,
                    'description': self.generate_anomaly_description(metrics_data[i], score)
                })
        
        return anomalies
    
    def generate_anomaly_description(self, data_point, score):
        """Generar descripción automática de la anomalía"""
        
        if score < -0.7:
            return f"Critical drop in compliance score to {data_point['value']:.1f}% - immediate investigation required"
        elif score < -0.5:
            return f"Unusual compliance pattern detected - score: {data_point['value']:.1f}%"
        else:
            return f"Minor deviation in compliance metrics - monitoring recommended"
```

---

## 📊 **Interactive Dashboards**

### **Streamlit Dashboard Example:**
```python
import streamlit as st
import plotly.express as px
import pandas as pd

def main_dashboard():
    """Dashboard principal ejecutivo"""
    
    st.set_page_config(
        page_title="IntegridAI Analytics", 
        page_icon="📊",
        layout="wide"
    )
    
    # Sidebar filters
    with st.sidebar:
        st.title("🎛️ Filters")
        
        date_range = st.date_input("Date Range", value=[datetime.now() - timedelta(days=30), datetime.now()])
        sectors = st.multiselect("Sectors", options=['tecnologia', 'construccion', 'servicios_financieros'], default=None)
        risk_threshold = st.slider("Risk Threshold", 0.0, 1.0, 0.5)
    
    # Main content
    st.title("🚀 IntegridAI Executive Dashboard")
    
    # Load and filter data
    data = load_analytics_data(date_range, sectors)
    
    # KPI Row
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            "Compliance Score", 
            f"{data['avg_compliance']:.1f}%",
            f"{data['compliance_delta']:+.1f}%"
        )
    
    with col2:
        st.metric(
            "High Risk Providers",
            data['high_risk_count'],
            f"{data['risk_delta']:+d}"
        )
    
    with col3:
        st.metric(
            "Training Effectiveness", 
            f"{data['training_effectiveness']:.1f}%",
            f"{data['training_delta']:+.1f}%"
        )
    
    with col4:
        st.metric(
            "ROI", 
            f"{data['roi']:.1f}x",
            f"{data['roi_delta']:+.1f}x"
        )
    
    # Charts Row
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 Compliance Trend")
        trend_chart = create_compliance_trend(data['time_series'])
        st.plotly_chart(trend_chart, use_container_width=True)
    
    with col2:
        st.subheader("🎯 Risk Distribution")
        risk_chart = create_risk_distribution(data['providers'])
        st.plotly_chart(risk_chart, use_container_width=True)
    
    # Detailed Analysis
    st.subheader("🔍 Provider Deep Dive")
    
    provider_selection = st.selectbox(
        "Select Provider",
        options=[p['name'] for p in data['providers']]
    )
    
    if provider_selection:
        provider_details = get_provider_details(provider_selection)
        display_provider_analysis(provider_details)

def display_provider_analysis(provider_data):
    """Display detailed provider analysis"""
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.write("**Basic Info**")
        st.write(f"CUIT: {provider_data['cuit']}")
        st.write(f"Sector: {provider_data['sector']}")
        st.write(f"Contract Value: ${provider_data['contract_value']:,}")
    
    with col2:
        st.write("**Risk Assessment**") 
        score_color = "green" if provider_data['score'] > 80 else "orange" if provider_data['score'] > 60 else "red"
        st.markdown(f"Score: <span style='color:{score_color}'>{provider_data['score']:.1f}%</span>", unsafe_allow_html=True)
        st.write(f"Risk Level: {provider_data['risk_level']}")
    
    with col3:
        st.write("**Verifications**")
        for source, verification in provider_data['verifications'].items():
            icon = "✅" if verification['verified'] else "❌"
            st.write(f"{icon} {source.upper()}")

if __name__ == "__main__":
    main_dashboard()
```

---

## 🧪 **Testing & Validation**

### **Data Quality Tests:**
```python
import pytest
import pandas as pd

def test_data_completeness(analytics_data):
    """Test de completitud de datos"""
    
    required_fields = ['provider_id', 'compliance_score', 'risk_level', 'timestamp']
    
    for field in required_fields:
        assert field in analytics_data.columns
        assert analytics_data[field].notna().all()

def test_score_ranges(analytics_data):
    """Test de rangos válidos"""
    
    assert (analytics_data['compliance_score'] >= 0).all()
    assert (analytics_data['compliance_score'] <= 100).all()
    
    valid_risk_levels = ['bajo', 'medio', 'alto']
    assert analytics_data['risk_level'].isin(valid_risk_levels).all()

def test_model_performance(model, test_data):
    """Test de performance del modelo"""
    
    predictions = model.predict(test_data['X'])
    accuracy = accuracy_score(test_data['y'], predictions)
    
    assert accuracy > 0.75, f"Model accuracy {accuracy} below threshold"
    
    precision = precision_score(test_data['y'], predictions, average='weighted')
    assert precision > 0.70, f"Model precision {precision} below threshold"
```

---

## 🏆 **Criterios de Evaluación**

### **Data Insights Quality (40%)**
- 📊 **Visualizaciones claras** y actionable
- 🔮 **Predictive analytics** funcionando correctamente
- 💡 **Insights automáticos** relevantes para el negocio

### **Technical Implementation (30%)**
- ⚡ **Performance** óptimo con datasets grandes
- 🧪 **Modelos ML** bien implementados y validados
- 🔄 **Real-time updates** funcionando correctamente

### **User Experience (20%)**
- 🎨 **Dashboard intuitivo** y fácil de usar
- 📱 **Responsive design** para diferentes pantallas
- 🔍 **Interactividad** avanzada en visualizaciones

### **Business Impact (10%)**
- 💼 **Relevancia ejecutiva** de los insights
- 📈 **ROI measurable** de las recomendaciones
- 🎯 **Actionability** de los análisis

---

## 💡 **Ideas Avanzadas**

### **Natural Language Generation:**
```python
def generate_insights_narrative(analytics_results):
    """Generar narrativa automática de insights"""
    
    narrative = []
    
    # Compliance trends
    if analytics_results['compliance_trend'] > 0:
        narrative.append(f"El score de compliance ha mejorado {analytics_results['compliance_trend']:.1f}% este mes, indicando una tendencia positiva en la gestión de riesgos.")
    
    # Risk alerts
    high_risk_providers = [p for p in analytics_results['providers'] if p['risk_level'] == 'alto']
    if high_risk_providers:
        narrative.append(f"Atención: {len(high_risk_providers)} proveedores clasificados como alto riesgo requieren revisión inmediata.")
    
    # Training recommendations
    low_performance_areas = analytics_results['training_analysis']['low_performance']
    if low_performance_areas:
        narrative.append(f"Se recomienda reforzar capacitación en: {', '.join(low_performance_areas)}.")
    
    return ' '.join(narrative)
```

### **Automated Reporting:**
```python
def generate_executive_report(period='monthly'):
    """Generar reporte ejecutivo automatizado"""
    
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
    
    # Generar análisis
    analytics = run_comprehensive_analysis(period)
    
    # Crear PDF
    doc = SimpleDocTemplate(f"executive_report_{period}.pdf", pagesize=letter)
    story = []
    
    # Executive Summary
    story.append(Paragraph("Executive Summary - Compliance Analytics", title_style))
    story.append(Spacer(1, 12))
    
    # Key insights
    insights = generate_insights_narrative(analytics)
    story.append(Paragraph(insights, normal_style))
    
    # Charts
    chart_image = save_chart_as_image(analytics['main_chart'])
    story.append(Image(chart_image, width=400, height=300))
    
    # Build PDF
    doc.build(story)
    
    return f"executive_report_{period}.pdf"
```

---

## 🆘 **Need Help?**

### **Resources:**
- 📊 **Plotly Docs:** https://plotly.com/python/
- 🐼 **Pandas Guide:** https://pandas.pydata.org/docs/
- 🤖 **Scikit-learn:** https://scikit-learn.org/stable/

### **Support:**
- 💬 **Slack:** #data-analytics-challenge
- 👨‍💻 **Mentor:** Adrian Lerer - adrian@lerer.com.ar
- 🐛 **GitHub Issues:** Para bugs y preguntas técnicas

---

## 🎉 **¡Convierte Datos en Decisiones!**

Tu trabajo va a permitir que los ejecutivos tomen **decisiones inteligentes** basadas en datos reales. Cada gráfico, cada predicción, cada insight automático va a impactar directamente en la estrategia de integridad de empresas reales.

**¡El poder de los datos está en tus manos! 📊🚀**