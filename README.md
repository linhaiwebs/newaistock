# AI Stock Analysis System (AI株式診断システム)

A comprehensive AI-powered stock analysis landing page management system designed for Japanese users, featuring complete user behavior tracking and an administrative dashboard.

## 🌟 Features

### Frontend Landing Page
- **AI-Powered Stock Analysis**: Integrates with SiliconFlow's Qwen2.5-7B-Instruct model
- **Dynamic Stock Code Loading**: Auto-populates from URL parameters (`?code=1031`)
- **Real-time Streaming Analysis**: Displays AI analysis results with streaming animation
- **Conversion Tracking**: Built-in conversion button with weighted redirect system
- **Google Analytics Integration**: Comprehensive event tracking (diagnosis clicks, conversions)
- **Responsive Design**: Mobile and desktop optimized

### Admin Dashboard
- **User Analytics**: Track visitors, session duration, and behavior patterns
- **User Management**: Paginated user list with detailed activity timelines
- **Analytics Configuration**: Manage Google Analytics 4 and Google Ads settings
- **Redirect Management**: Weighted link distribution system (1-100 priority)
- **Cache Management**: Control AI diagnosis result caching
- **Real-time Statistics**: Dashboard with key metrics and conversion rates

### Backend Services
- **Stock Data Scraper**: Fetches data from kabutan.jp
- **AI Integration**: Streaming analysis from SiliconFlow API
- **User Tracking**: Complete session and event tracking system
- **Caching System**: 7-day diagnosis result caching
- **Authentication**: JWT-based admin authentication
- **RESTful API**: Comprehensive API for all operations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Lucide Icons
- **Routing**: React Router v7
- **Backend**: Express.js + TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI Service**: SiliconFlow API (Qwen2.5-7B-Instruct)
- **Web Scraping**: Cheerio + Axios
- **Authentication**: JWT + bcrypt
- **Deployment**: Docker + Nginx

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (database is pre-configured)
- SiliconFlow API key (for AI analysis)
- Docker (for production deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Environment Configuration

Update `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

PORT=3001
JWT_SECRET=your-strong-secret-key
SILICONFLOW_API_KEY=your-siliconflow-api-key
```

### 3. Database Setup

The database schema is already configured. To create an admin user, use the API:

```bash
curl -X POST http://localhost:3001/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password","role":"admin"}'
```

### 4. Development

Run frontend and backend separately:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin Login: http://localhost:5173/admin/login

### 5. Production Build

```bash
npm run build
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost`

### Manual Docker Build

```bash
# Build image
docker build -t ai-stock-analysis .

# Run container
docker run -p 3001:3001 -p 5173:5173 --env-file .env ai-stock-analysis
```

## 📁 Project Structure

```
├── server/                 # Backend Express server
│   ├── index.ts           # Main server file
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Auth middleware
│   └── db/                # Database configuration
├── src/                   # Frontend React application
│   ├── components/        # React components
│   │   ├── LandingPage.tsx
│   │   └── admin/         # Admin dashboard components
│   ├── lib/               # Utilities and API client
│   └── App.tsx            # Main app component
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── nginx.conf             # Nginx reverse proxy config
└── README.md             # This file
```

## 🔧 Configuration

### Google Analytics Setup

1. Login to admin dashboard (`/admin/login`)
2. Navigate to Analytics page
3. Enter your Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
4. Enter Google Ads Conversion ID (AW-XXXXXXXXXX)
5. Enter Conversion Action ID
6. Enable tracking

Event names used:
- `Bdd` - Diagnosis button click
- `Add` - Conversion button click

### Redirect Links

1. Navigate to Redirects page in admin dashboard
2. Click "新規追加" (Add New)
3. Enter User ID, Target URL, and Weight (1-100)
4. Higher weight = higher priority in distribution

### Cache Management

- Cache expires after 7 days automatically
- Clear specific stock: Enter stock code and click delete
- Clear all cache: Use "すべて削除" button

## 🔐 Security Features

- JWT token authentication for admin access
- Bcrypt password hashing
- Row Level Security (RLS) on all database tables
- Input validation and sanitization
- CORS protection
- Rate limiting ready (implement in production)
- XSS and CSRF protection headers

## 📊 API Endpoints

### Public Endpoints
- `POST /api/stock/fetch` - Fetch stock data
- `POST /api/diagnosis/analyze` - Analyze stock (streaming)
- `GET /api/diagnosis/cache/:code` - Check cache
- `POST /api/tracking/session` - Track session
- `POST /api/tracking/event` - Track event
- `GET /api/redirect/weighted/select` - Get weighted redirect

### Admin Endpoints (require JWT token)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats/overview` - Dashboard statistics
- `GET /api/admin/users` - List users (paginated)
- `GET /api/admin/analytics/config` - Get GA config
- `PUT /api/admin/analytics/config` - Update GA config
- `GET /api/admin/redirects` - List redirects
- `POST /api/admin/redirects` - Create redirect
- `DELETE /api/admin/cache` - Clear cache

## 🎨 Customization

### Landing Page Content

Edit template in Supabase:

```sql
UPDATE templates
SET custom_text = '{"title": "Your Title", "subtitle": "Your Subtitle"}'
WHERE template_slug = 'default';
```

### Styling

Modify Tailwind classes in components or update `tailwind.config.js` for global theme changes.

## 🐛 Troubleshooting

### Backend not connecting
- Check `.env` file has correct Supabase credentials
- Ensure port 3001 is not in use
- Verify Supabase database is accessible

### AI analysis failing
- Verify SILICONFLOW_API_KEY is set correctly
- Check SiliconFlow API quota and status
- Review server logs for errors

### Stock data not loading
- kabutan.jp may have rate limiting
- Check network connectivity
- Verify stock code format (4-digit number)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs: `docker-compose logs -f app`
3. Check database status in Supabase dashboard

## 🔄 Updates and Maintenance

### Database Migrations
Database schema is managed through Supabase migrations. Schema is already set up.

### Updating Dependencies
```bash
npm update
```

### Cache Maintenance
Caches automatically expire after 7 days. Clear manually through admin dashboard if needed.

## 📈 Performance Tips

1. **Enable caching**: Reduces AI API calls and improves response time
2. **Use CDN**: Serve static assets through CDN in production
3. **Enable compression**: Nginx gzip is pre-configured
4. **Database indexes**: Already optimized in schema
5. **Monitor API limits**: Track SiliconFlow API usage

## 🌐 Production Checklist

- [ ] Update JWT_SECRET with strong random string
- [ ] Set production Supabase credentials
- [ ] Configure domain in nginx.conf
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all admin functions
- [ ] Verify Google Analytics tracking
- [ ] Test stock scraping with rate limits
- [ ] Review and set appropriate cache durations

---

Built with ❤️ for Japanese stock market analysis
