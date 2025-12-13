# 🚀 Dynamic Deployment Guide

You requested a **Dynamic** project where you can Create/Edit/Delete courses from the Admin Panel and have them appear instantly.
I have refactored the entire Course system to use your Database instead of static files.

## ⚠️ Important Change
Because the site is now **Dynamic**, you CANNOT use standard Static Hosting (like GitHub Pages or Hostinger's default static plan) efficiently.
You **MUST** deploy the Frontend to a **Node.js Server**.

## Recommended Hosting (Vercel)
The easiest way to host a Next.js Dynamic App is **Vercel**.

1.  **Push to GitHub:**
    - Create a repo and push all your code.
2.  **Import to Vercel:**
    - Go to Vercel.com -> Add New Project -> Import from GitHub.
3.  **Configure Environment Variables:**
    - Add `NEXT_PUBLIC_API_URL` = `Your Backend URL` (e.g., https://api.yourbackend.com/api/v1).
4.  **Deploy.**
    - Vercel handles the Node.js server automatically.

## Hostinger VPS (Alternative)
If you must use Hostinger, use a **VPS Plan** (not Shared Web Hosting).
1.  Install Node.js on VPS.
2.  Build Frontend: `npm run build`
3.  Start Frontend: `npm start` (Runs on port 3000).
4.  Use Nginx Proxy to point your domain to port 3000.

## Backend Deployment
Your backend (Node/Express/Mongo) is unchanged. Deploy it to any Node.js host (Render, Railway, Heroku, or VPS).

## Summary of Changes
- **Admin Panel:** Now fully functional (Create, Edit, Delete courses).
- **Public Site:** Courses load from the Database instantly.
- **Config:** Removed `output: 'export'` to enable these features.
