# Contentply

> Turn 1 blog post into 10+ platform-specific social posts in 60 seconds

AI-powered content repurposer for newsletter writers, coaches, and indie hackers.

## Features

- **LinkedIn Posts**: 5 variations (story, tips, insights, questions, announcements)
- **Twitter Threads**: 10 different hooks with complete threads (8-12 tweets each)
- **Instagram Captions**: 5 styles with hooks and hashtags
- **Email Newsletters**: Formatted for subscribers with sections and CTAs
- **Summaries**: Key takeaways and recommendations

## Tech Stack

- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: n8n workflows on Railway
- **Database**: PostgreSQL (Railway)
- **AI**: Claude API (Anthropic)
- **Hosting**: Vercel (frontend), Railway (backend)

## Quick Start

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Set Up Railway Backend

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy n8n template
4. Add PostgreSQL database
5. Set environment variables (see below)

### 3. Configure n8n

1. Access your n8n instance at `your-app.railway.app`
2. Import workflow from `n8n-workflows/main-repurpose-workflow.json`
3. Add Anthropic API credentials
4. Activate workflow
5. Copy webhook URL

### 4. Set Up Database

```bash
# Connect to your Railway PostgreSQL
psql $DATABASE_URL

# Run schema
\i database/schema.sql

# Optional: Add seed data
\i database/seed.sql
```

### 5. Configure Frontend

1. Open the app in your browser
2. Click settings icon
3. Enter your n8n webhook URL
4. Save settings

## Environment Variables

### n8n (Railway)

```env
N8N_ENCRYPTION_KEY=your_encryption_key
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password
ANTHROPIC_API_KEY=your_claude_api_key
DATABASE_URL=postgresql://... (auto-configured by Railway)
```

### Frontend (Local Storage)

These are configured through the app's settings UI:
- n8n Webhook URL
- Claude API Key (optional, for testing)

## Project Structure

```
contentply/
├── index.html              # Landing page
├── app.html                # Main application
├── dashboard.html          # User dashboard
├── js/
│   ├── config.js          # Configuration
│   ├── auth.js            # Authentication & usage tracking
│   ├── api.js             # API calls to n8n
│   └── app.js             # Main app logic
├── n8n-workflows/
│   └── main-repurpose-workflow.json
├── database/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Seed data
├── package.json
├── vercel.json            # Vercel config
└── README.md
```

## Usage

1. **Paste Content**: Enter a URL or paste your blog post
2. **Repurpose**: Click "Repurpose Content" and wait ~60 seconds
3. **Copy & Use**: Browse variations by platform and copy with one click
4. **Export**: Download all variations as a text file

## n8n Workflow

The main workflow:
1. Receives webhook POST request
2. Checks API key validity
3. Fetches content (if URL provided)
4. Sends to Claude API for repurposing (5 parallel requests)
5. Returns formatted JSON response

## Database Schema

- **users**: User accounts and API keys
- **usage**: Monthly usage tracking
- **content_history**: History of repurposed content
- **repurposed_content**: Generated content storage (optional)

## Development

```bash
# Serve locally
npx serve .

# Or use any static server
python -m http.server 8000
```

## Deployment Checklist

- [ ] Deploy frontend to Vercel
- [ ] Deploy n8n to Railway
- [ ] Add PostgreSQL to Railway
- [ ] Configure environment variables
- [ ] Import n8n workflow
- [ ] Add Anthropic API key to n8n
- [ ] Run database schema
- [ ] Test repurpose functionality
- [ ] Configure custom domain (optional)

## Pricing

- **Pro Plan**: $15/month
  - 20 repurposing credits/month
  - All platforms included
  - Export to PDF
  - Priority support

## Future Enhancements

- [ ] Stripe integration for payments
- [ ] User authentication (OAuth)
- [ ] More platforms (YouTube, TikTok, Pinterest)
- [ ] Custom templates
- [ ] Scheduling integration
- [ ] Analytics dashboard
- [ ] API access

## Support

For issues or questions:
- Create an issue on GitHub
- Email: support@contentply.com

## License

MIT License - feel free to use for your own projects!

---

Built with Claude AI
