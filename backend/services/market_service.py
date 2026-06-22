"""
Service for fetching and analyzing market data
"""

import yfinance as yf
from datetime import datetime, timedelta

class MarketService:
    """Service for market data operations"""
    
    def analyze_stock(self, symbol: str) -> dict:
        """
        Analyze a stock and return market data
        
        Args:
            symbol: Stock symbol (e.g., 'AAPL')
            
        Returns:
            Dictionary containing market analysis
        """
        try:
            stock = yf.Ticker(symbol)
            
            # Fetch current data
            hist = stock.history(period='1d')
            info = stock.info
            
            if hist.empty:
                return None
            
            latest_price = hist['Close'].iloc[-1]
            
            # Get historical data for analysis
            hist_1y = stock.history(period='1y')
            
            high_52w = hist_1y['High'].max()
            low_52w = hist_1y['Low'].min()
            
            analysis = {
                'symbol': symbol,
                'name': info.get('longName', 'N/A'),
                'current_price': round(latest_price, 2),
                'currency': info.get('currency', 'USD'),
                'market_cap': info.get('marketCap', 'N/A'),
                'pe_ratio': round(info.get('trailingPE', 0), 2),
                'dividend_yield': round(info.get('dividendYield', 0) * 100, 2),
                '52_week_high': round(high_52w, 2),
                '52_week_low': round(low_52w, 2),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'avg_volume': info.get('averageVolume', 'N/A'),
                'beta': round(info.get('beta', 0), 2),
            }
            
            return analysis
        except Exception as e:
            print(f"Error analyzing stock {symbol}: {e}")
            return None
    
    def get_market_overview(self) -> dict:
        """Get general market overview"""
        try:
            major_indices = {
                '^GSPC': 'S&P 500',
                '^IXIC': 'NASDAQ',
                '^DJI': 'Dow Jones',
                '^FTSE': 'FTSE 100',
                '^N225': 'Nikkei 225'
            }
            
            overview = {}
            for ticker, name in major_indices.items():
                try:
                    stock = yf.Ticker(ticker)
                    hist = stock.history(period='1d')
                    if not hist.empty:
                        price = hist['Close'].iloc[-1]
                        overview[name] = round(price, 2)
                except:
                    overview[name] = 'N/A'
            
            return overview
        except Exception as e:
            print(f"Error getting market overview: {e}")
            return {}