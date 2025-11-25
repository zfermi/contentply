# Deploy Everything to Railway - Complete Guide

Deploy your entire Contentply app to Railway in one project.

## ✅ What You'll Get

- **One Platform**: Everything on Railway
- **Three Services**: n8n + PostgreSQL + Frontend
- **Free URLs**: `https://your-n8n.up.railway.app` + `https://your-frontend.up.railway.app`
- **Auto-Deploy**: Push to GitHub → Railway auto-deploys
- **Cost**: $5-8/month total

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account (2 minutes)

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub
4. Verify your email

**ALTERNATIVE: Deploy from Scratch (No Template)**

If you can't find the right n8n template or want more control:
1. Click **"New Project"** → **"Empty Project"**
2. Then click **"+ New"** → **"Docker Image"**
3. Enter Docker image: `n8nio/n8n:latest`
4. Railway will deploy n8n from Docker

This works exactly the same as the template!

### Step 2: Deploy n8n (Backend) (3 minutes)

1. Click **"New Project"**
2. In the template gallery, search for **"n8n"**
3. Look for the **official n8n template** - it should say:
   - **"n8n"** (simple title)
   - By: **n8n.io** or **Railway**
   - Description: "Workflow automation tool"
4. Click on it, then click **"Deploy Now"**
5. Wait 2-3 minutes for deployment

