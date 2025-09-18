# Vercel Deployment Guide

## Backend Deployment Issues Fixed

### 1. Cookie Configuration
- Removed hardcoded domain restrictions
- Fixed `sameSite: "None"` and `secure: true` for cross-origin cookies
- Added proper `maxAge` for cookie expiration

### 2. CORS Configuration
- Added Vercel app domains to allowed origins
- Added `Cookie` to allowed headers
- Updated for cross-origin requests

### 3. Serverless Optimization
- Added conditional server startup for Vercel
- Optimized for serverless functions

## Frontend Deployment Issues Fixed

### 1. API URL Configuration
- Created centralized API configuration
- Added environment variable support
- Fallback URLs for different environments

### 2. Cookie Handling
- Fixed `withCredentials: true` for axios requests
- Proper cookie parsing in layout component

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
COOKIE_SECRET=your_jwt_secret_key
MAILER_MAIL=your_gmail_address
MAILER_SECRET=your_gmail_app_password
NODE_ENV=production
```

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend-vercel-url.vercel.app
```

## Deployment Steps

### Backend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `backend`
3. Add environment variables in Vercel dashboard
4. Deploy

### Frontend (Vercel)
1. Create a new Vercel project
2. Set the root directory to `frontend`
3. Add environment variables
4. Deploy

## Important Notes

1. **Cookie Domain**: Removed domain restrictions to work across different Vercel subdomains
2. **CORS**: Updated to allow Vercel domains
3. **API URLs**: Use environment variables for flexibility
4. **HTTPS**: All cookies are secure for production
5. **SameSite**: Set to "None" for cross-origin cookie sharing

## Testing

After deployment:
1. Test login/logout functionality
2. Verify cookies are set and accessible
3. Check CORS headers in browser dev tools
4. Test API calls from frontend to backend
