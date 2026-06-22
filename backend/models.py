"""
Database models for Trading Recommendation System
"""

from app import db
from datetime import datetime

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    portfolios = db.relationship('Portfolio', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Stock(db.Model):
    """Stock model"""
    __tablename__ = 'stocks'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    sector = db.Column(db.String(100))
    price = db.Column(db.Float)
    volume = db.Column(db.Float)
    market_cap = db.Column(db.BigInteger)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Stock {self.symbol}>'

class Portfolio(db.Model):
    """Portfolio model"""
    __tablename__ = 'portfolios'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    total_value = db.Column(db.Float, default=0.0)
    risk_level = db.Column(db.String(20))  # Low, Medium, High
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    holdings = db.relationship('Holding', backref='portfolio', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Portfolio {self.name}>'

class Holding(db.Model):
    """Stock holding in a portfolio"""
    __tablename__ = 'holdings'
    
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    purchase_price = db.Column(db.Float)
    current_price = db.Column(db.Float)
    allocation_percentage = db.Column(db.Float)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Holding {self.symbol}>'

class Recommendation(db.Model):
    """Trading recommendation model"""
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    action = db.Column(db.String(20), nullable=False)  # BUY, SELL, HOLD
    confidence_score = db.Column(db.Float)  # 0.0 to 1.0
    reason = db.Column(db.Text)
    target_price = db.Column(db.Float)
    stop_loss = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='active')  # active, expired, executed
    
    def __repr__(self):
        return f'<Recommendation {self.symbol} {self.action}>'

class MarketData(db.Model):
    """Historical market data"""
    __tablename__ = 'market_data'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)
    date = db.Column(db.Date, nullable=False)
    open_price = db.Column(db.Float)
    high_price = db.Column(db.Float)
    low_price = db.Column(db.Float)
    close_price = db.Column(db.Float)
    volume = db.Column(db.BigInteger)
    
    __table_args__ = (db.UniqueConstraint('symbol', 'date', name='unique_symbol_date'),)
    
    def __repr__(self):
        return f'<MarketData {self.symbol} {self.date}>'