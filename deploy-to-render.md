# Quick Deploy to Render

## 🚀 One-Click Deployment Steps

### 1. Backend Deployment
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Name**: `farm-tech-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   COOKIE_SECRET=your_jwt_secret
   MAILER_MAIL=your_email@gmail.com
   MAILER_SECRET=your_gmail_app_password
   FRONTEND_URL=https://farm-tech-frontend.onrender.com
   ```
6. Click "Create Web Service"

### 2. Frontend Deployment
1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Settings:
   - **Name**: `farm-tech-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://farm-tech-backend.onrender.com
   ```
5. Click "Create Static Site"

### 3. Test Your App
- Frontend: `https://farm-tech-frontend.onrender.com`
- Backend: `https://farm-tech-backend.onrender.com`

## 🔧 If URLs are Different
Update these files with your actual URLs:
- `backend/app.js` (CORS origins)
- `frontend/src/config/api.js` (API base URL)

## ✅ Done!
Your full-stack app is now live on Render!
