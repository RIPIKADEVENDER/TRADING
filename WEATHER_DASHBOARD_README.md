# Weather Dashboard

A beautiful, real-time weather dashboard application that fetches weather data from OpenWeatherMap API. Get current weather, forecasts, and detailed meteorological information.

## Features

- 🌡️ **Real-time Weather Data** - Current temperature, humidity, wind speed
- 📍 **Location Search** - Find weather for any city worldwide
- 📅 **5-Day Forecast** - Extended weather predictions
- 🎨 **Beautiful UI** - Dynamic backgrounds based on weather conditions
- 📊 **Detailed Metrics** - Pressure, UV index, visibility, wind direction
- 🌍 **Multiple Locations** - Save and switch between favorite cities
- 🔄 **Auto-refresh** - Updates every 5 minutes
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Node.js/Express
- **API**: OpenWeatherMap API
- **Database**: SQLite for saved locations
- **Charts**: Recharts for visualization

## Getting Started

### Prerequisites
- Node.js 16+
- OpenWeatherMap API Key (free at openweathermap.org)
- Docker & Docker Compose (optional)

### Quick Start

1. Clone the repository
2. Create `.env` file with your OpenWeatherMap API key
3. Run `npm install` in both backend and frontend directories
4. Start the application with `npm start`

## API Endpoints

- `GET /api/weather/current?city=London` - Current weather
- `GET /api/weather/forecast?city=London` - 5-day forecast
- `POST /api/favorites` - Save favorite location
- `GET /api/favorites` - Get saved locations
- `DELETE /api/favorites/:id` - Remove favorite

## Environment Variables

```env
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

## License

MIT License