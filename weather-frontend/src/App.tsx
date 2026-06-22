import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import './App.css';

function App() {
  const [city, setCity] = useState('London');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      setSearchInput('');
    }
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">🌤️ Weather Dashboard</h1>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Search size={20} />
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Weather info */}
          <div className="lg:col-span-2">
            <CurrentWeather city={city} />
            <Forecast city={city} />
          </div>

          {/* Right column - Favorites */}
          <div>
            <Favorites onSelectCity={handleSelectCity} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
        <p>Weather data powered by OpenWeatherMap API</p>
        <p className="text-sm mt-2">© 2024 Weather Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;