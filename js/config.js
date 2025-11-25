// Configuration file for Contentply
const CONFIG = {
    // n8n webhook endpoints (set these from your Railway deployment)
    N8N_WEBHOOK_URL: localStorage.getItem('n8n_webhook_url') || 'https://your-n8n-instance.railway.app/webhook/repurpose',
    N8N_AUTH_WEBHOOK_URL: localStorage.getItem('n8n_auth_webhook_url') || 'https://your-n8n-instance.railway.app/webhook/auth',

    // App settings
    APP_NAME: 'Contentply',
    API_RATE_LIMIT: 20, // Monthly limit

    // Local storage keys
    STORAGE_KEYS: {
        API_KEY: 'contentply_api_key',
        USAGE: 'contentply_usage',
        STATS: 'contentply_stats',
        HISTORY: 'contentply_history',
        SETTINGS: 'contentply_settings'
    },

    // Claude API settings (optional - for direct testing)
    CLAUDE_API_KEY: localStorage.getItem('claude_api_key') || '',
    CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',

    // Platform types
    PLATFORMS: {
        LINKEDIN: 'linkedin',
        TWITTER: 'twitter',
        INSTAGRAM: 'instagram',
        EMAIL: 'email',
        SUMMARY: 'summary'
    }
};

// Update configuration from settings
function updateConfig(key, value) {
    if (key === 'n8n_webhook_url') {
        CONFIG.N8N_WEBHOOK_URL = value;
        localStorage.setItem('n8n_webhook_url', value);
    } else if (key === 'claude_api_key') {
        CONFIG.CLAUDE_API_KEY = value;
        localStorage.setItem('claude_api_key', value);
    }
}

// Export config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
