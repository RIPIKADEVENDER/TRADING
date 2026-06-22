"""
API routes for Trading Recommendation System
"""

from flask import Blueprint, request, jsonify
from models import User, Stock, Portfolio, Recommendation, Holding
from app import db
from services.recommendation_service import RecommendationService
from services.market_service import MarketService

api_bp = Blueprint('api', __name__)

# Initialize services
rec_service = RecommendationService()
market_service = MarketService()

# ==================== Stock Routes ====================

@api_bp.route('/stocks', methods=['GET'])
def get_stocks():
    """Get all available stocks"""
    stocks = Stock.query.all()
    return jsonify([{
        'id': s.id,
        'symbol': s.symbol,
        'name': s.name,
        'price': s.price,
        'sector': s.sector
    } for s in stocks]), 200

@api_bp.route('/stocks/<symbol>', methods=['GET'])
def get_stock(symbol):
    """Get specific stock details"""
    stock = Stock.query.filter_by(symbol=symbol.upper()).first()
    if not stock:
        return jsonify({'error': 'Stock not found'}), 404
    
    return jsonify({
        'id': stock.id,
        'symbol': stock.symbol,
        'name': stock.name,
        'price': stock.price,
        'volume': stock.volume,
        'market_cap': stock.market_cap,
        'sector': stock.sector
    }), 200

# ==================== Portfolio Routes ====================

@api_bp.route('/portfolio', methods=['POST'])
def create_portfolio():
    """Create a new portfolio"""
    data = request.get_json()
    
    if not data.get('user_id') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    portfolio = Portfolio(
        user_id=data['user_id'],
        name=data['name'],
        description=data.get('description'),
        risk_level=data.get('risk_level', 'Medium')
    )
    
    db.session.add(portfolio)
    db.session.commit()
    
    return jsonify({
        'id': portfolio.id,
        'name': portfolio.name,
        'message': 'Portfolio created successfully'
    }), 201

@api_bp.route('/portfolio/<int:portfolio_id>', methods=['GET'])
def get_portfolio(portfolio_id):
    """Get portfolio details"""
    portfolio = Portfolio.query.get(portfolio_id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    
    holdings_data = [{
        'symbol': h.symbol,
        'quantity': h.quantity,
        'current_price': h.current_price,
        'value': h.quantity * h.current_price if h.current_price else 0
    } for h in portfolio.holdings]
    
    return jsonify({
        'id': portfolio.id,
        'name': portfolio.name,
        'risk_level': portfolio.risk_level,
        'total_value': portfolio.total_value,
        'holdings': holdings_data
    }), 200

@api_bp.route('/portfolio/<int:portfolio_id>/holding', methods=['POST'])
def add_holding(portfolio_id):
    """Add a holding to portfolio"""
    data = request.get_json()
    portfolio = Portfolio.query.get(portfolio_id)
    
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    
    holding = Holding(
        portfolio_id=portfolio_id,
        symbol=data['symbol'].upper(),
        quantity=data['quantity'],
        purchase_price=data.get('purchase_price'),
        current_price=data.get('current_price')
    )
    
    db.session.add(holding)
    db.session.commit()
    
    return jsonify({'id': holding.id, 'message': 'Holding added'}), 201

# ==================== Recommendation Routes ====================

@api_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Get AI-powered trading recommendations"""
    data = request.get_json()
    
    symbol = data.get('symbol')
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
    
    recommendation = rec_service.generate_recommendation(symbol.upper())
    
    if not recommendation:
        return jsonify({'error': 'Could not generate recommendation'}), 500
    
    return jsonify(recommendation), 200

@api_bp.route('/recommendations', methods=['GET'])
def list_recommendations():
    """List all recommendations for a user"""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    recs = Recommendation.query.filter_by(
        user_id=user_id,
        status='active'
    ).all()
    
    return jsonify([{
        'id': r.id,
        'symbol': r.symbol,
        'action': r.action,
        'confidence_score': r.confidence_score,
        'reason': r.reason,
        'target_price': r.target_price,
        'stop_loss': r.stop_loss
    } for r in recs]), 200

# ==================== Analysis Routes ====================

@api_bp.route('/analyze/<symbol>', methods=['GET'])
def analyze_stock(symbol):
    """Analyze a stock"""
    analysis = market_service.analyze_stock(symbol.upper())
    
    if not analysis:
        return jsonify({'error': 'Could not analyze stock'}), 500
    
    return jsonify(analysis), 200

# ==================== Health Check ====================

@api_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200