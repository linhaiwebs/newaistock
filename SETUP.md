# Setup Guide - AI株式診断システム

## Quick Start Guide

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

### 2. Environment Variables

Update `.env` with the following:

```env
# Supabase (Already configured)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend Configuration
PORT=3001
JWT_SECRET=change-this-to-a-strong-random-string

# SiliconFlow AI API
SILICONFLOW_API_KEY=your-api-key-here
```

**IMPORTANT**:
- Change `JWT_SECRET` to a strong, random string in production
- Get your SiliconFlow API key from: https://siliconflow.cn/

### 3. Database Setup

The database schema is already configured in Supabase. You just need to create an admin user.

#### Create Admin User

```bash
# Start the backend server
npm run dev:server

# In another terminal, create admin user
curl -X POST http://localhost:3001/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "role": "admin"
  }'
```

Or use this simple Node.js script:

```javascript
// create-admin.js
import fetch from 'node-fetch';

const response = await fetch('http://localhost:3001/api/auth/create-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'your-secure-password',
    role: 'admin'
  })
});

console.log(await response.json());
```

Run with: `node create-admin.js`

### 4. Development

Start both frontend and backend:

```bash
# Terminal 1 - Frontend (http://localhost:5173)
npm run dev

# Terminal 2 - Backend (http://localhost:3001)
npm run dev:server
```

Access:
- **Landing Page**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **Backend API**: http://localhost:3001

Test with stock code parameter:
- http://localhost:5173/?code=1031

### 5. Testing the System

1. **Test Landing Page**:
   - Visit http://localhost:5173/?code=1031
   - Page should auto-fill stock code
   - Click "今すぐ診断" to test AI analysis

2. **Test Admin Dashboard**:
   - Visit http://localhost:5173/admin/login
   - Login with created admin credentials
   - Explore dashboard, users, analytics pages

3. **Test API Directly**:
   ```bash
   # Health check
   curl http://localhost:3001/health

   # Fetch stock data
   curl -X POST http://localhost:3001/api/stock/fetch \
     -H "Content-Type: application/json" \
     -d '{"code":"1031"}'
   ```

### 6. Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm run start:server

# Serve frontend with static server (or use nginx)
npx serve -s dist
```

### 7. Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access at: http://localhost

### 8. Google Analytics Setup

1. Login to admin dashboard
2. Go to "アナリティクス" (Analytics) page
3. Enter your configuration:
   - **GA4 Measurement ID**: G-XXXXXXXXXX
   - **Google Ads Conversion ID**: AW-XXXXXXXXXX
   - **Conversion Action ID**: AW-XXXXXXXXXX/XXXXX
4. Enable tracking
5. Save configuration

Events tracked:
- `Bdd` - Diagnosis button clicks
- `Add` - Conversion button clicks

### 9. Adding Redirect Links

1. Go to "リダイレクト" (Redirects) page
2. Click "新規追加" (Add New)
3. Fill in:
   - **User ID**: Identifier for this link
   - **Target URL**: Where to redirect users
   - **Weight**: 1-100 (higher = more priority)
4. Create

The system will distribute traffic based on weights.

### 10. Cache Management

Navigate to "キャッシュ" (Cache) page:

- **Clear specific cache**: Enter stock code and delete
- **Clear all cache**: Use "すべて削除" button
- Cache automatically expires after 7 days

## Common Issues

### Issue: Backend can't connect to Supabase
**Solution**: Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

### Issue: AI analysis fails
**Solution**: Verify SILICONFLOW_API_KEY is correct and you have API quota

### Issue: Stock data returns error
**Solution**: kabutan.jp may have rate limiting. Wait a moment and try again.

### Issue: Admin login fails
**Solution**: Ensure you've created an admin user using the create-admin endpoint

### Issue: Port already in use
**Solution**:
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update domain in nginx.conf and index.html
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Test all admin functions
- [ ] Verify Google Analytics tracking
- [ ] Test redirect link distribution
- [ ] Set appropriate cache expiration
- [ ] Review and test security measures

## Support

For issues:
1. Check this guide
2. Review README.md
3. Check server logs: `docker-compose logs -f`
4. Check Supabase dashboard for database errors

## Next Steps

After setup:
1. Customize landing page content in templates
2. Add more redirect links for A/B testing
3. Configure Google Analytics for tracking
4. Monitor user behavior in admin dashboard
5. Adjust cache settings based on usage
6. Set up automated backups

---

システムの構築が完了しました！
