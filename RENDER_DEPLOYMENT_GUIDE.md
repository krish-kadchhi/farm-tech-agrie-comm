# Render Deployment Guide

## 🚀 Deploy to Render (Both Backend & Frontend)

### Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for database)
- Gmail account (for email functionality)

## Step 1: Deploy Backend to Render

### 1.1 Create Backend Service
1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `farm-tech-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 1.2 Add Environment Variables
In Render Dashboard → Environment Variables, add:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
COOKIE_SECRET=your_jwt_secret_key
MAILER_MAIL=your_gmail_address
MAILER_SECRET=your_gmail_app_password
FRONTEND_URL=https://farm-tech-frontend.onrender.com
```

### 1.3 Deploy Backend
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL: `https://farm-tech-backend.onrender.com`

## Step 2: Deploy Frontend to Render

### 2.1 Create Frontend Service
1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the service:
   - **Name**: `farm-tech-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

### 2.2 Add Environment Variables
In Render Dashboard → Environment Variables, add:
```
VITE_API_URL=https://farm-tech-backend.onrender.com
```

### 2.3 Deploy Frontend
- Click "Create Static Site"
- Wait for deployment to complete
- Note your frontend URL: `https://farm-tech-frontend.onrender.com`

## Step 3: Update URLs (if needed)

### 3.1 Update Backend CORS
If your frontend URL is different, update `backend/app.js`:
```javascript
origin: [
  "http://localhost:5173",
  "https://farm-tech-frontend.onrender.com", // Your actual frontend URL
  // ... other origins
]
```

### 3.2 Update Frontend API URL
If your backend URL is different, update `frontend/src/config/api.js`:
```javascript
: 'https://farm-tech-backend.onrender.com'  // Your actual backend URL
```

## Step 4: Test Your Deployment

### 4.1 Test Backend
Visit: `https://farm-tech-backend.onrender.com/`
- Should return a basic response

### 4.2 Test Frontend
Visit: `https://farm-tech-frontend.onrender.com/`
- Should load your React app
- Check browser console for "API Base URL" log

### 4.3 Test Full Flow
1. Try to sign up/login
2. Check if cookies are being set
3. Verify API calls are going to backend

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Check if frontend URL is in backend CORS origins
- Verify both services are deployed and running

#### 2. Cookie Issues
- Ensure `withCredentials: true` in axios requests
- Check if cookies are being set in browser dev tools

#### 3. Environment Variables
- Make sure all required env vars are set in Render
- Restart services after adding new environment variables

#### 4. Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json

### Debug Steps
1. Check Render service logs
2. Open browser dev tools → Network tab
3. Look for failed API calls
4. Check console for errors

## 📋 Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
COOKIE_SECRET=your-super-secret-jwt-key
MAILER_MAIL=your-email@gmail.com
MAILER_SECRET=your-gmail-app-password
FRONTEND_URL=https://farm-tech-frontend.onrender.com
```

### Frontend (.env)
```
VITE_API_URL=https://farm-tech-backend.onrender.com
```

## 🎉 Success!
Once deployed, your full-stack application will be live at:
- **Frontend**: `https://farm-tech-frontend.onrender.com`
- **Backend**: `https://farm-tech-backend.onrender.com`

Both services will automatically redeploy when you push changes to your GitHub repository!
