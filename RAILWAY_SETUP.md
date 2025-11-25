# Railway Setup Guide for Contentply

Quick reference for setting up Contentply on Railway.

## What You'll Deploy

- **n8n**: Workflow automation (backend)
- **PostgreSQL**: Database for user data and usage tracking

## 🎯 Best Deployment Strategy

**RECOMMENDED APPROACH:**
1. **Deploy n8n to Railway** (using template) ← Backend
2. **Deploy frontend to Vercel** (from GitHub) ← Frontend

This gives you:
- ✅ Railway handles n8n + PostgreSQL (backend)
- ✅ **FREE Railway URL**: `https://your-app.up.railway.app` (no custom domain needed!)
- ✅ Vercel handles static frontend (free tier)
- ✅ **FREE Vercel URL**: `https://your-app.vercel.app` (or use custom domain)
- ✅ Auto-deploys from GitHub to Vercel
- ✅ Best performance and lowest cost
- ✅ **Total cost: $5/month** (Railway n8n + PostgreSQL)

## Deployment Options

### ⭐ OPTION A: Hybrid (RECOMMENDED)

**Railway:** Deploy n8n template (backend only)
**Vercel:** Deploy from GitHub (frontend only)

**Why this is best:**
- Railway is optimized for n8n
- Vercel is free for static sites
- Each service does what it's best at
- Lowest total cost

### OPTION B: All in Railway

Deploy everything to Railway (frontend + n8n + PostgreSQL).

**When to use:**
- You want everything in one place
- Don't want to use Vercel

**Note:** Frontend on Railway uses compute hours (costs more than Vercel free tier)

---

## Step-by-Step Setup (Recommended Path)

### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your email

### 2. Deploy n8n to Railway

1. Click "New Project"
2. Select "Deploy n8n" template
3. Click "Deploy Now"
4. Wait 2-3 minutes for deployment

**Note:** Your frontend will be deployed to Vercel (see step 10).

### 3. Add PostgreSQL

1. In your project, click "+ New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Wait for provisioning

### 4. Configure n8n Environment Variables

Click on n8n service → Variables tab → Add these:

```bash
# Required
N8N_ENCRYPTION_KEY=CHANGE_THIS_TO_RANDOM_STRING
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CHANGE_THIS_PASSWORD

# Auto-configured by Railway
N8N_HOST=${{ RAILWAY_PUBLIC_DOMAIN }}
N8N_PROTOCOL=https
WEBHOOK_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}/

# Database (automatically connected)
DATABASE_URL=${{ Postgres.DATABASE_URL }}
```

**Important:** Generate a strong encryption key:
```bash
openssl rand -hex 32
```

### 5. Get Your Free Railway URL

Railway automatically generates a free public URL for you!

