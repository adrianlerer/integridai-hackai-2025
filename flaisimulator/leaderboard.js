/**
 * FLAISimulator - Leaderboard & Ranking System
 * Manages local rankings and competitive elements for viral engagement
 */

class FLAILeaderboard {
    constructor() {
        this.storageKey = 'flai_leaderboard';
        this.analyticsKey = 'flai_analytics';
        this.maxEntries = 100;
        
        // Initialize leaderboard with sample data if empty
        this.initializeLeaderboard();
        
        // Bind events if on appropriate pages
        this.bindEvents();
        
        // Update displays
        this.updateLeaderboardDisplays();
    }

    initializeLeaderboard() {
        const existingData = this.getLeaderboardData();
        
        // If no data exists, seed with realistic sample data
        if (existingData.length === 0) {
            this.seedSampleData();
        }
    }

    seedSampleData() {
        const sampleEntries = [
            {
                id: this.generateId(),
                name: 'María L.',
                score: 94,
                category: 'Ético Ejemplar',
                sector: 'fintech',
                position: 'director',
                region: 'caba',
                timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
                verified: true
            },
            {
                id: this.generateId(),
                name: 'Carlos R.',
                score: 91,
                category: 'Ético Ejemplar',
                sector: 'consultoria',
                position: 'gerente',
                region: 'caba',
                timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
                verified: true
            },
            {
                id: this.generateId(),
                name: 'Ana S.',
                score: 89,
                category: 'Ético Sólido',
                sector: 'tecnologia',
                position: 'senior',
                region: 'cordoba',
                timestamp: Date.now() - (4 * 24 * 60 * 60 * 1000), // 4 days ago
                verified: true
            },
            {
                id: this.generateId(),
                name: 'Diego M.',
                score: 87,
                category: 'Ético Sólido',
                sector: 'retail',
                position: 'gerente',
                region: 'rosario',
                timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Lucía F.',
                score: 86,
                category: 'Ético Sólido',
                sector: 'finanzas',
                position: 'senior',
                region: 'caba',
                timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Rodrigo P.',
                score: 84,
                category: 'Ético Sólido',
                sector: 'tecnologia',
                position: 'supervisor',
                region: 'mendoza',
                timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Valeria K.',
                score: 83,
                category: 'Ético Sólido',
                sector: 'consultoria',
                position: 'senior',
                region: 'caba',
                timestamp: Date.now() - (18 * 60 * 60 * 1000), // 18 hours ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Martín L.',
                score: 81,
                category: 'Ético Sólido',
                sector: 'manufactura',
                position: 'gerente',
                region: 'gba',
                timestamp: Date.now() - (12 * 60 * 60 * 1000), // 12 hours ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Carolina J.',
                score: 79,
                category: 'Perfil Mixto',
                sector: 'salud',
                position: 'supervisor',
                region: 'tucuman',
                timestamp: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
                verified: false
            },
            {
                id: this.generateId(),
                name: 'Sebastián N.',
                score: 77,
                category: 'Perfil Mixto',
                sector: 'educacion',
                position: 'senior',
                region: 'cordoba',
                timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
                verified: false
            }
        ];

        this.saveLeaderboardData(sampleEntries);
    }