**Which template to choose?**
- Use the **basic "n8n" template** (not n8n with specific integrations)
- If you see multiple, choose the one with the most stars/deploys
- Avoid templates like "n8n + Postgres" (we'll add Postgres separately)

You now have: **n8n running** ✅

### Step 3: Add PostgreSQL Database (1 minute)

1. In your project, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Wait ~30 seconds for provisioning

You now have: **n8n + PostgreSQL** ✅

### Step 4: Configure n8n Environment Variables (2 minutes)

1. Click on **n8n service**
2. Go to **"Variables"** tab
3. Add these variables:

```bash
N8N_ENCRYPTION_KEY=<generate-random-key>
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<choose-strong-password>
N8N_HOST=${{ RAILWAY_PUBLIC_DOMAIN }}
N8N_PROTOCOL=https
WEBHOOK_URL=https://${{ RAILWAY_PUBLIC_DOMAIN }}/
DATABASE_URL=${{ Postgres.DATABASE_URL }}
```

**Generate encryption key:**
```bash
# Run this on your computer
openssl rand -hex 32
```

4. Click **"Save"**
5. Railway will auto-restart n8n

### Step 5: Get n8n Free URL (1 minute)

1. Click on **n8n service**
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. Copy your URL: `https://contentply-n8n-xxx.up.railway.app`

**Save this URL** - you'll need it later!

### Step 6: Access n8n and Import Workflow (5 minutes)

1. Visit your n8n Railway URL
2. Login with credentials from Step 4
3. You'll see the n8n dashboard

**Add Claude API Credentials:**
1. Click your avatar → **"Settings"**
2. Go to **"Credentials"**
3. Click **"+ Add Credential"**
4. Search for **"Anthropic"**
5. Enter your **Claude API key** (get from [console.anthropic.com](https://console.anthropic.com))
6. Name it: **"Anthropic account"**
7. Click **"Save"**

**Import Workflow:**
1. Click **"+ Add Workflow"** (or three dots menu)
2. Select **"Import from File"**
3. Upload: `n8n-workflows/main-repurpose-workflow.json` from your computer
4. The workflow opens

**Configure Workflow Nodes:**
1. Click on each **"Claude"** node (there are 5)
2. Select **"Anthropic account"** credential
3. Verify prompts look correct
4. Click **"Save"** (top right)
5. Toggle switch to **"Active"**

**Get Webhook URL:**
1. Click the **"Webhook"** node
2. Click **"Copy URL"**
3. Your webhook URL: `https://contentply-n8n-xxx.up.railway.app/webhook/repurpose`

**Save this webhook URL!** You need it for the frontend.

### Step 7: Set Up Database Schema (3 minutes)

**Option A: Using Railway Dashboard (Easiest)**

1. Click **PostgreSQL** service
2. Go to **"Data"** tab
3. Click **"Query"** or **"Connect"**
4. Open your local file: `database/schema.sql`
5. Copy the entire contents
6. Paste into Railway query editor
7. Click **"Execute"** or **"Run"**

**Option B: Using Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway run psql $DATABASE_URL

# Copy/paste the schema.sql contents, or:
\i database/schema.sql
\q
```

You now have: **n8n + PostgreSQL + Schema** ✅

### Step 8: Deploy Frontend from GitHub (3 minutes)

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. If prompted, connect your GitHub account
4. Select repository: **`contentply`** (or your repo name)
5. Railway detects it's a static site
6. Click **"Deploy"**
7. Wait 1-2 minutes

### Step 9: Configure Frontend Service (2 minutes)

**Generate Frontend URL:**
1. Click on your **frontend service** (shows as your repo name)
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. Copy your frontend URL: `https://contentply-production-xxx.up.railway.app`

**Configure Start Command:**
1. Still in **Settings** tab
2. Scroll to **"Deploy"** section
3. **Start Command**: `npx serve . -p $PORT`
4. Click **"Save"**
5. Railway will redeploy

### Step 10: Connect Frontend to Backend (1 minute)

1. Visit your **frontend Railway URL**
2. Click the **settings icon** (gear ⚙️)
3. Enter your **n8n webhook URL** from Step 6
4. Click **"Save Settings"**

### Step 11: Test Everything! (2 minutes)

1. Go to your frontend URL
2. Click **"Get Started"** or **"Repurpose"**
3. Paste a blog post URL or text
4. Click **"Repurpose Content"**
5. Wait ~60 seconds
6. You should see results for all platforms!

---

## 🎉 YOU'RE LIVE!

Your app is now fully deployed and production-ready!

**Your Services:**
- ✅ n8n (Backend): `https://contentply-n8n-xxx.up.railway.app`
- ✅ PostgreSQL (Database): Running
- ✅ Frontend (App): `https://contentply-production-xxx.up.railway.app`

**Your URLs:**
- **User-facing app**: Your frontend Railway URL
- **Backend API**: Your n8n webhook URL (internal)

---

## 🔄 Auto-Deploy Workflow

From now on:

```bash
# Make changes to your code
git add .
git commit -m "Update app"
git push

# Railway automatically:
# 1. Detects the push
# 2. Rebuilds frontend
# 3. Deploys update
# 4. Live in ~60 seconds ✨
```

**n8n workflows** don't auto-deploy - you update them through the n8n interface.

---

## 💰 Cost Breakdown

**Railway Monthly Cost:**
- n8n service: ~$3-4/month
- PostgreSQL: ~$1-2/month
- Frontend: ~$1-2/month
- **Total: $5-8/month**

**Claude API:**
- ~$0.05-0.10 per repurpose
- 20 repurposes/user = ~$1-2/month

**Grand Total: ~$7-10/month**

---

## 📊 Railway Dashboard

Your project structure:

```
Contentply (Railway Project)
│
├── n8n
│   ├── Status: Running
│   ├── URL: https://contentply-n8n-xxx.up.railway.app
│   └── Memory: ~200-400MB
│
├── PostgreSQL
│   ├── Status: Running
│   ├── Storage: ~50-100MB
│   └── Auto-connected to n8n
│
└── contentply (Frontend)
    ├── Status: Running
    ├── URL: https://contentply-production-xxx.up.railway.app
    ├── Source: GitHub
    └── Auto-deploys on push
```

---

## 🔧 Monitoring & Logs

**View Logs:**
1. Click any service
2. Go to **"Deployments"** or **"Logs"** tab
3. See real-time logs

**Monitor Usage:**
1. Click service
2. Go to **"Metrics"** tab
3. View CPU, Memory, Network

**Set Up Alerts:**
1. Project settings
2. Add webhooks for notifications
3. Get alerted on failures

---

## 🐛 Troubleshooting

### Can't find the right n8n template?

Railway has multiple n8n templates. Here's what to look for:

**BEST OPTION - Use Docker Image Directly:**
1. Click **"New Project"** → **"Empty Project"**
2. Click **"+ New"** → **"Docker Image"**
3. Enter: `n8nio/n8n:latest`
4. Click "Deploy"

This is actually BETTER than using a template because:
- ✅ You get the latest n8n version
- ✅ Full control over configuration
- ✅ No pre-configured settings to worry about

**If using a template:**
- Choose the simplest "n8n" template
- Avoid templates with extra services bundled
- Look for official Railway or n8n.io templates

### Frontend not loading

**Check deployment:**
1. Go to frontend service
2. Check **"Deployments"** tab
3. Ensure latest deploy succeeded
4. Check logs for errors

**Fix:**
- Ensure `package.json` exists (it does!)
- Verify start command: `npx serve . -p $PORT`
- Redeploy service

### n8n workflow fails

**Check:**
1. n8n service logs
2. Workflow is "Active"
3. Claude API credentials configured
4. Webhook URL is correct

### Database connection issues

**Check:**
1. PostgreSQL is running
2. DATABASE_URL variable is set in n8n
3. Schema was imported successfully

### "n8n not configured" message

This is the **mock data** fallback.

**Fix:**
1. Open frontend settings
2. Enter your n8n webhook URL
3. Save

---

## 🚀 Next Steps

### Add Custom Domain (Optional)

**For Frontend:**
1. Buy domain (e.g., contentply.com)
2. In Railway frontend service → Settings → Custom Domains
3. Add your domain
4. Configure DNS as instructed
5. Railway handles SSL automatically

**For n8n (not recommended):**
- Keep using Railway URL (it's for webhooks only)

### Add Stripe Integration

Ready to accept payments? See `DEPLOYMENT.md` for Stripe setup.

### Monitor Performance

1. Set up Railway alerts
2. Monitor Claude API usage at [console.anthropic.com](https://console.anthropic.com)
3. Track user metrics in your dashboard

---

## ✅ Deployment Checklist

- [x] Railway account created
- [x] n8n deployed and configured
- [x] PostgreSQL added
- [x] Database schema imported
- [x] Claude API credentials added
- [x] n8n workflow imported and activated
- [x] Frontend deployed from GitHub
- [x] Frontend URL generated
- [x] Frontend connected to backend
- [x] End-to-end test successful
- [ ] Custom domain (optional)
- [ ] Monitoring/alerts set up
- [ ] Stripe integration (when ready)

---

## 📞 Support

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**n8n:**
- Docs: https://docs.n8n.io
- Forum: https://community.n8n.io

**Claude API:**
- Docs: https://docs.anthropic.com
- Console: https://console.anthropic.com

---

## 🎊 Congratulations!

You've successfully deployed a production-ready SaaS app!

**What you've built:**
- ✅ AI-powered content repurposer
- ✅ Full-stack application (frontend + backend + database)
- ✅ Auto-deploying from GitHub
- ✅ Professional URLs
- ✅ Scalable architecture

**Time to launch:** Share your app and start getting users! 🚀

**Your app URL:** `https://contentply-production-xxx.up.railway.app`

---

**Need help?** Check the logs in Railway or open an issue on GitHub.

**Ready to scale?** Upgrade Railway resources as you grow!
