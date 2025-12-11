# Hostinger Deployment Guide (Final)

This project has been optimized for Hostinger shared hosting.

## 📦 Your Deployment File
**File:** `learn_and_grow_release.zip`
(This file contains the website with the `_next` folder renamed to `assets` to prevent blocking issues).

## 🚀 How to Deploy

1.  **Log in** to Hostinger.
2.  **Go to File Manager** -> `public_html`.
3.  **Delete** all existing files in `public_html`.
4.  **Upload** `learn_and_grow_release.zip`.
5.  **Extract** the zip file directly into `public_html`.
6.  **Verify:**
    *   You should see an `assets` folder.
    *   You should see an `.htaccess` file.
    *   You should see `index.html`.
7.  **Clear Cache:** Force refresh your browser (`Ctrl + F5`) to see the changes.

## 🛠️ How to Re-Build in the Future
If you make changes to the code and need to build a new zip:
1.  Run `npm run build`.
2.  Run `node hostinger-build-fix.js` (Renames `_next` to `assets`).
3.  Zip the contents of the `out` folder.
