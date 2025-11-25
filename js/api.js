// API calls to n8n webhooks and Claude AI

class ContentplyAPI {
    constructor() {
        this.webhookUrl = CONFIG.N8N_WEBHOOK_URL;
    }

    /**
     * Repurpose content via n8n webhook
     */
    async repurposeContent(content, isUrl = false) {
        try {
            // For demo/testing: If no webhook URL configured, use mock data
            if (this.webhookUrl.includes('your-n8n-instance')) {
                console.log('Using mock data (n8n not configured)');
                return this.getMockResults(content);
            }

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    isUrl: isUrl,
                    apiKey: auth.apiKey,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error repurposing content:', error);
            throw new Error('Failed to repurpose content. Please check your n8n webhook URL.');
        }
    }

    /**
     * Fetch content from URL (if needed)
     */
    async fetchUrlContent(url) {
        try {
            // This would typically be handled by n8n
            // For now, we'll pass the URL to n8n and let it handle fetching
            return url;
        } catch (error) {
            console.error('Error fetching URL:', error);
            throw new Error('Failed to fetch content from URL');
        }
    }

    /**
     * Mock results for testing without n8n
     */
    getMockResults(content) {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    results: {
                        linkedin: this.generateLinkedInPosts(content),
                        twitter: this.generateTwitterThreads(content),
                        instagram: this.generateInstagramCaptions(content),
                        email: this.generateEmailNewsletter(content),
                        summary: this.generateSummary(content)
                    }
                });
            }, 2000); // 2 second delay to simulate processing
        });
    }

    generateLinkedInPosts(content) {
        const preview = content.substring(0, 100);
        return [
            {
                type: 'Story-based',
                content: `🎯 Here's a story that changed everything:\n\n${preview}...\n\nThis taught me that consistency beats perfection.\n\nWhat's your take on this?`
            },
            {
                type: 'Tips List',
                content: `📌 5 Key Takeaways:\n\n1. Start with the end in mind\n2. Focus on one thing at a time\n3. Ship early and iterate\n4. Listen to your users\n5. Never stop learning\n\nWhich resonates most with you?`
            },
            {
                type: 'Insight',
                content: `💡 Most people think success is about working harder.\n\nBut I've learned it's about working smarter.\n\n${preview}...\n\nThe difference? Focus.`
            },
            {
                type: 'Question',
                content: `❓ Quick question for my network:\n\nHow do you decide what to work on when everything feels urgent?\n\nI just wrote about this: ${preview}...\n\nWould love your perspective.`
            },
            {
                type: 'Announcement',
                content: `🚀 Just published something I'm proud of:\n\n${preview}...\n\nTook me 2 weeks to research and write.\n\nHope it helps you on your journey.`
            }
        ];
    }

    generateTwitterThreads(content) {
        const threads = [];
        const hooks = [
            "🧵 Thread: The ONE thing I wish I knew earlier",
            "🔥 Hot take: Most advice on this topic is wrong",
            "💰 How I [achieved X] in [Y time]",
            "⚡ Quick thread on what actually works",
            "🎯 The framework I use for [topic]",
            "🚀 Let me save you months of trial and error",
            "💡 Unpopular opinion:",
            "📊 Here's what the data actually shows",
            "🎓 What 3 years of [topic] taught me",
            "⭐ The truth about [topic] nobody talks about"
        ];

        hooks.forEach((hook, i) => {
            threads.push({
                hook: hook,
                thread: [
                    hook,
                    `The conventional wisdom says [common belief].\n\nBut after ${i + 1} years, I've learned it's more nuanced.`,
                    `Here's what actually matters:\n\n1. [Point 1]\n2. [Point 2]\n3. [Point 3]`,
                    `Most people focus on [wrong thing].\n\nBut the real key is [right thing].`,
                    `Here's a simple framework:\n\n→ Step 1: [Action]\n→ Step 2: [Action]\n→ Step 3: [Action]`,
                    `The biggest mistake I see?\n\n[Common mistake]`,
                    `Instead, try this:\n\n[Better approach]`,
                    `Real example:\n\n[Brief case study or data point]`,
                    `The results speak for themselves:\n\n• [Metric 1]\n• [Metric 2]\n• [Metric 3]`,
                    `Bottom line:\n\n[Key takeaway]`,
                    `Want to go deeper?\n\n[CTA or link]`,
                    `If you found this helpful:\n\n1. Follow me @yourusername\n2. RT the first tweet\n3. Share your thoughts below`
                ]
            });
        });

        return threads;
    }

    generateInstagramCaptions(content) {
        return [
            {
                style: 'Motivational',
                content: `✨ Your daily reminder:\n\nSuccess isn't about being perfect.\nIt's about being consistent.\n\n💫 Keep showing up.\n💫 Keep learning.\n💫 Keep growing.\n\nThe compound effect is real.\n\n#motivation #contentcreator #entrepreneur #mindset #success`
            },
            {
                style: 'Educational',
                content: `📚 SAVE THIS POST\n\nThe 5 things I wish I knew earlier:\n\n1️⃣ Start before you're ready\n2️⃣ Focus on one thing\n3️⃣ Ship imperfect work\n4️⃣ Listen to feedback\n5️⃣ Never stop learning\n\nWhich one resonates most? 👇\n\n#education #tips #learning #growth #business`
            },
            {
                style: 'Story',
                content: `📖 STORY TIME\n\nTwo years ago, I had no idea where to start.\n\nToday? Complete different story.\n\nWhat changed?\n\nSwipe to find out ➡️\n\n#journey #transformation #entrepreneurship #inspiration #storytime`
            },
            {
                style: 'Behind the Scenes',
                content: `🎬 Behind the scenes of my process:\n\nThis is what creating content actually looks like.\n\nNot glamorous, but it works.\n\nThe secret? Consistency > Perfection\n\nDouble tap if you agree 💜\n\n#behindthescenes #contentcreation #reallife #authentic #creator`
            },
            {
                style: 'Value-Packed',
                content: `💎 FREE VALUE BOMB\n\nHere's the exact framework I use:\n\n→ [Step 1]\n→ [Step 2]\n→ [Step 3]\n\nSave this for later!\n\nDM me "GUIDE" for the full breakdown\n\n#value #free #framework #strategy #tips #business`
            }
        ];
    }

    generateEmailNewsletter(content) {
        return [{
            subject: 'What I Learned About [Topic]',
            content: `Hey there,

I've been thinking a lot about [topic] lately.

And I realized something important:

[Main insight]

Let me break it down:

━━━━━━━━━━━━━━━━━━━━

THE PROBLEM

Most people approach this wrong.

They focus on [common approach], which leads to [negative outcome].

But there's a better way.

━━━━━━━━━━━━━━━━━━━━

THE SOLUTION

Here's what actually works:

1. [Point 1]
   → [Explanation]

2. [Point 2]
   → [Explanation]

3. [Point 3]
   → [Explanation]

━━━━━━━━━━━━━━━━━━━━

REAL EXAMPLE

I tested this myself:

• Before: [Metric]
• After: [Metric]
• Time taken: [Time]

The difference? [Key factor]

━━━━━━━━━━━━━━━━━━━━

YOUR ACTION STEP

Here's what to do this week:

→ [Action 1]
→ [Action 2]
→ [Action 3]

━━━━━━━━━━━━━━━━━━━━

That's it for today!

Hit reply and let me know what you think.

[Your Name]

P.S. [Relevant P.S. or CTA]`
        }];
    }

    generateSummary(content) {
        return [{
            title: 'Blog Post Summary',
            content: `# Content Summary

## Key Points

1. **Main Idea**: [Primary theme or argument]

2. **Supporting Points**:
   - [Point 1]
   - [Point 2]
   - [Point 3]

3. **Actionable Takeaways**:
   - [Takeaway 1]
   - [Takeaway 2]
   - [Takeaway 3]

## Best Use Cases

This content is perfect for:
- LinkedIn: Focus on the professional insights
- Twitter: Break down into bite-sized threads
- Instagram: Use the visual/emotional elements
- Email: Expand on the how-to aspects

## Content Stats

- Original length: ~${content.length} characters
- Estimated reading time: ${Math.ceil(content.length / 1000)} minutes
- Social posts generated: 25+
- Platforms covered: 5

## Recommended Posting Schedule

- LinkedIn: Monday/Wednesday mornings
- Twitter: Throughout the week (1 thread/day)
- Instagram: 3x per week
- Email: Weekend newsletter`
        }];
    }
}

// Initialize API
const contentplyAPI = new ContentplyAPI();
