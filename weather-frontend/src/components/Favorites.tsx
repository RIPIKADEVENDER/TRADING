import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

interface Favorite {
  id: number;
  city: string;
  country?: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Favorites: React.FC<{ onSelectCity: (city: string) => void }> = ({ onSelectCity }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE}/favorites`);
      setFavorites(response.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim()) return;

    try {
      const response = await axios.post(`${API_BASE}/favorites`, {
        city: newCity
      });
      setFavorites([response.data, ...favorites]);
      setNewCity('');
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/favorites/${id}`);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Favorite Locations</h3>
      
      {/* Add new favorite */}
      <form onSubmit={addFavorite} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add a city to favorites..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </form>

      {/* Favorites list */}
      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Heart size={32} className="mx-auto mb-2 opacity-50" />
          <p>No favorite locations yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => onSelectCity(fav.city)}
                className="flex-1 text-left hover:text-blue-600 font-semibold"
              >
                {fav.city}
                {fav.country && <span className="text-xs text-gray-600 block">{fav.country}</span>}
              </button>
              <button
                onClick={() => removeFavorite(fav.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;