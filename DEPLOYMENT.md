# Contentply Deployment Guide

Complete step-by-step guide to deploy Contentply to production.

## Prerequisites

- GitHub account
- Railway account (railway.app)
- Vercel account (vercel.com)
- Anthropic API key (console.anthropic.com)
- Domain name (optional)

## Part 1: Railway Setup (Backend)

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy n8n"
4. Wait for deployment to complete

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Wait for database to provision
4. Railway will automatically connect it to n8n

### Step 3: Configure Environment Variables

1. Click on your n8n service
2. Go to "Variables" tab
3. Add these variables:

```env
N8N_ENCRYPTION_KEY=generate_random_string_here
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=create_strong_password
N8N_HOST=your-app-name.up.railway.app
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-app-name.up.railway.app/
```

4. Save and redeploy

### Step 4: Get Railway URLs

1. Click on your n8n service
2. Go to "Settings" tab
3. Note your public URL: `https://your-app-name.up.railway.app`
4. This is your n8n instance URL

### Step 5: Set Up Database

1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection URL
4. Use a PostgreSQL client or Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Connect to database
railway connect postgres

# Run schema
\i database/schema.sql
```

Or use the Railway web interface:
1. Go to PostgreSQL service → "Data" tab
2. Open query editor
3. Copy/paste contents of `database/schema.sql`
4. Execute

## Part 2: n8n Configuration

### Step 1: Access n8n

1. Go to `https://your-app-name.up.railway.app`
2. Login with credentials you set in environment variables
3. You should see the n8n dashboard

### Step 2: Add Anthropic Credentials

1. Click your profile icon → "Settings"
2. Go to "Credentials"
3. Click "+ Add Credential"
4. Search for "Anthropic"
5. Enter your Anthropic API key
6. Save as "Anthropic account"

### Step 3: Import Workflow

1. Click "Workflows" in sidebar
2. Click "+ Add Workflow"
3. Click the three dots menu → "Import from File"
4. Upload `n8n-workflows/main-repurpose-workflow.json`
5. The workflow will open

### Step 4: Configure Workflow Nodes

1. Click on each "Claude" node
2. Select your "Anthropic account" credential
3. Verify the prompts look correct
4. Click "Save" (top right)

### Step 5: Activate Workflow

1. Click the toggle switch at top to "Active"
2. Click "Execute Workflow" to test
3. Provide sample input to test

### Step 6: Get Webhook URL

1. Click on the "Webhook" node
2. Click "Copy URL" for the production webhook
3. Save this URL - you'll need it for the frontend
4. It should look like: `https://your-app-name.up.railway.app/webhook/repurpose`

## Part 3: Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Contentply setup"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/contentply.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# When asked for settings, use defaults

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

## Part 4: Final Configuration

### Step 1: Update Frontend Config

Your app is now live! Users will configure their settings through the UI:

1. Go to your deployed frontend URL
2. Click the settings icon (gear)
3. Enter your n8n webhook URL
4. Save

Alternatively, you can hardcode the webhook URL in `js/config.js`:

```javascript
N8N_WEBHOOK_URL: 'https://your-app-name.up.railway.app/webhook/repurpose',
```

### Step 2: Test End-to-End

1. Go to your live app
2. Click "Get Started" or "Repurpose"
3. Paste a URL or text
4. Click "Repurpose Content"
5. Wait ~60 seconds
6. Verify you get results for all platforms

### Step 3: Monitor

**Railway:**
- Check n8n logs for errors
- Monitor database connections
- Check execution counts

**Vercel:**
- Monitor function logs
- Check analytics
- Review performance metrics

## Part 5: Cost Optimization

### Railway Costs

- n8n: ~$5/month (Starter plan)
- PostgreSQL: Included in Starter
- Bandwidth: Usually within free tier

**To optimize:**
- Use Railway's Hobby plan if you have low traffic
- Monitor execution times
- Set up usage alerts

### Anthropic API Costs

- Claude 3.5 Sonnet: ~$3 per million tokens
- Estimated cost per repurpose: $0.05-0.10
- 20 repurposings/user/month = $1-2 per user

**To optimize:**
- Use Claude Haiku for simpler tasks
- Cache common responses
- Implement rate limiting

### Vercel Costs

- Free tier: 100GB bandwidth/month
- Usually sufficient for static frontend
- Upgrade to Pro ($20/month) if needed

## Troubleshooting

### n8n Workflow Not Executing

1. Check if workflow is "Active"
2. Verify Anthropic credentials are configured
3. Check n8n logs in Railway
4. Test webhook URL manually with curl:

```bash
curl -X POST https://your-app-name.up.railway.app/webhook/repurpose \
  -H "Content-Type: application/json" \
  -d '{"content": "test content", "isUrl": false, "apiKey": "test"}'
```

### Frontend Not Connecting to n8n

1. Verify webhook URL in settings
2. Check browser console for CORS errors
3. Verify n8n is running in Railway
4. Check n8n webhook node configuration

### Database Connection Issues

1. Verify DATABASE_URL is set correctly
2. Check PostgreSQL is running in Railway
3. Review connection limits
4. Check for SSL requirements

### Claude API Errors

1. Verify API key is valid
2. Check API quota/billing
3. Review rate limits
4. Check model name spelling

## Security Checklist

- [ ] Change default n8n credentials
- [ ] Use strong encryption key
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set up environment variables (never commit secrets)
- [ ] Configure CORS if needed
- [ ] Implement API key validation
- [ ] Add rate limiting
- [ ] Monitor for abuse

## Production Checklist

- [ ] Railway n8n deployed and accessible
- [ ] PostgreSQL configured and schema loaded
- [ ] Anthropic credentials added to n8n
- [ ] Workflow imported and activated
- [ ] Webhook URL tested
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] End-to-end test completed
- [ ] Monitoring set up
- [ ] Backup strategy in place

## Next Steps

1. **Add Stripe Integration**: For accepting payments
2. **Set Up Analytics**: Track usage and conversions
3. **Configure Email**: For notifications and marketing
4. **Add Monitoring**: Use Railway/Vercel built-in tools
5. **Scale**: Upgrade plans as you grow

## Support Resources

- Railway Docs: https://docs.railway.app
- n8n Docs: https://docs.n8n.io
- Vercel Docs: https://vercel.com/docs
- Anthropic API: https://docs.anthropic.com

---

**Need Help?** Create an issue on GitHub or contact support.