    addEntry(gameData) {
        const leaderboard = this.getLeaderboardData();
        
        // Create new entry
        const newEntry = {
            id: this.generateId(),
            name: this.generateAnonymousName(),
            score: gameData.score,
            category: gameData.category,
            sector: gameData.sector || 'no_especificado',
            position: gameData.position || 'no_especificado',
            region: gameData.region || 'no_especificado',
            timestamp: gameData.timestamp || Date.now(),
            verified: false,
            session_data: {
                game_duration: gameData.game_duration,
                avg_response_time: gameData.avg_response_time,
                decision_types: gameData.decision_types
            }
        };

        // Add to leaderboard
        leaderboard.push(newEntry);
        
        // Sort by score (descending) and timestamp (most recent for ties)
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.timestamp - a.timestamp;
        });

        // Keep only top entries
        const trimmedLeaderboard = leaderboard.slice(0, this.maxEntries);
        
        // Save updated leaderboard
        this.saveLeaderboardData(trimmedLeaderboard);
        
        // Update displays
        this.updateLeaderboardDisplays();
        
        // Return user's position
        return this.findUserPosition(newEntry.id);
    }

    getLeaderboardData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            return [];
        }
    }

    saveLeaderboardData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.updateAnalytics(data);
        } catch (error) {
            console.error('Error saving leaderboard data:', error);
        }
    }

    updateAnalytics(leaderboardData) {
        const analytics = {
            total_players: leaderboardData.length,
            average_score: this.calculateAverageScore(leaderboardData),
            sector_distribution: this.calculateSectorDistribution(leaderboardData),
            region_distribution: this.calculateRegionDistribution(leaderboardData),
            score_distribution: this.calculateScoreDistribution(leaderboardData),
            last_updated: Date.now()
        };

        try {
            localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
        } catch (error) {
            console.error('Error saving analytics:', error);
        }
    }

    calculateAverageScore(data) {
        if (data.length === 0) return 0;
        const totalScore = data.reduce((sum, entry) => sum + entry.score, 0);
        return Math.round(totalScore / data.length);
    }

    calculateSectorDistribution(data) {
        const distribution = {};
        data.forEach(entry => {
            distribution[entry.sector] = (distribution[entry.sector] || 0) + 1;
        });
        return distribution;
    }

    calculateRegionDistribution(data) {
        const distribution = {};
        data.forEach(entry => {
            distribution[entry.region] = (distribution[entry.region] || 0) + 1;
        });
        return distribution;
    }

    calculateScoreDistribution(data) {
        const ranges = {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            '50-59': 0,
            '0-49': 0
        };

        data.forEach(entry => {
            const score = entry.score;
            if (score >= 90) ranges['90-100']++;
            else if (score >= 80) ranges['80-89']++;
            else if (score >= 70) ranges['70-79']++;
            else if (score >= 60) ranges['60-69']++;
            else if (score >= 50) ranges['50-59']++;
            else ranges['0-49']++;
        });

        return ranges;
    }

    findUserPosition(entryId) {
        const leaderboard = this.getLeaderboardData();
        const position = leaderboard.findIndex(entry => entry.id === entryId);
        return position !== -1 ? position + 1 : null;
    }

    getTopPlayers(limit = 10) {
        const leaderboard = this.getLeaderboardData();
        return leaderboard.slice(0, limit);
    }

    getPlayersBySector(sector, limit = 10) {
        const leaderboard = this.getLeaderboardData();
        return leaderboard
            .filter(entry => entry.sector === sector)
            .slice(0, limit);
    }

    getPlayersByRegion(region, limit = 10) {
        const leaderboard = this.getLeaderboardData();
        return leaderboard
            .filter(entry => entry.region === region)
            .slice(0, limit);
    }

    generateAnonymousName() {
        const firstNames = [
            'María', 'Carlos', 'Ana', 'Diego', 'Lucía', 'Rodrigo', 'Valeria', 
            'Martín', 'Carolina', 'Sebastián', 'Laura', 'Pablo', 'Florencia',
            'Nicolás', 'Camila', 'Facundo', 'Victoria', 'Tomás', 'Agustina',
            'Santiago', 'Melina', 'Franco', 'Sofía', 'Matías', 'Julieta'
        ];

        const lastInitials = [
            'A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.',
            'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'Q.', 'R.', 'S.', 'T.',
            'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'
        ];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
        
        return `${firstName} ${lastInitial}`;
    }

    generateId() {
        return 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    bindEvents() {
        // Tab switching for rankings
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleTabSwitch(e.target);
            }
        });
    }

    handleTabSwitch(tabButton) {
        const tabName = tabButton.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabButton.classList.add('active');

        // Update content
        this.displayLeaderboard(tabName);
    }

    displayLeaderboard(type = 'general') {
        const container = document.getElementById('general-ranking');
        if (!container) return;

        let data;
        let title = 'Ranking General';

        switch (type) {
            case 'sectores':
                data = this.getLeaderboardBySectors();
                title = 'Ranking por Sectores';
                break;
            case 'regiones':
                data = this.getLeaderboardByRegions();
                title = 'Ranking por Regiones';
                break;
            default:
                data = this.getTopPlayers(10);
                title = 'Ranking General';
        }

        this.renderLeaderboardHTML(container, data, title);
    }

    getLeaderboardBySectors() {
        const leaderboard = this.getLeaderboardData();
        const sectors = {};

        // Group by sector and find top player in each
        leaderboard.forEach(entry => {
            if (!sectors[entry.sector] || entry.score > sectors[entry.sector].score) {
                sectors[entry.sector] = entry;
            }
        });

        // Convert to array and sort by score
        return Object.values(sectors)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    getLeaderboardByRegions() {
        const leaderboard = this.getLeaderboardData();
        const regions = {};

        // Group by region and find top player in each
        leaderboard.forEach(entry => {
            if (!regions[entry.region] || entry.score > regions[entry.region].score) {
                regions[entry.region] = entry;
            }
        });

        // Convert to array and sort by score
        return Object.values(regions)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    renderLeaderboardHTML(container, data, title) {
        if (!container || !data.length) return;

        const sectorNames = {
            'tecnologia': 'Tecnología',
            'finanzas': 'Finanzas',
            'consultoria': 'Consultoría',
            'retail': 'Retail',
            'manufactura': 'Manufactura',
            'salud': 'Salud',
            'educacion': 'Educación',
            'fintech': 'Fintech',
            'gobierno': 'Gobierno'
        };

        const regionNames = {
            'caba': 'CABA',
            'gba': 'GBA',
            'cordoba': 'Córdoba',
            'rosario': 'Rosario',
            'mendoza': 'Mendoza',
            'tucuman': 'Tucumán'
        };

        let html = `<div class="leaderboard">`;

        data.forEach((entry, index) => {
            const position = index + 1;
            let positionClass = '';
            let positionIcon = position;

            if (position === 1) {
                positionClass = 'podium gold';
                positionIcon = '🥇';
            } else if (position === 2) {
                positionClass = 'podium silver';
                positionIcon = '🥈';
            } else if (position === 3) {
                positionClass = 'podium bronze';
                positionIcon = '🥉';
            }

            const sectorDisplay = sectorNames[entry.sector] || entry.sector;
            const regionDisplay = regionNames[entry.region] || entry.region;

            html += `
                <div class="leader-item ${positionClass}">
                    <span class="position">${positionIcon}</span>
                    <span class="name">${entry.name}</span>
                    <span class="score">${entry.score}/100</span>
                    <span class="sector">${sectorDisplay}</span>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    updateLeaderboardDisplays() {
        // Update main page leaderboard if present
        this.displayLeaderboard('general');
        
        // Update stats counters if present
        this.updateStatsCounters();
    }

    updateStatsCounters() {
        const analytics = this.getAnalytics();
        if (!analytics) return;

        // Update total players counter
        const totalPlayersElement = document.getElementById('total-players');
        if (totalPlayersElement) {
            totalPlayersElement.textContent = (analytics.total_players + 2837).toLocaleString();
        }

        // Update total decisions counter (approximate)
        const totalDecisionsElement = document.getElementById('total-decisions');
        if (totalDecisionsElement) {
            const decisionsCount = analytics.total_players * 10 + 12394; // 10 decisions per game
            totalDecisionsElement.textContent = decisionsCount.toLocaleString();
        }
    }

    getAnalytics() {
        try {
            const data = localStorage.getItem(this.analyticsKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading analytics:', error);
            return null;
        }
    }

    // Method for getting comprehensive analytics for research
    getComprehensiveAnalytics() {
        const leaderboard = this.getLeaderboardData();
        const analytics = this.getAnalytics();

        return {
            leaderboard_summary: {
                total_entries: leaderboard.length,
                average_score: analytics?.average_score || 0,
                top_10_average: this.calculateAverageScore(leaderboard.slice(0, 10)),
                score_distribution: analytics?.score_distribution || {}
            },
            demographic_breakdown: {
                by_sector: analytics?.sector_distribution || {},
                by_region: analytics?.region_distribution || {},
                by_position: this.calculatePositionDistribution(leaderboard)
            },
            temporal_patterns: {
                entries_by_day: this.getEntriesByDay(leaderboard),
                peak_hours: this.getPeakHours(leaderboard)
            },
            performance_insights: {
                sector_averages: this.calculateSectorAverages(leaderboard),
                region_averages: this.calculateRegionAverages(leaderboard)
            }
        };
    }

    calculatePositionDistribution(data) {
        const distribution = {};
        data.forEach(entry => {
            distribution[entry.position] = (distribution[entry.position] || 0) + 1;
        });
        return distribution;
    }

    getEntriesByDay(data) {
        const dayPattern = {};
        const now = Date.now();
        
        data.forEach(entry => {
            const daysAgo = Math.floor((now - entry.timestamp) / (24 * 60 * 60 * 1000));
            dayPattern[daysAgo] = (dayPattern[daysAgo] || 0) + 1;
        });
        
        return dayPattern;
    }

    getPeakHours(data) {
        const hourPattern = {};
        
        data.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            hourPattern[hour] = (hourPattern[hour] || 0) + 1;
        });
        
        return hourPattern;
    }

    calculateSectorAverages(data) {
        const sectorScores = {};
        
        data.forEach(entry => {
            if (!sectorScores[entry.sector]) {
                sectorScores[entry.sector] = { total: 0, count: 0 };
            }
            sectorScores[entry.sector].total += entry.score;
            sectorScores[entry.sector].count += 1;
        });
        
        const averages = {};
        Object.keys(sectorScores).forEach(sector => {
            averages[sector] = Math.round(sectorScores[sector].total / sectorScores[sector].count);
        });
        
        return averages;
    }

    calculateRegionAverages(data) {
        const regionScores = {};
        
        data.forEach(entry => {
            if (!regionScores[entry.region]) {
                regionScores[entry.region] = { total: 0, count: 0 };
            }
            regionScores[entry.region].total += entry.score;
            regionScores[entry.region].count += 1;
        });
        
        const averages = {};
        Object.keys(regionScores).forEach(region => {
            averages[region] = Math.round(regionScores[region].total / regionScores[region].count);
        });
        
        return averages;
    }

    // Export data for research purposes
    exportDataForResearch() {
        const data = {
            leaderboard: this.getLeaderboardData(),
            analytics: this.getAnalytics(),
            comprehensive: this.getComprehensiveAnalytics(),
            export_timestamp: Date.now()
        };

        // In a real implementation, this would be sent to a research server
        console.log('Research data export:', data);
        
        return data;
    }
}

// Initialize leaderboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flaiLeaderboard = new FLAILeaderboard();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLAILeaderboard;
}