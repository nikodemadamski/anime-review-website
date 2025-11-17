# 🚀 Deployment Guide - GitHub + Vercel (Free)

## Overview
We'll deploy your anime review website for FREE using:
- **GitHub** - Store your code
- **Vercel** - Host your website (free tier, made by Next.js creators)

---

## Step 1: Prepare Your Project

### 1.1 Check if Git is initialized
```bash
cd anime-review-website
git status
```

If you see "not a git repository", initialize it:
```bash
git init
```

### 1.2 Create .gitignore (if not exists)
Make sure you have a `.gitignore` file with:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# kiro
.kiro/

# scripts output
scripts/character-images-report.json
```

---

## Step 2: Push to GitHub

### 2.1 Create a GitHub Repository
1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `anime-review-website`
4. Keep it **Public** (required for free Vercel)
5. **DON'T** initialize with README (you already have code)
6. Click "Create repository"

### 2.2 Connect Your Local Project to GitHub
```bash
# Add all files
git add .

# Commit your code
git commit -m "Initial commit - Anime Review Website"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/anime-review-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username!

---

## Step 3: Deploy to Vercel (FREE Hosting)

### 3.1 Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project
1. Click "Add New..." → "Project"
2. Find your `anime-review-website` repository
3. Click "Import"

### 3.3 Configure Project
Vercel will auto-detect Next.js. Just verify:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)

### 3.4 Environment Variables (Optional)
If you have any API keys or secrets, add them here. For now, you can skip this.

### 3.5 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. 🎉 Your site is live!

---

## Step 4: Access Your Live Website

After deployment, Vercel gives you:
- **Production URL:** `https://anime-review-website.vercel.app`
- **Custom Domain:** You can add your own domain later (free)

---

## Step 5: Future Updates

Every time you want to update your website:

```bash
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Vercel automatically rebuilds and deploys! 🚀
```

---

## Quick Command Reference

### First Time Setup
```bash
cd anime-review-website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/anime-review-website.git
git push -u origin main
```

### Future Updates
```bash
git add .
git commit -m "Your update message"
git push
```

---

## Troubleshooting

### "Permission denied" when pushing to GitHub
You need to authenticate. Use GitHub CLI or Personal Access Token:
```bash
# Install GitHub CLI (if not installed)
brew install gh  # macOS

# Login
gh auth login
```

### Build fails on Vercel
Check the build logs in Vercel dashboard. Common issues:
- TypeScript errors → Fix locally first
- Missing dependencies → Run `npm install` locally
- Environment variables → Add them in Vercel settings

### Site is slow
- Vercel free tier is fast enough for most sites
- If you need more, upgrade to Pro ($20/month)

---

## Free Tier Limits (Vercel)

✅ **Included FREE:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100 GB bandwidth/month
- Serverless functions
- Custom domains

🎯 **Perfect for your anime review site!**

---

## Custom Domain (Optional)

Want `animereview.com` instead of `.vercel.app`?

1. Buy domain from Namecheap/GoDaddy (~$10/year)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update DNS records (Vercel shows you how)
5. Done! Free SSL included

---

## Summary

**Order of Operations:**
1. ✅ Initialize Git in your project
2. ✅ Create GitHub repository
3. ✅ Push code to GitHub
4. ✅ Sign up for Vercel
5. ✅ Import GitHub repo to Vercel
6. ✅ Deploy (automatic)
7. ✅ Get your live URL!

**Total Cost:** $0 💰

**Time:** ~10 minutes ⏱️

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **GitHub Guides:** https://guides.github.com

---

## 🎉 Ready to Deploy!

Your anime review website is ready for the world. Just follow the steps above and you'll be live in minutes!

**Pro Tip:** After deploying, share your Vercel URL with friends to get feedback before buying a custom domain!
