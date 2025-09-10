/**
 * FLAISimulator - Data Export & Analytics API
 * Sistema para extracción y backup de datos de investigación
 */

class FLAIDataExport {
    constructor() {
        this.apiUrl = window.location.origin + '/.netlify/functions/data-collection'; // Netlify function endpoint
        this.backupInterval = 30000; // 30 segundos
        this.batchSize = 100;
        
        this.initializeDataCollection();
    }

    initializeDataCollection() {
        // Auto-backup periódico
        setInterval(() => {
            this.backupToServer();
        }, this.backupInterval);

        // Backup al cerrar la ventana
        window.addEventListener('beforeunload', () => {
            this.immediateBackup();
        });

        // Backup en visibilidad change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.immediateBackup();
            }
        });
    }

    // Método principal para exportar todos los datos
    exportAllData() {
        const exportData = {
            timestamp: Date.now(),
            export_id: this.generateExportId(),
            version: '1.0',
            data: {
                game_sessions: this.getGameSessionsData(),
                leaderboard: this.getLeaderboardData(),
                viral_analytics: this.getViralAnalytics(),
                cultural_insights: this.getCulturalInsights(),
                aggregated_stats: this.getAggregatedStats()
            }
        };

        return exportData;
    }

    // Datos de sesiones de juego individuales
    getGameSessionsData() {
        try {
            const researchData = JSON.parse(localStorage.getItem('flai_research_data') || '[]');
            
            return researchData.map(session => ({
                session_id: session.session_id,
                timestamp: session.timestamp,
                demographics: session.demographics,
                performance: {
                    total_score: session.results.total_score,
                    percentage: session.results.percentage,
                    completion_time: session.results.game_duration,
                    avg_response_time: session.results.avg_response_time,
                    decision_breakdown: session.results.decision_types
                },
                decisions: session.answers.map(answer => ({
                    scenario_id: answer.scenario_id,
                    decision_type: answer.option_type,
                    cultural_flags: answer.cultural_flags,
                    response_time: answer.time_taken,
                    timestamp: answer.timestamp
                }))
            }));
        } catch (error) {
            console.error('Error getting game sessions data:', error);
            return [];
        }
    }

    // Datos del leaderboard
    getLeaderboardData() {
        try {
            const leaderboard = JSON.parse(localStorage.getItem('flai_leaderboard') || '[]');
            
            return leaderboard.map(entry => ({
                entry_id: entry.id,
                score: entry.score,
                category: entry.category,
                sector: entry.sector,
                position: entry.position,
                region: entry.region,
                timestamp: entry.timestamp,
                session_summary: entry.session_data
            }));
        } catch (error) {
            console.error('Error getting leaderboard data:', error);
            return [];
        }
    }

    // Analytics virales
    getViralAnalytics() {
        try {
            return {
                share_events: JSON.parse(localStorage.getItem('flai_share_events') || '[]'),
                page_visits: JSON.parse(localStorage.getItem('flai_page_visits') || '[]'),
                referrals: JSON.parse(localStorage.getItem('flai_referrals') || '[]')
            };
        } catch (error) {
            console.error('Error getting viral analytics:', error);
            return { share_events: [], page_visits: [], referrals: [] };
        }
    }

    // Insights culturales agregados
    getCulturalInsights() {
        const sessions = this.getGameSessionsData();
        
        // Análisis por sector
        const sectorAnalysis = this.analyzeBySector(sessions);
        
        // Análisis por región
        const regionAnalysis = this.analyzeByRegion(sessions);
        
        // Patrones temporales
        const temporalPatterns = this.analyzeTemporalPatterns(sessions);
        
        // Análisis de flags culturales
        const culturalFlags = this.analyzeCulturalFlags(sessions);

        return {
            sector_insights: sectorAnalysis,
            regional_insights: regionAnalysis,
            temporal_patterns: temporalPatterns,
            cultural_flags: culturalFlags,
            generated_at: Date.now()
        };
    }

    analyzeBySector(sessions) {
        const sectorData = {};
        
        sessions.forEach(session => {
            const sector = session.demographics.sector || 'no_especificado';
            
            if (!sectorData[sector]) {
                sectorData[sector] = {
                    count: 0,
                    total_score: 0,
                    avg_response_time: 0,
                    decision_types: { ethical: 0, consultation: 0, risky: 0 },
                    cultural_flags: {}
                };
            }
            
            sectorData[sector].count++;
            sectorData[sector].total_score += session.performance.percentage;
            sectorData[sector].avg_response_time += session.performance.avg_response_time;
            
            // Agregar decisiones por tipo
            Object.keys(session.performance.decision_breakdown).forEach(type => {
                sectorData[sector].decision_types[type] += session.performance.decision_breakdown[type] || 0;
            });
            
            // Agregar flags culturales
            session.decisions.forEach(decision => {
                decision.cultural_flags.forEach(flag => {
                    sectorData[sector].cultural_flags[flag] = (sectorData[sector].cultural_flags[flag] || 0) + 1;
                });
            });
        });
        
        // Calcular promedios
        Object.keys(sectorData).forEach(sector => {
            const data = sectorData[sector];
            data.avg_score = Math.round(data.total_score / data.count);
            data.avg_response_time = Math.round(data.avg_response_time / data.count);
        });
        
        return sectorData;
    }

    analyzeByRegion(sessions) {
        const regionData = {};
        
        sessions.forEach(session => {
            const region = session.demographics.region || 'no_especificado';
            
            if (!regionData[region]) {
                regionData[region] = {
                    count: 0,
                    total_score: 0,
                    avg_response_time: 0,
                    decision_types: { ethical: 0, consultation: 0, risky: 0 },
                    cultural_flags: {}
                };
            }
            
            regionData[region].count++;
            regionData[region].total_score += session.performance.percentage;
            regionData[region].avg_response_time += session.performance.avg_response_time;
            
            // Agregar decisiones por tipo
            Object.keys(session.performance.decision_breakdown).forEach(type => {
                regionData[region].decision_types[type] += session.performance.decision_breakdown[type] || 0;
            });
            
            // Agregar flags culturales
            session.decisions.forEach(decision => {
                decision.cultural_flags.forEach(flag => {
                    regionData[region].cultural_flags[flag] = (regionData[region].cultural_flags[flag] || 0) + 1;
                });
            });
        });
        
        // Calcular promedios
        Object.keys(regionData).forEach(region => {
            const data = regionData[region];
            data.avg_score = Math.round(data.total_score / data.count);
            data.avg_response_time = Math.round(data.avg_response_time / data.count);
        });
        
        return regionData;
    }

    analyzeTemporalPatterns(sessions) {
        const patterns = {
            by_hour: {},
            by_day_of_week: {},
            by_date: {},
            completion_times: []
        };
        
        sessions.forEach(session => {
            const date = new Date(session.timestamp);
            const hour = date.getHours();
            const dayOfWeek = date.getDay();
            const dateStr = date.toISOString().split('T')[0];
            
            // Por hora
            patterns.by_hour[hour] = (patterns.by_hour[hour] || 0) + 1;
            
            // Por día de la semana
            patterns.by_day_of_week[dayOfWeek] = (patterns.by_day_of_week[dayOfWeek] || 0) + 1;
            
            // Por fecha
            patterns.by_date[dateStr] = (patterns.by_date[dateStr] || 0) + 1;
            
            // Tiempos de completion
            patterns.completion_times.push(session.performance.completion_time);
        });
        
        return patterns;
    }

    analyzeCulturalFlags(sessions) {
        const flagAnalysis = {};
        
        sessions.forEach(session => {
            session.decisions.forEach(decision => {
                decision.cultural_flags.forEach(flag => {
                    if (!flagAnalysis[flag]) {
                        flagAnalysis[flag] = {
                            total_count: 0,
                            by_sector: {},
                            by_region: {},
                            by_scenario: {}
                        };
                    }
                    
                    flagAnalysis[flag].total_count++;
                    
                    // Por sector
                    const sector = session.demographics.sector || 'no_especificado';
                    flagAnalysis[flag].by_sector[sector] = (flagAnalysis[flag].by_sector[sector] || 0) + 1;
                    
                    // Por región
                    const region = session.demographics.region || 'no_especificado';
                    flagAnalysis[flag].by_region[region] = (flagAnalysis[flag].by_region[region] || 0) + 1;
                    
                    // Por escenario
                    const scenario = decision.scenario_id;
                    flagAnalysis[flag].by_scenario[scenario] = (flagAnalysis[flag].by_scenario[scenario] || 0) + 1;
                });
            });
        });
        
        return flagAnalysis;
    }

    // Estadísticas agregadas
    getAggregatedStats() {
        const sessions = this.getGameSessionsData();
        const viral = this.getViralAnalytics();
        
        return {
            total_sessions: sessions.length,
            total_decisions: sessions.reduce((sum, s) => sum + s.decisions.length, 0),
            average_score: sessions.length > 0 ? 
                Math.round(sessions.reduce((sum, s) => sum + s.performance.percentage, 0) / sessions.length) : 0,
            completion_rate: sessions.length > 0 ?
                sessions.filter(s => s.decisions.length === 10).length / sessions.length : 0,
            unique_sectors: new Set(sessions.map(s => s.demographics.sector)).size,
            unique_regions: new Set(sessions.map(s => s.demographics.region)).size,
            viral_metrics: {
                total_shares: viral.share_events.length,
                total_referrals: viral.referrals.length,
                page_views: viral.page_visits.length
            }
        };
    }

    // Backup automático al servidor
    async backupToServer() {
        try {
            const data = this.exportAllData();
            
            // Enviar solo si hay datos nuevos
            if (data.data.game_sessions.length === 0) {
                return;
            }
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Source': 'flaisimulator',
                    'X-Version': '1.0'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log('✅ Data backup successful');
                this.markDataAsBacked();
            } else {
                console.warn('⚠️ Backup failed:', response.status);
            }
        } catch (error) {
            console.warn('⚠️ Backup error:', error.message);
            // Datos se mantienen en localStorage como fallback
        }
    }

    // Backup inmediato (síncrono usando sendBeacon)
    immediateBackup() {
        try {
            const data = this.exportAllData();
            
            if (navigator.sendBeacon && data.data.game_sessions.length > 0) {
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                navigator.sendBeacon(this.apiUrl, blob);
            }
        } catch (error) {
            console.warn('⚠️ Immediate backup failed:', error);
        }
    }

    // Descargar datos como archivo JSON
    downloadData() {
        const data = this.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `flaisimulator-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Descargar datos como CSV para análisis
    downloadCSV() {
        const sessions = this.getGameSessionsData();
        
        if (sessions.length === 0) {
            alert('No hay datos para exportar');
            return;
        }
        
        const csvRows = [];
        
        // Headers
        csvRows.push([
            'session_id', 'timestamp', 'sector', 'position', 'region', 'experience',
            'total_score', 'percentage', 'completion_time', 'avg_response_time',
            'ethical_decisions', 'consultation_decisions', 'risky_decisions',
            'scenario_1', 'scenario_2', 'scenario_3', 'scenario_4', 'scenario_5',
            'scenario_6', 'scenario_7', 'scenario_8', 'scenario_9', 'scenario_10'
        ]);
        
        // Data rows
        sessions.forEach(session => {
            const row = [
                session.session_id,
                new Date(session.timestamp).toISOString(),
                session.demographics.sector,
                session.demographics.position,
                session.demographics.region,
                session.demographics.experience,
                session.performance.total_score,
                session.performance.percentage,
                session.performance.completion_time,
                session.performance.avg_response_time,
                session.performance.decision_breakdown.ethical || 0,
                session.performance.decision_breakdown.consultation || 0,
                session.performance.decision_breakdown.risky || 0
            ];
            
            // Agregar decisiones por escenario
            for (let i = 1; i <= 10; i++) {
                const decision = session.decisions.find(d => d.scenario_id === i);
                row.push(decision ? decision.decision_type : '');
            }
            
            csvRows.push(row);
        });
        
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `flaisimulator-sessions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Obtener estadísticas en tiempo real
    getLiveStats() {
        const stats = this.getAggregatedStats();
        
        return {
            ...stats,
            last_session: this.getLastSessionTime(),
            growth_rate: this.calculateGrowthRate(),
            top_sectors: this.getTopSectors(),
            viral_coefficient: this.calculateViralCoefficient()
        };
    }

    getLastSessionTime() {
        const sessions = this.getGameSessionsData();
        if (sessions.length === 0) return null;
        
        const lastSession = Math.max(...sessions.map(s => s.timestamp));
        return new Date(lastSession).toISOString();
    }

    calculateGrowthRate() {
        const sessions = this.getGameSessionsData();
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        const todaySessions = sessions.filter(s => s.timestamp > oneDayAgo).length;
        const totalSessions = sessions.length;
        
        if (totalSessions === 0) return 0;
        return Math.round((todaySessions / totalSessions) * 100);
    }

    getTopSectors() {
        const insights = this.getCulturalInsights();
        const sectors = Object.entries(insights.sector_insights)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([sector, data]) => ({ sector, count: data.count, avg_score: data.avg_score }));
        
        return sectors;
    }

    calculateViralCoefficient() {
        const viral = this.getViralAnalytics();
        const sessions = this.getGameSessionsData().length;
        
        if (sessions === 0) return 0;
        return Math.round((viral.referrals.length / sessions) * 100) / 100;
    }

    markDataAsBacked() {
        localStorage.setItem('flai_last_backup', Date.now().toString());
    }

    generateExportId() {
        return 'export_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Limpiar datos antiguos (mantener solo últimos 30 días)
    cleanOldData() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        try {
            // Limpiar research data
            const researchData = JSON.parse(localStorage.getItem('flai_research_data') || '[]');
            const filteredResearch = researchData.filter(item => item.timestamp > thirtyDaysAgo);
            localStorage.setItem('flai_research_data', JSON.stringify(filteredResearch));
            
            // Limpiar viral analytics
            const shareEvents = JSON.parse(localStorage.getItem('flai_share_events') || '[]');
            const filteredShares = shareEvents.filter(item => item.timestamp > thirtyDaysAgo);
            localStorage.setItem('flai_share_events', JSON.stringify(filteredShares));
            
            console.log('✅ Old data cleaned');
        } catch (error) {
            console.warn('⚠️ Error cleaning old data:', error);
        }
    }
}

// Inicializar sistema de exportación
window.addEventListener('DOMContentLoaded', () => {
    window.flaiDataExport = new FLAIDataExport();
    
    // Agregar botones de exportación en consola
    console.log(`
🎯 FLAISimulator Data Export System Ready!

Available commands:
📊 window.flaiDataExport.getLiveStats() - Get real-time statistics
💾 window.flaiDataExport.downloadData() - Download complete dataset (JSON)
📈 window.flaiDataExport.downloadCSV() - Download sessions data (CSV)
🔍 window.flaiDataExport.exportAllData() - View all data in console
🧹 window.flaiDataExport.cleanOldData() - Clean data older than 30 days

Data is automatically backed up every 30 seconds and on page unload.
`);
});

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLAIDataExport;
}