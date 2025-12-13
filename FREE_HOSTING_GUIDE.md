# 🚀 Free Dynamic Hosting Guide (Vercel & Render)

Since your current Hostinger plan likely doesn't support Node.js, the **Best and Free** way to host your **Dynamic App** is:

1.  **Frontend (Next.js)** -> **Vercel** (Free, perfectly optimized for Next.js).
2.  **Backend (Express API)** -> **Render** (Free, supports Node.js).
3.  **Database** -> **MongoDB Atlas** (Free).

---

## 1. Deploy Frontend to Vercel
**Why?** Vercel is the creators of Next.js. It's free and handles "Dynamic" deployments automatically.

1.  **Push your code to GitHub.**
2.  Go to **[Vercel.com](https://vercel.com)** and Sign Up.
3.  Click **"Add New..."** -> **"Project"**.
4.  **Import** your GitHub Repository.
5.  **Configure Project:**
    -   **Root Directory:** Select `Learn-Grow` (since your app is in a subfolder).
    -   **Framework Preset:** Next.js (Auto-detected).
    -   **Environment Variables:**
        -   `NEXT_PUBLIC_API_URL`: `https://your-backend-on-render.com/api/v1` (You will update this later).
6.  Click **Deploy**.

---

## 2. Deploy Backend to Render
**Why?** Render has a great "Web Service" free tier that runs Node.js apps easily.

1.  Go to **[Render.com](https://render.com)** and Sign Up.
2.  Click **"New"** -> **"Web Service"**.
3.  Connect your **GitHub Repository**.
4.  **Configure Service:**
    -   **Root Directory:** `backend`
    -   **Build Command:** `npm install && npm run build`
    -   **Start Command:** `npm start`
    -   **Instance Type:** Free
5.  **Environment Variables** (Add these from your `.env`):
    -   `PORT`: `10000` (Render expects this or similar)
    -   `DATABASE_URL`: Your MongoDB Connection String.
    -   `JWT_SECRET`: Any random string.
6.  Click **Deploy Web Service**.
7.  **Copy your Backend URL** (e.g., `https://learn-grow-api.onrender.com`).

---

## 3. Connect Them
1.  Go back to **Vercel Project Settings** -> **Environment Variables**.
2.  Update/Add `NEXT_PUBLIC_API_URL` with your **Render Backend URL**.
    -   Example: `https://learn-grow-api.onrender.com/api/v1`
3.  **Redeploy** Vercel (Go to Deployments -> Redeploy).

---

## ❓ FAQ: Render vs Vercel
| Feature | Vercel (Frontend) | Render (Backend) |
| :--- | :--- | :--- |
| **Best For** | Next.js, Static Sites, Frontend | Node.js APIs, Databases, Docker |
| **Cost** | Free (Hobby) | Free (for initial usage) |
| **Speed** | ⚡ Extremely Fast (Edge Network) | 🐢 Free tier "sleeps" after 15m (slow 1st load) |
| **Ease of Use** | 1-Click for Next.js | Easy for Node.js |

**Recommendation:** Use **Vercel for Frontend** and **Render for Backend**. This gives you a professional, robust, and free dynamic application.
