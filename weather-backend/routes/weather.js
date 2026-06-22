const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a city
 * GET /api/weather/current?city=London
 */
router.get('/current', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // Check cache first
    const cacheKey = `weather_${city}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch from API
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feels_like: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].main,
      icon: response.data.weather[0].icon,
      wind_speed: Math.round(response.data.wind.speed * 10) / 10,
      wind_deg: response.data.wind.deg,
      cloudiness: response.data.clouds.all,
      visibility: Math.round(response.data.visibility / 1000),
      sunrise: new Date(response.data.sys.sunrise * 1000),
      sunset: new Date(response.data.sys.sunset * 1000),
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      }
    };

    // Cache the result
    cache.set(cacheKey, weatherData);

    res.json(weatherData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * Get 5-day forecast for a city
 * GET /api/weather/forecast?city=London
 */
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // Check cache
    const cacheKey = `forecast_${city}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch from API
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    // Process forecast data - get 1 reading per day (noon)
    const forecastByDay = {};
    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];

      if (!forecastByDay[dayKey]) {
        forecastByDay[dayKey] = item;
      }
    });

    const forecast = Object.values(forecastByDay).slice(0, 5).map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      temp_max: Math.round(item.main.temp_max),
      temp_min: Math.round(item.main.temp_min),
      description: item.weather[0].main,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      wind_speed: Math.round(item.wind.speed * 10) / 10,
      rain_chance: (item.pop * 100).toFixed(0)
    }));

    const result = {
      city: response.data.city.name,
      country: response.data.city.country,
      forecast
    };

    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Forecast API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

/**
 * Get geocoding information
 * GET /api/weather/geo?city=London
 */
router.get('/geo', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Geo API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

module.exports = router;