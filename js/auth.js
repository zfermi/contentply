// Authentication and usage tracking for Contentply

class Auth {
    constructor() {
        this.apiKey = this.getApiKey();
        this.usage = this.getUsage();
        this.initAuth();
    }

    initAuth() {
        // Initialize usage tracking if not exists
        if (!this.usage) {
            this.usage = {
                used: 0,
                total: CONFIG.API_RATE_LIMIT,
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            };
            this.saveUsage();
        }

        // Reset usage if new month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        if (this.usage.month !== currentMonth || this.usage.year !== currentYear) {
            this.usage.used = 0;
            this.usage.month = currentMonth;
            this.usage.year = currentYear;
            this.saveUsage();
        }
    }

    getApiKey() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY) || this.generateApiKey();
    }

    generateApiKey() {
        // Generate a simple API key for demo purposes
        const key = 'ck_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.saveApiKey(key);
        return key;
    }

    saveApiKey(key) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, key);
        this.apiKey = key;
    }

    getUsage() {
        const usage = localStorage.getItem(CONFIG.STORAGE_KEYS.USAGE);
        return usage ? JSON.parse(usage) : null;
    }

    saveUsage() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USAGE, JSON.stringify(this.usage));
    }

    hasCreditsRemaining() {
        return this.usage.used < this.usage.total;
    }

    getCreditsRemaining() {
        return this.usage.total - this.usage.used;
    }

    incrementUsage() {
        if (this.hasCreditsRemaining()) {
            this.usage.used++;
            this.saveUsage();
            this.updateCreditsDisplay();
            return true;
        }
        return false;
    }

    updateCreditsDisplay() {
        const creditsElements = document.querySelectorAll('#credits-remaining, #credits-stat');
        creditsElements.forEach(el => {
            if (el.id === 'credits-remaining') {
                el.textContent = `${this.getCreditsRemaining()}/${this.usage.total}`;
            } else if (el.id === 'credits-stat') {
                el.textContent = `${this.getCreditsRemaining()}/${this.usage.total}`;
            }
        });

        // Update progress bar if exists
        const progressBar = document.querySelector('.bg-gradient-to-r.from-purple-600');
        if (progressBar) {
            const percentage = (this.getCreditsRemaining() / this.usage.total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Stats tracking
    updateStats(type = 'repurpose') {
        const stats = this.getStats();

        if (type === 'repurpose') {
            stats.total++;
            stats.posts += 25; // Approximate posts per repurpose
            stats.hours += 2; // Approximate hours saved
        }

        localStorage.setItem(CONFIG.STORAGE_KEYS.STATS, JSON.stringify(stats));
    }

    getStats() {
        const stats = localStorage.getItem(CONFIG.STORAGE_KEYS.STATS);
        return stats ? JSON.parse(stats) : {
            total: 0,
            posts: 0,
            hours: 0
        };
    }

    // History tracking
    addToHistory(item) {
        const history = this.getHistory();
        history.unshift({
            ...item,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });

        // Keep only last 50 items
        if (history.length > 50) {
            history.pop();
        }

        localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }

    getHistory() {
        const history = localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    }
}

// Initialize auth
const auth = new Auth();

// Update credits display on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        auth.updateCreditsDisplay();
    });
}
