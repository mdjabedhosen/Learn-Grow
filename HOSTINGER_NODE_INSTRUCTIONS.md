# Hostinger Node.js Deployment Guide (Dynamic)

This guide explains how to deploy your **Dynamic Next.js App** to Hostinger using the **Node.js App** feature (Shared Hosting) or **VPS**.

## Prerequisites
- You have the `learn_and_grow_hostinger_dynamic.zip` file.
- You have a Hostinger plan that supports **Node.js** (Cloud Hosting or VPS recommended).

---

## Method 1: Hostinger VPS (Recommended)
1.  **Login** to your VPS.
2.  **Upload** `learn_and_grow_hostinger_dynamic.zip` to your desired folder (e.g., `/var/www/learn-grow`).
3.  **Unzip** the file:
    ```bash
    unzip learn_and_grow_hostinger_dynamic.zip
    ```
4.  **Enter the directory**:
    The zip contains the standalone build. You don't need to run `npm install` for the whole project, but you might need to install dependencies if any are missing from the bundle (rare with standalone).
    However, usually you just run:
    ```bash
    node server.js
    ```
5.  **Setup PM2 (Process Manager)** to keep it running:
    ```bash
    npm install -g pm2
    pm2 start server.js --name "learn-grow"
    pm2 save
    pm2 startup
    ```
6.  **Configure Nginx** to reverse proxy port 3000 to your domain.

---

## Method 2: Hostinger Shared / Cloud "Node.js App"
1.  Go to **hPanel** -> **Websites** -> **Manage**.
2.  Search for **Node.js** capability. (If not present, your plan doesn't support it).
3.  **Upload Files**:
    -   Go to **File Manager**.
    -   Navigate to `public_html`.
    -   Upload and extract `learn_and_grow_hostinger_dynamic.zip` contents directly here (or in a subfolder if you prefer).
    -   **Important:** Ensure `server.js`, `public`, `.next`, and `node_modules` are in the root of your Node app folder.
4.  **Create/Configure Node.js Application:**
    -   Go to **hPanel** -> **Websites** -> **Node.js**.
    -   **Application Root:** Directory where you uploaded your files (e.g., `public_html`).
    -   **Application Startup File:** Enter `server.js`.
    -   **Node.js Version:** Select v18 or later (Next.js 16 requires it).
    -   Click **Create** or **Save**.
5.  **Install Dependencies**:
    -   Click **npm install** button in hPanel (It might not be needed if `node_modules` are already fully bundled, but `standalone` usually relies on system node_modules being absent or present depending on config. Next.js standalone bundles necessary node_modules inside `.next/standalone/node_modules`. So you should be good).
6.  **Restart** the application.

## Troubleshooting
-   If `server.js` fails, check the **Logs** in hPanel.
-   Ensure the **Node.js Version** in hPanel matches or is compatible with **v18+** (Next.js 16 requires modern Node).
