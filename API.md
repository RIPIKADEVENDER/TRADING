# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Get Trading Recommendation
**POST** `/recommendations`

**Request Body:**
```json
{
  "symbol": "AAPL"
}
```

**Response:**
```json
{
  "symbol": "AAPL",
  "action": "BUY",
  "confidence_score": 0.85,
  "current_price": 150.25,
  "target_price": 165.50,
  "stop_loss": 145.75,
  "reason": "Uptrend: 20 SMA > 50 SMA > 200 SMA; Oversold condition (RSI: 28.45); Bullish MACD signal",
  "technical_indicators": {
    "rsi": 28.45,
    "macd": 0.0234,
    "sma_20": 149.50,
    "sma_50": 147.25,
    "sma_200": 145.00
  }
}
```

### 2. List Recommendations
**GET** `/recommendations?user_id=1`

**Response:**
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "action": "BUY",
    "confidence_score": 0.85,
    "reason": "Strong uptrend signal",
    "target_price": 165.50,
    "stop_loss": 145.75
  }
]
```

### 3. Analyze Stock
**GET** `/analyze/<symbol>`

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "current_price": 150.25,
  "currency": "USD",
  "market_cap": 2300000000000,
  "pe_ratio": 28.5,
  "dividend_yield": 0.47,
  "52_week_high": 189.95,
  "52_week_low": 124.17,
  "sector": "Technology",
  "industry": "Consumer Electronics",
  "avg_volume": 52000000,
  "beta": 1.20
}
```

### 4. Get All Stocks
**GET** `/stocks`

**Response:**
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "sector": "Technology"
  }
]
```

### 5. Get Specific Stock
**GET** `/stocks/<symbol>`

**Response:**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "volume": 52000000,
  "market_cap": 2300000000000,
  "sector": "Technology"
}
```

### 6. Create Portfolio
**POST** `/portfolio`

**Request Body:**
```json
{
  "user_id": 1,
  "name": "My Trading Portfolio",
  "description": "Aggressive growth strategy",
  "risk_level": "High"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "My Trading Portfolio",
  "message": "Portfolio created successfully"
}
```

### 7. Get Portfolio
**GET** `/portfolio/<portfolio_id>`

**Response:**
```json
{
  "id": 1,
  "name": "My Trading Portfolio",
  "risk_level": "High",
  "total_value": 50000,
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 100,
      "current_price": 150.25,
      "value": 15025
    }
  ]
}
```

### 8. Add Holding to Portfolio
**POST** `/portfolio/<portfolio_id>/holding`

**Request Body:**
```json
{
  "symbol": "AAPL",
  "quantity": 100,
  "purchase_price": 145.00,
  "current_price": 150.25
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Holding added"
}
```

### 9. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "healthy"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "Stock not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Could not generate recommendation"
}
```

## Technical Indicators Explained

- **RSI (Relative Strength Index)**: 0-100 scale, <30 oversold, >70 overbought
- **MACD**: Momentum indicator, positive = bullish, negative = bearish
- **SMA**: Simple Moving Average, trend confirmation
- **Bollinger Bands**: Volatility bands, prices near edges suggest reversals

## Authentication (Future)

API will use JWT authentication:
```
Authorization: Bearer <token>
```