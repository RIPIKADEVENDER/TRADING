# Trading Recommendation System - Setup Guide

## Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Docker & Docker Compose (optional but recommended)

## Quick Start with Docker

### 1. Clone and Navigate to Repository
```bash
cd TRADING
```

### 2. Start Services
```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 5000)
- Frontend (port 3000)

### 3. Access the Application
- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Manual Setup

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Start PostgreSQL and Redis services

# Initialize database
python
>>> from app import app, db
>>> with app.app_context():
>>>     db.create_all()
>>> exit()

# Run application
python app.py
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

### Get Stock Recommendations
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL"}'
```

### Analyze Stock
```bash
curl http://localhost:5000/api/analyze/AAPL
```

### Get All Stocks
```bash
curl http://localhost:5000/api/stocks
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://trading_user:trading_password@localhost:5432/trading_db
REDIS_URL=redis://localhost:6379
FLASK_ENV=development
SECRET_KEY=your-secret-key
DEBUG=True
```

## Features

- **AI-Powered Recommendations**: ML-based trading signals
- **Technical Analysis**: RSI, MACD, Bollinger Bands, Moving Averages
- **Risk Management**: Target prices and stop-loss recommendations
- **Portfolio Tracking**: Monitor multiple trading positions
- **Real-time Data**: Market data fetched from Yahoo Finance

## Project Structure

```
trading-recommendation-app/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   ├── services/
│   │   ├── recommendation_service.py
│   │   └── market_service.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml or use:
lsof -i :5000  # Find process on port 5000
kill -9 <PID>  # Kill process
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U trading_user -d trading_db

# Check credentials in .env
```

### API Not Responding
```bash
# Check logs
docker logs trading_backend

# Verify database migrations
python app.py
```

## Performance Optimization

- Results are cached in Redis for 1 hour
- Market data updates every 3600 seconds (configurable)
- Frontend uses React.memo for component optimization

## Security Notes

- Change SECRET_KEY in production
- Use environment variables for sensitive data
- Enable CORS only for trusted domains
- Use HTTPS in production
- Implement JWT authentication for API

## Future Enhancements

- [ ] Advanced ML models (LSTM, GRU)
- [ ] Backtesting capabilities
- [ ] Social trading features
- [ ] Mobile app
- [ ] Real-time WebSocket updates
- [ ] Options trading recommendations

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Follow CONTRIBUTING.md guidelines

## License

MIT License - See LICENSE file