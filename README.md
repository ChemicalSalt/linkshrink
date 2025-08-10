# LinkShrink - URL Shortener

This is a full-stack URL shortening app with React frontend and Node.js/Express backend deployed on Render. It supports shortening URLs and has an optional admin panel to view all shortened URLs. Environment variables configure API URLs and MongoDB connection.

##Live Link
[LinkShrink](https://linkshrink-1z4u.onrender.com/)

## Setup & Deployment:

1. Clone repo: git clone https://github.com/ChemicalSalt/linkshrink.git && cd linkshrink  
2. Create a single root .env file with:  
   VITE_API_URL=https://your-backend-url.onrender.com  
   MONGO_URI=your_mongodb_connection_string  
3. Backend: cd backend && npm install && npm run dev (locally)  
   Deploy backend on Render connected to GitHub; add env vars in Render dashboard.  
4. Frontend: cd frontend && npm install && npm run dev (locally)  
   Deploy frontend on Render connected to GitHub; set VITE_API_URL env var in Render.  
5. Use deployed frontend URL to access the app. API calls use backend URL from env variable.

## Notes:  
- Whitelist Render IPs in MongoDB Atlas and your local IP.  
- Update env vars locally and on Render for both backend and frontend.  
- Frontend fetch calls use `import.meta.env.VITE_API_URL` to target backend.  
- Rebuild & redeploy frontend after env changes.