1. Click on n8n service
2. Go to "Settings" tab
3. Scroll to "Networking" section
4. You'll see your free URL: `https://xxx.up.railway.app`
5. If not visible, click "Generate Domain" (it's FREE)

**Note:** This free Railway URL works permanently. Custom domains are optional and only needed if you want a branded URL.

### 6. Access n8n

1. Visit your Railway URL
2. Login with credentials from step 4
3. You should see n8n interface

### 7. Set Up Database Schema

**Option A: Using Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway run psql $DATABASE_URL

# Run schema
\i database/schema.sql
\q
```

**Option B: Using Railway Dashboard**

1. Click PostgreSQL service
2. Go to "Data" tab
3. Click "Query"
4. Copy contents of `database/schema.sql`
5. Paste and execute

### 8. Configure n8n Credentials

1. In n8n, click your avatar → "Settings"
2. Go to "Credentials"
3. Click "Add Credential"
4. Search "Anthropic"
5. Add your Claude API key
6. Name it "Anthropic account"
7. Save

### 9. Import Workflow

1. In n8n, click "+" → "Import from File"
2. Upload `n8n-workflows/main-repurpose-workflow.json`
3. Click each Claude node
4. Select "Anthropic account" credential
5. Save workflow (top right)
6. Activate (toggle switch to ON)

### 10. Get Webhook URL

1. Click the "Webhook" node in your workflow
2. Click "Copy URL"
3. Save this URL - format: `https://xxx.up.railway.app/webhook/repurpose`

### 11. Test the Workflow

Use curl or Postman:

```bash
curl -X POST https://your-url.up.railway.app/webhook/repurpose \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test blog post about AI and content creation.",
    "isUrl": false,
    "apiKey": "test_key"
  }'
```

You should get a JSON response with repurposed content.

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `N8N_ENCRYPTION_KEY` | Random string | Encrypts credentials |
| `N8N_BASIC_AUTH_USER` | admin | n8n login username |
| `N8N_BASIC_AUTH_PASSWORD` | Your password | n8n login password |
| `N8N_HOST` | Auto-set by Railway | Public domain |
| `N8N_PROTOCOL` | https | Protocol |
| `WEBHOOK_URL` | Auto-set | Base webhook URL |
| `DATABASE_URL` | Auto-set | PostgreSQL connection |

## Monitoring

### Check Logs

1. Click n8n service
2. Go to "Logs" tab
3. View real-time execution logs

### Monitor Usage

1. Go to "Metrics" tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

### Set Up Alerts

1. Go to project settings
2. Add notification webhooks
3. Configure alert thresholds

## Scaling

### When to Upgrade

- More than 100 executions/day
- Response times > 5 seconds
- Running out of memory

### How to Upgrade

1. Click n8n service
2. Go to "Settings"
3. Change plan under "Resources"
4. Recommended: 2GB RAM, 2vCPU

## Backup Strategy

### Database Backups

Railway automatically backs up PostgreSQL daily.

**Manual backup:**
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

### Workflow Backup

1. In n8n, go to workflow
2. Click three dots → "Download"
3. Save JSON file

**Automated:** Export all workflows weekly via n8n API.

## Troubleshooting

### n8n Won't Start

- Check environment variables are set
- Verify encryption key is set
- Check logs for errors
- Restart service

### Can't Connect to Database

- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Review connection logs
- Check network settings

### Webhook Not Working

- Verify workflow is Active
- Check webhook URL is correct
- Test with curl command
- Review n8n execution logs

### Claude API Errors

- Verify API key in credentials
- Check Anthropic account has credits
- Review rate limits
- Test API key separately

## Cost Estimation

### Railway Costs

**Hobby Plan** ($5/month):
- 500 hours of runtime
- 512MB RAM
- Shared CPU
- Good for: Testing, <50 users

**Pro Plan** ($20/month):
- Unlimited hours
- 8GB RAM
- 8 vCPU
- Good for: Production, 50-500 users

### Calculate Your Costs

```
Base: $5/month (Railway Starter)
Per execution: ~$0.001 (compute)
Per repurpose: ~$0.05-0.10 (Claude API)

Example: 100 repurposes/month
= $5 (Railway) + $10 (Claude) = $15/month
```

## Security Best Practices

1. **Change Default Password**: Use strong, unique password
2. **Encryption Key**: Use `openssl rand -hex 32`
3. **API Keys**: Never commit to git
4. **Rate Limiting**: Add to n8n workflow
5. **Monitoring**: Set up alerts for unusual activity

## Next Steps

- [ ] Test workflow end-to-end
- [ ] Configure frontend with webhook URL
- [ ] Set up monitoring/alerts
- [ ] Plan backup strategy
- [ ] Review security settings
- [ ] Test with real content

## Quick Commands

```bash
# View logs
railway logs -s n8n

# Connect to database
railway connect postgres

# Restart service
railway restart -s n8n

# Check status
railway status
```

## Deploy Frontend to Vercel (from GitHub)

Now that your Railway backend is ready, deploy your frontend:

### Option 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `contentply` repository
5. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Click "Deploy"
7. Wait 1-2 minutes

**Your app is now live!** Every git push will auto-deploy.

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### Configure Frontend

1. Open your Vercel URL
2. Click the settings icon (gear)
3. Enter your Railway n8n webhook URL
4. Save and test!

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- n8n Docs: https://docs.n8n.io
- n8n Forum: https://community.n8n.io
- Vercel Docs: https://vercel.com/docs

---

## 🎉 You're Done!

**Railway:** ✅ n8n + PostgreSQL running
**Vercel:** ✅ Frontend deployed from GitHub
**Auto-deploys:** ✅ Git push → Vercel auto-updates

Your Contentply app is now fully deployed and ready to use!
