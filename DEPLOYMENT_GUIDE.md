# 🚀 ShopNest Deployment Guide (Render)

This guide will walk you through the step-by-step process of deploying the ShopNest full-stack application on **Render**.

## 1. Prepare for Deployment

Before starting, ensure:
- Your code is pushed to a **GitHub repository**.
- You have a **MongoDB Atlas** account and cluster ready.
- You have **Cloudinary** credentials for image hosting.

---

## 2. Deploying the Backend on Render

1.  **Login to Render**: Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2.  **Create New Web Service**: Click **New +** and select **Web Service**.
3.  **Connect GitHub**: Search for and select your `ShopNest` repository.
4.  **Configure Service**:
    - **Name**: `shopnest-backend`
    - **Environment**: `Node`
    - **Root Directory**: `backend` (Crucial!)
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Instance Type**: `Free`
5.  **Add Environment Variables**: Click on **Advanced** or **Environment** tab:
    - `MONGODB_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long random string.
    - `CLOUDINARY_CLOUD_NAME`: From Cloudinary dashboard.
    - `CLOUDINARY_API_KEY`: From Cloudinary dashboard.
    - `CLOUDINARY_API_SECRET`: From Cloudinary dashboard.
    - `FRONTEND_URL`: Leave empty for now, we'll update it after deploying frontend.
    - `PORT`: `10000` (Render's default)
6.  **Click Create Web Service**.

---

## 3. Deploying the Frontend on Render

1.  **Create New Static Site**: Click **New +** and select **Static Site**.
2.  **Connect GitHub**: Select the same `ShopNest` repository.
3.  **Configure Site**:
    - **Name**: `shopnest-frontend`
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
4.  **Add Environment Variables**:
    - `VITE_API_URL`: Use the URL of your **Backend Web Service** (e.g., `https://shopnest-backend.onrender.com/api/v1`).
5.  **Click Create Static Site**.

---

## 4. Connecting Everything

### Update Backend CORS
Once your frontend is deployed, copy its URL (e.g., `https://shopnest-frontend.onrender.com`).
1. Go to your **Backend Service** on Render.
2. Go to **Environment**.
3. Update `FRONTEND_URL` with your frontend URL.
4. Render will automatically redeploy.

### Fix Common CORS Issues
If you see "CORS error" in the browser console:
- Ensure the `FRONTEND_URL` in backend exactly matches the frontend URL (no trailing slash).
- Ensure `VITE_API_URL` in frontend ends with `/api/v1`.

---

## 5. MongoDB Atlas Setup
1. In MongoDB Atlas, go to **Network Access**.
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (Required for Render's dynamic IPs).

---

## 6. Maintenance & Redeployment
- **Redeploying**: Simply push your changes to GitHub. Render will detect the change and redeploy automatically.
- **Troubleshooting**: Check the **Logs** tab in the Render dashboard for any build or runtime errors.

---

## 7. Using Free Render Services Properly
- **Backend Spin-down**: Render's free tier spins down the backend after 15 minutes of inactivity. The first request after a long time might take 30-50 seconds to respond.
- **Static Site**: The frontend (Static Site) is always online and fast.
