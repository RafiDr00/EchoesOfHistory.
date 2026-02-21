# 🚀 Deployment Guide - Echoes of History

This guide covers various deployment options for the Echoes of History application.

## 📋 Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Python 3.11+ and Node.js 16+ (for manual deployment)
- Domain name and SSL certificates (for production)

## 🐳 Docker Deployment (Recommended)

### Development with Docker
```bash
# Clone the repository
git clone <repository-url>
cd EchoesOfHistory

# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Production Docker Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d

# Or build individually
docker build -t echoes-backend ./backend
docker build -t echoes-frontend ./frontend
```

## 🌐 Cloud Deployment Options

### 1. Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel:
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

#### Backend on Railway:
1. Connect repository to Railway
2. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables:
   ```
   DATABASE_URL=sqlite+aiosqlite:///./echoes.db
   JWT_SECRET=your-production-secret
   OPENAI_API_KEY=your-openai-key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

### 2. Heroku Deployment

#### Backend (Heroku):
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create echoes-history-backend

# Set environment variables
heroku config:set JWT_SECRET=your-production-secret
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend (Vercel):
Same as above, but point to Heroku backend URL.

### 3. AWS/GCP/Azure Deployment

#### Using AWS:
- **Frontend**: Deploy to S3 + CloudFront
- **Backend**: Deploy to ECS or Lambda
- **Database**: Use RDS PostgreSQL for production

#### Using GCP:
- **Frontend**: Deploy to Firebase Hosting
- **Backend**: Deploy to Cloud Run
- **Database**: Use Cloud SQL

## 🗄️ Database Configuration

### Development (SQLite)
```env
DATABASE_URL=sqlite+aiosqlite:///./echoes.db
```

### Production (PostgreSQL)
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
```

#### Setup PostgreSQL:
```bash
# Install asyncpg
pip install asyncpg

# Update requirements.txt
echo "asyncpg==0.28.0" >> requirements.txt
```

## 🔒 Security Considerations

### Environment Variables
```env
# Production .env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
JWT_SECRET=your-super-secure-random-string-256-bits
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-production-domain.com
CORS_ORIGINS=https://your-production-domain.com
```

### SSL/TLS Configuration
- Use HTTPS for all production deployments
- Configure proper CORS origins
- Use strong JWT secrets (256-bit)
- Enable rate limiting and request validation

## 📊 Performance Optimization

### Backend Optimization
```python
# Add to main.py for production
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["your-domain.com", "*.your-domain.com"]
)
```

### Frontend Optimization
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['your-image-domains.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  }
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          service: backend
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Monitoring and Logging

### Application Monitoring
```python
# Add to main.py
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.3f}s")
    return response
```

### Health Checks
```python
# Enhanced health check
@app.get("/healthz")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0",
        "database": "connected"  # Add actual DB check
    }
```

## 🧪 Testing in Production

### Smoke Tests
```bash
# Test backend health
curl https://your-backend-url.com/healthz

# Test search endpoint
curl -X POST "https://your-backend-url.com/api/search/enhanced" \
  -H "Content-Type: application/json" \
  -d '{"q": "Napoleon", "include_images": true}'

# Test frontend
curl -I https://your-frontend-url.com
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# SQLite backup
cp echoes.db backup_echoes_$(date +%Y%m%d_%H%M%S).db
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## 📞 Support and Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL configuration
2. **Database Connection**: Verify DATABASE_URL format
3. **OpenAI Errors**: Check API key and usage limits
4. **Build Failures**: Check Node.js/Python versions

### Debug Commands
```bash
# Check backend logs
docker-compose logs backend

# Check frontend logs  
docker-compose logs frontend

# Test database connection
python -c "from app.db import engine; print('DB connected')"
```

### Performance Monitoring
- Use application performance monitoring (APM) tools
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times and error rates
- Set up alerts for downtime and performance issues

---

For additional support, please check the main README.md or open an issue on GitHub.
