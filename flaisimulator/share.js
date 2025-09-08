/**
 * FLAISimulator - Social Sharing & Viral Distribution System
 * Designed for maximum viral spread and user engagement
 */

class SocialShare {
    constructor() {
        this.baseUrl = window.location.origin;
        this.gameUrl = `${this.baseUrl}/game.html`;
        
        // Tracking for viral analytics
        this.shareEvents = [];
        
        this.initializeSharing();
    }

    initializeSharing() {
        // Bind all share buttons on page load
        this.bindShareButtons();
        
        // Track page visits for viral analytics
        this.trackPageVisit();
        
        // Generate shareable URLs with tracking
        this.setupTrackingUrls();
    }

    bindShareButtons() {
        // Main challenge buttons
        const challengeButtons = [
            'share-challenge',
            'share-team-challenge'
        ];
        
        challengeButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => this.shareChallenge());
            }
        });

        // Social media buttons
        const socialButtons = [
            { id: 'share-linkedin', platform: 'linkedin' },
            { id: 'share-whatsapp', platform: 'whatsapp' },
            { id: 'share-twitter', platform: 'twitter' }
        ];

        socialButtons.forEach(({ id, platform }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => this.shareToSocial(platform));
            }
        });
    }

    shareChallenge() {
        const messages = {
            title: '🎯 ¿Qué tan ético eres en tu trabajo?',
            
            description: `¡Te desafío a completar el FLAISimulator! 

Es el primer test de ética empresarial argentina que combina gaming con investigación cultural.

🎮 10 dilemas reales
⚡ 5 minutos total  
📊 Análisis cultural argentino
🏆 Ranking social

¿Te animás a ver qué tan ético eres realmente?`,

            url: this.gameUrl,
            hashtags: '#FLAISimulator #EticaEmpresarial #Argentina #Compliance'
        };

        // Try native sharing first (mobile)
        if (navigator.share && this.isMobile()) {
            navigator.share({
                title: messages.title,
                text: messages.description,
                url: messages.url
            }).then(() => {
                this.trackShareEvent('native', 'challenge');
            }).catch(console.error);
        } else {
            // Fallback to platform-specific sharing
            this.showShareModal(messages);
        }
    }

    shareToSocial(platform, customMessage = null) {
        const baseMessages = {
            linkedin: {
                text: `🎯 ¿Qué tan ético eres en tu trabajo?

Acabo de descubrir FLAISimulator - el primer test de ética empresarial argentina que combina gaming con investigación cultural.

✅ 10 dilemas empresariales reales
✅ Basado en Ley 27.401 
✅ Análisis cultural argentino
✅ Completamente anónimo

Me sorprendió lo realista que es. ¿Se animan a probarlo?

#EticaEmpresarial #Compliance #Argentina #Leadership`,
                url: this.gameUrl
            },
            
            whatsapp: {
                text: `🎯 *¿Qué tan ético eres en tu trabajo?*

Encontré este juego increíble que te pone a prueba con dilemas éticos empresariales reales de Argentina.

🎮 *FLAISimulator* - Solo 5 minutos
📊 Te da un análisis cultural súper interesante
⚡ Basado en casos reales

¿Te animás a probarlo y comparamos resultados?

${this.gameUrl}`,
                url: this.gameUrl
            },
            
            twitter: {
                text: `🎯 ¿Qué tan ético eres en el trabajo?

Acabo de probar #FLAISimulator - el primer test de ética empresarial argentina que combina gaming + investigación cultural 🇦🇷

10 dilemas reales | 5 minutos | Análisis cultural
Basado en Ley 27.401

¿Te animás? 👉`,
                url: this.gameUrl,
                hashtags: 'FLAISimulator,EticaEmpresarial,Argentina,Compliance'
            }
        };

        const message = customMessage || baseMessages[platform];
        if (!message) {
            console.error(`Platform ${platform} not supported`);
            return;
        }

        const shareUrl = this.generateShareUrl(platform, message);
        
        // Track the share event
        this.trackShareEvent(platform, 'social_button');
        
        // Open share window
        if (platform === 'whatsapp' && this.isMobile()) {
            // Direct WhatsApp on mobile
            window.location.href = shareUrl;
        } else {
            // Desktop sharing window
            const shareWindow = window.open(
                shareUrl,
                'share-window',
                'width=600,height=400,scrollbars=yes,resizable=yes'
            );
            
            // Focus the share window
            if (shareWindow) {
                shareWindow.focus();
            }
        }
    }

    generateShareUrl(platform, message) {
        const encodedText = encodeURIComponent(message.text);
        const encodedUrl = encodeURIComponent(message.url);
        
        const shareUrls = {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&text=${encodedText}`,
            
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message.text}\n\n${message.url}`)}`,
            
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}${message.hashtags ? `&hashtags=${message.hashtags}` : ''}`,
            
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
            
            email: `mailto:?subject=${encodeURIComponent('🎯 Test de Ética Empresarial - FLAISimulator')}&body=${encodeURIComponent(`${message.text}\n\n${message.url}`)}`
        };

        return shareUrls[platform] || '';
    }

    showShareModal(messages) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'share-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        `;

        modal.innerHTML = `
            <button class="share-modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">×</button>
            
            <h3 style="margin-bottom: 1rem; color: #1f2937;">🚀 Compartir Desafío</h3>
            <p style="margin-bottom: 1.5rem; color: #6b7280;">Elegí cómo querés compartir el desafío:</p>
            
            <div class="share-options" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button class="share-option" data-platform="whatsapp" style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 2px solid #22c55e;
                    border-radius: 0.5rem;
                    background: rgba(34, 197, 94, 0.1);
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s ease;
                ">
                    <span style="font-size: 1.25rem;">📱</span>
                    <span style="font-weight: 500;">Compartir por WhatsApp</span>
                </button>
                
                <button class="share-option" data-platform="linkedin" style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 2px solid #3b82f6;
                    border-radius: 0.5rem;
                    background: rgba(59, 130, 246, 0.1);
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s ease;
                ">
                    <span style="font-size: 1.25rem;">💼</span>
                    <span style="font-weight: 500;">Compartir en LinkedIn</span>
                </button>
                
                <button class="share-option" data-platform="twitter" style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 2px solid #1da1f2;
                    border-radius: 0.5rem;
                    background: rgba(29, 161, 242, 0.1);
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s ease;
                ">
                    <span style="font-size: 1.25rem;">🐦</span>
                    <span style="font-weight: 500;">Compartir en Twitter</span>
                </button>
                
                <button class="share-option" data-action="copy" style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 2px solid #6b7280;
                    border-radius: 0.5rem;
                    background: rgba(107, 114, 128, 0.1);
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s ease;
                ">
                    <span style="font-size: 1.25rem;">📋</span>
                    <span style="font-weight: 500;">Copiar enlace</span>
                </button>
            </div>
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .share-option:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Bind events
        const closeBtn = modal.querySelector('.share-modal-close');
        closeBtn.addEventListener('click', () => this.closeShareModal(overlay));

        const shareOptions = modal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const platform = option.dataset.platform;
                const action = option.dataset.action;

                if (action === 'copy') {
                    this.copyToClipboard(this.gameUrl);
                } else if (platform) {
                    this.shareToSocial(platform);
                }

                this.closeShareModal(overlay);
            });
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeShareModal(overlay);
            }
        });
    }

    closeShareModal(overlay) {
        overlay.style.animation = 'modalSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('✅ Enlace copiado al portapapeles');
                this.trackShareEvent('copy', 'clipboard');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('✅ Enlace copiado al portapapeles');
                this.trackShareEvent('copy', 'clipboard');
            } catch (err) {
                this.showToast('❌ No se pudo copiar el enlace');
            }
            
            document.body.removeChild(textArea);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #1f2937;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10001;
            animation: toastSlideIn 0.3s ease;
        `;

        const toastStyle = document.createElement('style');
        toastStyle.textContent = `
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(toastStyle);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    trackShareEvent(platform, context) {
        const event = {
            platform,
            context,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
            session_id: this.getSessionId()
        };

        this.shareEvents.push(event);

        // Save to localStorage for analytics
        try {
            const allEvents = JSON.parse(localStorage.getItem('flai_share_events') || '[]');
            allEvents.push(event);
            localStorage.setItem('flai_share_events', JSON.stringify(allEvents.slice(-100))); // Keep last 100 events
        } catch (error) {
            console.error('Error saving share event:', error);
        }

        // In production, this would be sent to analytics server
        console.log('Share event tracked:', event);
    }

    trackPageVisit() {
        const visit = {
            page: window.location.pathname,
            timestamp: Date.now(),
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            session_id: this.getSessionId()
        };

        try {
            const allVisits = JSON.parse(localStorage.getItem('flai_page_visits') || '[]');
            allVisits.push(visit);
            localStorage.setItem('flai_page_visits', JSON.stringify(allVisits.slice(-50))); // Keep last 50 visits
        } catch (error) {
            console.error('Error saving page visit:', error);
        }
    }

    setupTrackingUrls() {
        // Add UTM parameters for tracking viral sources
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('utm_source') || urlParams.get('ref');
        
        if (source) {
            // Track referral source
            try {
                const referralData = {
                    source,
                    timestamp: Date.now(),
                    page: window.location.pathname
                };
                
                const allReferrals = JSON.parse(localStorage.getItem('flai_referrals') || '[]');
                allReferrals.push(referralData);
                localStorage.setItem('flai_referrals', JSON.stringify(allReferrals.slice(-100)));
            } catch (error) {
                console.error('Error saving referral data:', error);
            }
        }

        // Generate trackable URLs for outbound sharing
        this.gameUrl = `${this.baseUrl}/game.html?utm_source=social_share&utm_medium=viral&utm_campaign=flaisimulator`;
    }

    getSessionId() {
        let sessionId = localStorage.getItem('flai_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('flai_session_id', sessionId);
        }
        return sessionId;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Method to get viral analytics for research purposes
    getViralAnalytics() {
        try {
            return {
                share_events: JSON.parse(localStorage.getItem('flai_share_events') || '[]'),
                page_visits: JSON.parse(localStorage.getItem('flai_page_visits') || '[]'),
                referrals: JSON.parse(localStorage.getItem('flai_referrals') || '[]'),
                session_id: this.getSessionId()
            };
        } catch (error) {
            console.error('Error retrieving analytics:', error);
            return null;
        }
    }
}

// Global function for external access (used by game.js)
window.shareResults = function(platform, customMessage) {
    if (window.socialShare) {
        const messageObj = { text: customMessage, url: window.socialShare.gameUrl };
        window.socialShare.shareToSocial(platform, messageObj);
    }
};

// Initialize social sharing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialShare = new SocialShare();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialShare;
}