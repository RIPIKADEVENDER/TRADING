"""
Service for generating trading recommendations using ML models
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
from datetime import datetime, timedelta

class RecommendationService:
    """Service to generate AI-powered trading recommendations"""
    
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, 1))
    
    def generate_recommendation(self, symbol: str) -> dict:
        """
        Generate a trading recommendation for a given symbol
        
        Args:
            symbol: Stock symbol (e.g., 'AAPL')
            
        Returns:
            Dictionary containing recommendation details
        """
        try:
            # Fetch historical data
            stock_data = self._fetch_stock_data(symbol)
            if stock_data is None:
                return None
            
            # Calculate technical indicators
            indicators = self._calculate_indicators(stock_data)
            
            # Generate recommendation based on analysis
            recommendation = self._generate_recommendation(symbol, indicators, stock_data)
            
            return recommendation
        except Exception as e:
            print(f"Error generating recommendation: {e}")
            return None
    
    def _fetch_stock_data(self, symbol: str, period: str = '1y') -> pd.DataFrame:
        """Fetch historical stock data"""
        try:
            stock = yf.Ticker(symbol)
            data = stock.history(period=period)
            return data
        except Exception as e:
            print(f"Error fetching stock data: {e}")
            return None
    
    def _calculate_indicators(self, data: pd.DataFrame) -> dict:
        """Calculate technical indicators"""
        indicators = {}
        
        # Simple Moving Averages
        data['SMA_20'] = data['Close'].rolling(window=20).mean()
        data['SMA_50'] = data['Close'].rolling(window=50).mean()
        data['SMA_200'] = data['Close'].rolling(window=200).mean()
        
        # Exponential Moving Averages
        data['EMA_12'] = data['Close'].ewm(span=12, adjust=False).mean()
        data['EMA_26'] = data['Close'].ewm(span=26, adjust=False).mean()
        
        # Relative Strength Index (RSI)
        data['RSI'] = self._calculate_rsi(data['Close'])
        
        # MACD
        data['MACD'], data['Signal'], data['Histogram'] = self._calculate_macd(data['Close'])
        
        # Bollinger Bands
        data['BB_Upper'], data['BB_Middle'], data['BB_Lower'] = self._calculate_bollinger_bands(data['Close'])
        
        indicators['latest_price'] = data['Close'].iloc[-1]
        indicators['sma_20'] = data['SMA_20'].iloc[-1]
        indicators['sma_50'] = data['SMA_50'].iloc[-1]
        indicators['sma_200'] = data['SMA_200'].iloc[-1]
        indicators['ema_12'] = data['EMA_12'].iloc[-1]
        indicators['ema_26'] = data['EMA_26'].iloc[-1]
        indicators['rsi'] = data['RSI'].iloc[-1]
        indicators['macd'] = data['MACD'].iloc[-1]
        indicators['signal'] = data['Signal'].iloc[-1]
        indicators['bb_upper'] = data['BB_Upper'].iloc[-1]
        indicators['bb_lower'] = data['BB_Lower'].iloc[-1]
        
        return indicators
    
    def _calculate_rsi(self, prices, period=14):
        """Calculate Relative Strength Index"""
        deltas = np.diff(prices)
        seed = deltas[:period+1]
        up = seed[seed >= 0].sum() / period
        down = -seed[seed < 0].sum() / period
        rs = up / down if down != 0 else 0
        rsi = np.zeros_like(prices)
        rsi[:period] = 100. - 100. / (1. + rs)
        
        for i in range(period, len(prices)):
            delta = deltas[i-1]
            if delta > 0:
                upval = delta
                downval = 0.
            else:
                upval = 0.
                downval = -delta
            
            up = (up * (period - 1) + upval) / period
            down = (down * (period - 1) + downval) / period
            rs = up / down if down != 0 else 0
            rsi[i] = 100. - 100. / (1. + rs)
        
        return rsi
    
    def _calculate_macd(self, prices, fast=12, slow=26, signal=9):
        """Calculate MACD"""
        ema_fast = prices.ewm(span=fast, adjust=False).mean()
        ema_slow = prices.ewm(span=slow, adjust=False).mean()
        macd = ema_fast - ema_slow
        signal_line = macd.ewm(span=signal, adjust=False).mean()
        histogram = macd - signal_line
        return macd, signal_line, histogram
    
    def _calculate_bollinger_bands(self, prices, window=20, num_std=2):
        """Calculate Bollinger Bands"""
        sma = prices.rolling(window=window).mean()
        std = prices.rolling(window=window).std()
        upper_band = sma + (std * num_std)
        lower_band = sma - (std * num_std)
        return upper_band, sma, lower_band
    
    def _generate_recommendation(self, symbol: str, indicators: dict, data: pd.DataFrame) -> dict:
        """Generate recommendation based on technical analysis"""
        
        score = 0
        reasoning = []
        
        latest_price = indicators['latest_price']
        
        # Check moving average alignment
        if indicators['sma_20'] > indicators['sma_50'] > indicators['sma_200']:
            score += 2
            reasoning.append("Uptrend: 20 SMA > 50 SMA > 200 SMA")
        elif indicators['sma_20'] < indicators['sma_50'] < indicators['sma_200']:
            score -= 2
            reasoning.append("Downtrend: 20 SMA < 50 SMA < 200 SMA")
        
        # Check RSI
        rsi = indicators['rsi']
        if rsi < 30:
            score += 1
            reasoning.append(f"Oversold condition (RSI: {rsi:.2f})")
        elif rsi > 70:
            score -= 1
            reasoning.append(f"Overbought condition (RSI: {rsi:.2f})")
        
        # Check MACD
        if indicators['macd'] > indicators['signal']:
            score += 1
            reasoning.append("Bullish MACD signal")
        else:
            score -= 1
            reasoning.append("Bearish MACD signal")
        
        # Check Bollinger Bands
        if latest_price < indicators['bb_lower']:
            score += 1
            reasoning.append("Price near lower Bollinger Band - potential bounce")
        elif latest_price > indicators['bb_upper']:
            score -= 1
            reasoning.append("Price near upper Bollinger Band - potential pullback")
        
        # Determine action and confidence
        if score >= 2:
            action = "BUY"
            confidence_score = min(0.95, 0.5 + (score * 0.15))
        elif score <= -2:
            action = "SELL"
            confidence_score = min(0.95, 0.5 + (abs(score) * 0.15))
        else:
            action = "HOLD"
            confidence_score = 0.5 + (abs(score) * 0.1)
        
        # Calculate targets
        atr = self._calculate_atr(data)
        if action == "BUY":
            target_price = latest_price + (atr * 2)
            stop_loss = latest_price - atr
        else:
            target_price = latest_price - (atr * 2)
            stop_loss = latest_price + atr
        
        return {
            'symbol': symbol,
            'action': action,
            'confidence_score': round(confidence_score, 2),
            'current_price': round(latest_price, 2),
            'target_price': round(target_price, 2),
            'stop_loss': round(stop_loss, 2),
            'reason': '; '.join(reasoning),
            'score': score,
            'technical_indicators': {
                'rsi': round(rsi, 2),
                'macd': round(indicators['macd'], 4),
                'sma_20': round(indicators['sma_20'], 2),
                'sma_50': round(indicators['sma_50'], 2),
                'sma_200': round(indicators['sma_200'], 2),
            }
        }
    
    def _calculate_atr(self, data, period=14):
        """Calculate Average True Range"""
        high_low = data['High'] - data['Low']
        high_close = abs(data['High'] - data['Close'].shift())
        low_close = abs(data['Low'] - data['Close'].shift())
        
        tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
        atr = tr.rolling(period).mean()
        
        return atr.iloc[-1]