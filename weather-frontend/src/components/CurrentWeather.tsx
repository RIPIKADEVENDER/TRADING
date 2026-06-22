import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import axios from 'axios';

interface Weather {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  wind_speed: number;
  wind_deg: number;
  cloudiness: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CurrentWeather: React.FC<{ city: string }> = ({ city }) => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/weather/current`, {
        params: { city }
      });
      setWeather(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error: {error}
      </div>
    );
  }

  if (!weather) return null;

  const windCardinal = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ][Math.round(weather.wind_deg / 22.5) % 16];

  const getWeatherGradient = () => {
    switch (weather.description.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return 'from-blue-400 to-blue-600';
      case 'clouds':
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rain':
      case 'rainy':
        return 'from-blue-600 to-gray-700';
      case 'snow':
        return 'from-cyan-300 to-blue-400';
      case 'thunderstorm':
        return 'from-purple-700 to-gray-900';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getWeatherGradient()} rounded-2xl shadow-2xl p-8 text-white mb-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Main weather info */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">{weather.city}, {weather.country}</h2>
            <p className="text-xl opacity-90 mb-6">{weather.description}</p>
          </div>
          <div>
            <div className="text-7xl font-bold mb-2">{weather.temperature}°C</div>
            <p className="text-lg opacity-90">Feels like {weather.feels_like}°C</p>
          </div>
        </div>

        {/* Right side - Detailed metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Droplets size={20} className="mr-2" />
              <span className="opacity-90">Humidity</span>
            </div>
            <p className="text-3xl font-bold">{weather.humidity}%</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Wind size={20} className="mr-2" />
              <span className="opacity-90">Wind Speed</span>
            </div>
            <p className="text-3xl font-bold">{weather.wind_speed} m/s</p>
            <p className="text-sm opacity-75">{windCardinal}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Eye size={20} className="mr-2" />
              <span className="opacity-90">Visibility</span>
            </div>
            <p className="text-3xl font-bold">{weather.visibility} km</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Gauge size={20} className="mr-2" />
              <span className="opacity-90">Pressure</span>
            </div>
            <p className="text-3xl font-bold">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;