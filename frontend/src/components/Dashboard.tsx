import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Recommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence_score: number;
  current_price: number;
  target_price: number;
  stop_loss: number;
  reason: string;
}

const Dashboard: React.FC = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    if (!searchSymbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recommendations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: searchSymbol.toUpperCase() }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch recommendation');

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'text-green-600';
      case 'SELL':
        return 'text-red-600';
      case 'HOLD':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActionBgColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-green-100';
      case 'SELL':
        return 'bg-red-100';
      case 'HOLD':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Trading Recommendation System</h1>
          <p className="text-gray-600">AI-Powered Market Analysis & Trading Suggestions</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGetRecommendation()}
            />
            <button
              onClick={handleGetRecommendation}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              {loading ? 'Analyzing...' : 'Get Recommendation'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Recommendation Card */}
        {recommendation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Recommendation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{recommendation.symbol}</h2>
                    <p className="text-gray-500 mt-2">Current Price: ${recommendation.current_price}</p>
                  </div>
                  <div className={`px-6 py-3 rounded-lg font-bold text-xl ${getActionBgColor(recommendation.action)} ${getActionColor(recommendation.action)}`}>
                    {recommendation.action}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Confidence Score</p>
                    <p className="text-2xl font-bold text-blue-600">{(recommendation.confidence_score * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Target Price</p>
                    <p className="text-2xl font-bold text-green-600">${recommendation.target_price}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold">Stop Loss</p>
                    <p className="text-2xl font-bold text-red-600">${recommendation.stop_loss}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Analysis Reason:</h3>
                  <p className="text-gray-700 leading-relaxed">{recommendation.reason}</p>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Risk Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Risk Level</span>
                    <span className="text-yellow-600 font-bold">Medium</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Volatility</span>
                    <span className="text-blue-600 font-bold">Normal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> These recommendations are for informational purposes only and should not be considered as financial advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!recommendation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <TrendingUp className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="font-bold text-lg text-gray-800 mb-2">Real-time Analysis</h3>
              <p className="text-gray-600">Get instant market analysis based on technical indicators</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <AlertCircle className="mx-auto text-green-600 mb-4" size={32} />
              <h3 className="font-bold text-lg text-gray-800 mb-2">Risk Management</h3>
              <p className="text-gray-600">Receive target prices and stop loss recommendations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <TrendingDown className="mx-auto text-red-600 mb-4" size={32} />
              <h3 className="font-bold text-lg text-gray-800 mb-2">Expert Insights</h3>
              <p className="text-gray-600">Understand the reasoning behind each recommendation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;