# Contentply - Quick Start Guide

Get up and running in 15 minutes!

## What You Just Built

**Contentply** - An AI-powered content repurposer that turns 1 blog post into 10+ platform-specific social posts in 60 seconds.

### ✅ Completed

- Professional landing page with Tailwind CSS
- Main app interface with platform tabs
- Dashboard with usage tracking
- n8n workflow for Claude API integration
- PostgreSQL database schema
- Complete documentation
- Git repository initialized and pushed

## 🚀 Next Steps

### 1. Deploy to Railway (Backend) - 5 minutes

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy n8n"
4. Add PostgreSQL database (click "+ New" → "Database" → "PostgreSQL")
5. Configure environment variables (see [RAILWAY_SETUP.md](RAILWAY_SETUP.md))
6. Railway gives you a **FREE URL**: `https://your-app.up.railway.app` 🎉
7. Import workflow from `n8n-workflows/main-repurpose-workflow.json`
8. Add your Claude API key to n8n credentials
9. Copy webhook URL (you'll need this for Vercel)

**FREE Railway URL - no custom domain needed!**

**Detailed guide:** [RAILWAY_SETUP.md](RAILWAY_SETUP.md)

### 2. Deploy to Vercel (Frontend from GitHub) - 3 minutes

**Option 1: Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `contentply` GitHub repository
5. Click "Deploy" (use all defaults)
6. Vercel gives you a **FREE URL**: `https://your-app.vercel.app` 🎉
7. Every git push auto-deploys!

**Option 2: CLI**

```bash
npm i -g vercel
vercel          # First deployment
vercel --prod   # Production deployment
```

**FREE Vercel URL - no custom domain needed!**

### 3. Configure & Test - 2 minutes

1. Open your Vercel URL
2. Click settings icon
3. Enter your n8n webhook URL
4. Test with a blog post!

## 📁 Project Structure

```
contentply/
├── index.html                  # Landing page
├── app.html                    # Main application
├── dashboard.html              # Usage dashboard
├── js/
│   ├── config.js              # App configuration
│   ├── auth.js                # Auth & usage tracking
│   ├── api.js                 # API calls to n8n
│   └── app.js                 # Main app logic
├── n8n-workflows/
│   └── main-repurpose-workflow.json
├── database/
│   ├── schema.sql             # PostgreSQL schema
│   └── seed.sql               # Sample data
├── README.md                  # Full documentation
├── DEPLOYMENT.md              # Complete deployment guide
└── RAILWAY_SETUP.md           # Railway-specific guide
```

## 🔑 Required Credentials

You'll need:

1. **Anthropic API Key**
   - Get it: [console.anthropic.com](https://console.anthropic.com)
   - Used for: Claude AI content generation
   - Cost: ~$0.05-0.10 per repurpose

2. **Railway Account**
   - Sign up: [railway.app](https://railway.app)
   - Cost: $5/month (includes n8n + PostgreSQL)

3. **Vercel Account**
   - Sign up: [vercel.com](https://vercel.com)
   - Cost: Free (for frontend)

## 💰 Cost Breakdown

- Railway (n8n + PostgreSQL): $5/month
- Claude API: ~$1-2/month (for 20 repurposes)
- Vercel: Free
- **Total: ~$7/month**

## 🎯 How It Works

1. **User** pastes blog post URL or text
2. **Frontend** sends to n8n webhook
3. **n8n** fetches content and sends to Claude API (5 parallel requests)
4. **Claude** generates platform-specific variations
5. **n8n** returns formatted JSON
6. **Frontend** displays results with copy buttons

## 🧪 Testing Locally

```bash
# Serve frontend locally
npx serve .

# Open browser to localhost:3000
```

**Note:** You'll need to configure the n8n webhook URL in settings, or the app will use mock data for testing.

## 📊 Features

### Content Generation
- ✅ LinkedIn posts (5 variations)
- ✅ Twitter threads (10 variations)
- ✅ Instagram captions (5 styles)
- ✅ Email newsletters
- ✅ Content summaries

### App Features
- ✅ One-click copy to clipboard
- ✅ Export all as text file
- ✅ Usage tracking (20 credits/month)
- ✅ Dashboard with analytics
- ✅ Beautiful, responsive UI

## 🐛 Troubleshooting

### Frontend shows "n8n not configured"
- The app is using mock data
- Configure webhook URL in settings
- Or update `js/config.js` with your Railway URL

### n8n workflow fails
- Check Claude API key in credentials
- Verify workflow is "Active"
- Check Railway logs for errors

### Database connection issues
- Verify schema was imported
- Check Railway PostgreSQL is running
- Review DATABASE_URL variable

## 📚 Documentation

- **README.md** - Complete overview
- **DEPLOYMENT.md** - Full deployment guide
- **RAILWAY_SETUP.md** - Railway-specific setup
- **QUICKSTART.md** - This file

## 🎨 Customization

### Change App Name
Edit these files:
- `index.html` - All instances of "Contentply"
- `app.html` - Header and title
- `js/config.js` - APP_NAME constant

### Modify Pricing
Edit `index.html`:
- Pricing section (~line 350)
- Update price and features

### Adjust Credit Limits
Edit `js/config.js`:
- Change `API_RATE_LIMIT` from 20 to your desired limit

### Custom Claude Prompts
Edit `n8n-workflows/main-repurpose-workflow.json`:
- Modify the "text" parameter in each Claude node
- Re-import to n8n

## 🚀 Launch Checklist

- [ ] Railway deployed with n8n + PostgreSQL
- [ ] Database schema imported
- [ ] n8n workflow imported and activated
- [ ] Claude API credentials configured
- [ ] Webhook URL copied
- [ ] Frontend deployed to Vercel
- [ ] Webhook URL configured in app
- [ ] End-to-end test successful
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

## 🎉 You're Ready!

Your Contentply app is now:
- ✅ Built
- ✅ Committed to git
- ✅ Pushed to GitHub
- ⏳ Ready to deploy to Railway
- ⏳ Ready to deploy to Vercel

**Time to deployment:** ~15 minutes
**Monthly cost:** ~$7
**Potential MRR:** $450 (30 users × $15/month)

## 💡 Next Features to Add

1. **Stripe Integration** - Accept payments
2. **User Auth** - OAuth login
3. **More Platforms** - YouTube, TikTok, Pinterest
4. **Scheduling** - Integrate with Buffer/Hootsuite
5. **Analytics** - Track performance
6. **API Access** - For power users
7. **Custom Templates** - Let users create templates

## 📞 Support

Need help?
- Check documentation files
- Review Railway logs
- Test with curl commands
- Open GitHub issue

---

**Ready to deploy?** Start with [RAILWAY_SETUP.md](RAILWAY_SETUP.md)!

Built with ❤️ using Claude Code
