# Deploy Frontend to Railway (All-in-One Setup)

Deploy both frontend and backend to Railway in one project.

## Why Deploy Frontend to Railway?

**Pros:**
- ✅ Everything in one place
- ✅ Single platform to manage
- ✅ One login, one dashboard
- ✅ No need for Vercel account
- ✅ Still get free Railway URL

**Cons:**
- 💵 Uses more compute hours (~$5-10/month total vs $5/month)
- Frontend serves from Railway instead of Vercel's free tier

## Step-by-Step Setup

### 1. Deploy n8n (Backend)

Follow steps 1-9 from [RAILWAY_SETUP.md](RAILWAY_SETUP.md) to deploy n8n + PostgreSQL.

### 2. Add Frontend Service from GitHub

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Connect your GitHub account (if not already)
4. Select your **`contentply`** repository
5. Railway will detect it's a static site
6. Click **"Deploy"**

### 3. Configure Frontend Service

1. Click on your frontend service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"** (FREE Railway URL)
5. Copy your frontend URL: `https://contentply-frontend.up.railway.app`

### 4. Configure Static File Serving

Railway needs to know how to serve your HTML files:

1. Click on frontend service
2. Go to **"Settings"** → **"Deploy"**
3. Add these settings:

**Start Command:**
```bash
npx serve . -p $PORT
```

**Install Command:**
```bash
npm install -g serve
```

Alternatively, Railway should auto-detect and serve static files.

### 5. Update Environment Variables (Optional)

If you want to hardcode the n8n webhook URL:

1. Click frontend service
2. Go to **"Variables"** tab
3. Add:
```
N8N_WEBHOOK_URL=https://your-n8n-service.up.railway.app/webhook/repurpose
```

Then update `js/config.js` to read from environment.

### 6. Test Your Deployment

1. Visit your frontend Railway URL
2. Click settings icon
3. Enter your n8n webhook URL (from your n8n service)
4. Test with a blog post!

## Auto-Deploy from GitHub

Once connected, Railway auto-deploys on every git push!

```bash
# Make a change
git add .
git commit -m "Update frontend"
git push

# Railway automatically:
# 1. Detects the push
# 2. Rebuilds your frontend
# 3. Deploys the update
# 4. Live in ~60 seconds
```

## Project Structure

Your Railway project will have:

```
Railway Project: Contentply
├── n8n (Service 1)
│   ├── URL: https://contentply-n8n.up.railway.app
│   └── Purpose: Backend API (workflows)
│
├── PostgreSQL (Service 2)
│   └── Purpose: Database
│
└── Frontend (Service 3)
    ├── URL: https://contentply-frontend.up.railway.app
    ├── Source: GitHub repo
    └── Purpose: User interface
```

## Cost Estimate

**Railway Only (All Services):**
- n8n: ~$3-4/month
- PostgreSQL: ~$1-2/month
- Frontend: ~$1-2/month
- **Total: $5-8/month**

**vs Hybrid (Railway + Vercel):**
- Railway (n8n + PostgreSQL): $5/month
- Vercel (Frontend): FREE
- **Total: $5/month**

**Difference:** ~$0-3/month more for Railway-only setup

## Troubleshooting

### Frontend not serving files

Add a `package.json` with serve script:

```json
{
  "scripts": {
    "start": "npx serve . -p $PORT"
  }
}
```

Already exists in your project!

### Can't access frontend

1. Check if domain is generated
2. Verify deployment succeeded (check logs)
3. Try redeploying the service

### Static files not loading

Railway might need explicit configuration. Create a `Procfile`:

```
web: npx serve . -p $PORT
```

Or use Railway's nixpacks build:

Create `railway.toml`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npx serve . -p $PORT"
```

## Benefits of Railway-Only Setup

1. **Simplicity**: One platform for everything
2. **Management**: Single dashboard
3. **Billing**: One invoice
4. **Logs**: All logs in one place
5. **Monitoring**: Unified monitoring
6. **No Vercel**: Don't need another account

## When to Use Vercel Instead

- You want to minimize costs (Vercel frontend is FREE)
- You prefer Vercel's frontend optimization
- You want fastest possible static file serving
- You're already using Vercel for other projects

## Conclusion

**Railway-Only is perfectly valid!**

- Small cost difference ($0-3/month more)
- Simpler setup (one platform)
- Still professional and production-ready
- Auto-deploys from GitHub

**Choose based on your preference:**
- **Cost-conscious?** → Use Vercel (free frontend)
- **Simplicity-focused?** → Use Railway (all-in-one)

Both are excellent choices! 🚀
