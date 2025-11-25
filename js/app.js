// Main application logic for Contentply

class ContentplyApp {
    constructor() {
        this.currentPlatform = 'linkedin';
        this.results = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Input type tabs
        const urlTab = document.getElementById('url-tab');
        const textTab = document.getElementById('text-tab');

        if (urlTab) {
            urlTab.addEventListener('click', () => this.switchInputType('url'));
        }
        if (textTab) {
            textTab.addEventListener('click', () => this.switchInputType('text'));
        }

        // Repurpose button
        const repurposeButton = document.getElementById('repurpose-button');
        if (repurposeButton) {
            repurposeButton.addEventListener('click', () => this.handleRepurpose());
        }

        // Platform tabs
        const platformTabs = document.querySelectorAll('.platform-tab');
        platformTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                this.switchPlatform(platform);
            });
        });

        // New content button
        const newContentButton = document.getElementById('new-content-button');
        if (newContentButton) {
            newContentButton.addEventListener('click', () => this.resetApp());
        }

        // Export PDF button
        const exportPdfButton = document.getElementById('export-pdf-button');
        if (exportPdfButton) {
            exportPdfButton.addEventListener('click', () => this.exportToPDF());
        }

        // Settings
        const settingsButton = document.getElementById('settings-button');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.getElementById('close-settings');
        const saveSettings = document.getElementById('save-settings');

        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                settingsModal.classList.remove('hidden');
                this.loadSettings();
            });
        }

        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
            });
        }

        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }

        // Close modal on backdrop click
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.add('hidden');
                }
            });
        }
    }

    switchInputType(type) {
        const urlTab = document.getElementById('url-tab');
        const textTab = document.getElementById('text-tab');
        const urlSection = document.getElementById('url-input-section');
        const textSection = document.getElementById('text-input-section');

        if (type === 'url') {
            urlTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
            urlTab.classList.remove('text-gray-500');
            textTab.classList.add('text-gray-500');
            textTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
            urlSection.classList.remove('hidden');
            textSection.classList.add('hidden');
        } else {
            textTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
            textTab.classList.remove('text-gray-500');
            urlTab.classList.add('text-gray-500');
            urlTab.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
            textSection.classList.remove('hidden');
            urlSection.classList.add('hidden');
        }
    }

    async handleRepurpose() {
        // Hide error
        this.hideError();

        // Check credits
        if (!auth.hasCreditsRemaining()) {
            this.showError('You have no credits remaining this month. Your credits will reset next month.');
            return;
        }

        // Get input
        const urlInput = document.getElementById('content-url');
        const textInput = document.getElementById('content-text');
        const isUrlMode = !document.getElementById('url-input-section').classList.contains('hidden');

        let content = isUrlMode ? urlInput.value.trim() : textInput.value.trim();

        if (!content) {
            this.showError('Please enter a URL or paste your content.');
            return;
        }

        if (isUrlMode && !this.isValidUrl(content)) {
            this.showError('Please enter a valid URL.');
            return;
        }

        // Show loading
        this.showLoading();

        try {
            // Call API
            const results = await contentplyAPI.repurposeContent(content, isUrlMode);

            if (results.success) {
                this.results = results.results;

                // Increment usage
                auth.incrementUsage();

                // Update stats
                auth.updateStats('repurpose');

                // Add to history
                auth.addToHistory({
                    content: content.substring(0, 100),
                    type: isUrlMode ? 'url' : 'text',
                    platforms: Object.keys(results.results)
                });

                // Hide loading and show results
                this.hideLoading();
                this.showResults();
                this.renderPlatformContent(this.currentPlatform);
            } else {
                throw new Error('Failed to repurpose content');
            }

        } catch (error) {
            console.error('Error:', error);
            this.hideLoading();
            this.showError(error.message || 'Something went wrong. Please try again.');
        }
    }

    showLoading() {
        document.querySelector('.bg-white.rounded-xl.shadow-lg.p-8.mb-8').style.display = 'none';
        document.getElementById('loading-section').classList.remove('hidden');
        document.getElementById('results-section').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading-section').classList.add('hidden');
    }

    showResults() {
        document.getElementById('results-section').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchPlatform(platform) {
        this.currentPlatform = platform;

        // Update tab styles
        document.querySelectorAll('.platform-tab').forEach(tab => {
            if (tab.dataset.platform === platform) {
                tab.classList.add('tab-active');
                tab.classList.remove('text-gray-500');
            } else {
                tab.classList.remove('tab-active');
                tab.classList.add('text-gray-500');
            }
        });

        // Render content
        this.renderPlatformContent(platform);
    }

    renderPlatformContent(platform) {
        const container = document.getElementById('results-content');
        if (!this.results || !this.results[platform]) return;

        const content = this.results[platform];
        container.innerHTML = '';

        content.forEach((item, index) => {
            const card = this.createResultCard(item, platform, index);
            container.appendChild(card);
        });
    }

    createResultCard(item, platform, index) {
        const card = document.createElement('div');
        card.className = 'result-card bg-white rounded-xl shadow-lg p-6 fade-in';

        const label = item.type || item.style || item.hook || item.title || `Variation ${index + 1}`;
        const content = item.content || item.thread?.join('\n\n') || '';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">${this.escapeHtml(label)}</h3>
                    ${item.subject ? `<p class="text-sm text-gray-600 mt-1">Subject: ${this.escapeHtml(item.subject)}</p>` : ''}
                </div>
                <button class="copy-button px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center" data-content="${this.escapeHtml(content)}">
                    <i class="fas fa-copy mr-2"></i>
                    Copy
                </button>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 max-h-96 overflow-y-auto">
${this.escapeHtml(content)}
            </div>
            ${platform === 'twitter' && item.thread ? `<div class="mt-3 text-sm text-gray-600"><i class="fas fa-info-circle mr-1"></i> ${item.thread.length} tweets in thread</div>` : ''}
        `;

        // Add copy functionality
        const copyButton = card.querySelector('.copy-button');
        copyButton.addEventListener('click', () => this.copyToClipboard(content, copyButton));

        return card;
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);

            // Visual feedback
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
            button.classList.add('bg-green-600');
            button.classList.remove('bg-purple-600');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-purple-600');
            }, 2000);

        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy to clipboard');
        }
    }

    exportToPDF() {
        // Simple text export (for a real PDF, you'd use a library like jsPDF)
        if (!this.results) return;

        let exportText = 'CONTENTPLY - REPURPOSED CONTENT\n\n';
        exportText += '=' .repeat(50) + '\n\n';

        Object.keys(this.results).forEach(platform => {
            exportText += `${platform.toUpperCase()}\n`;
            exportText += '-'.repeat(50) + '\n\n';

            this.results[platform].forEach((item, i) => {
                const label = item.type || item.style || item.hook || item.title || `Variation ${i + 1}`;
                const content = item.content || item.thread?.join('\n\n') || '';

                exportText += `${label}\n\n`;
                exportText += `${content}\n\n`;
                exportText += '-'.repeat(50) + '\n\n';
            });

            exportText += '\n';
        });

        // Download as text file
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contentply-export-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    resetApp() {
        document.querySelector('.bg-white.rounded-xl.shadow-lg.p-8.mb-8').style.display = 'block';
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('content-url').value = '';
        document.getElementById('content-text').value = '';
        this.results = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadSettings() {
        const webhookInput = document.getElementById('webhook-url-input');
        const apiKeyInput = document.getElementById('api-key-input');

        if (webhookInput) {
            webhookInput.value = localStorage.getItem('n8n_webhook_url') || '';
        }
        if (apiKeyInput) {
            apiKeyInput.value = localStorage.getItem('claude_api_key') || '';
        }
    }

    saveSettings() {
        const webhookInput = document.getElementById('webhook-url-input');
        const apiKeyInput = document.getElementById('api-key-input');

        if (webhookInput && webhookInput.value) {
            updateConfig('n8n_webhook_url', webhookInput.value);
            contentplyAPI.webhookUrl = webhookInput.value;
        }

        if (apiKeyInput && apiKeyInput.value) {
            updateConfig('claude_api_key', apiKeyInput.value);
        }

        document.getElementById('settings-modal').classList.add('hidden');

        // Show success message
        alert('Settings saved successfully!');
    }
}

// Initialize app when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new ContentplyApp();
    });
}
