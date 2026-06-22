import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import axios from 'axios';

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  rain_chance: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Forecast: React.FC<{ city: string }> = ({ city }) => {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForecast();
  }, [city]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/weather/forecast`, {
        params: { city }
      });
      setForecast(response.data.forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading forecast...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error: {error}</div>;

  const getWeatherIcon = (description: string) => {
    switch (description.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return '☀️';
      case 'clouds':
      case 'cloudy':
        return '☁️';
      case 'rain':
      case 'rainy':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">5-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-semibold text-gray-700 mb-2">{day.date}</p>
            <div className="text-4xl mb-3">{getWeatherIcon(day.description)}</div>
            <p className="text-sm text-gray-600 mb-3">{day.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">High:</span>
                <span className="text-red-600">{day.temp_max}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Low:</span>
                <span className="text-blue-600">{day.temp_min}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Rain:</span>
                <span>{day.rain_chance}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Wind:</span>
                <span>{day.wind_speed} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;