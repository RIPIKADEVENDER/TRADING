const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../data/favorites.db');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to SQLite database');
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL UNIQUE,
    country TEXT,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

/**
 * Get all favorite locations
 * GET /api/favorites
 */
router.get('/', (req, res) => {
  db.all('SELECT * FROM favorites ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }
    res.json(rows || []);
  });
});

/**
 * Add a favorite location
 * POST /api/favorites
 * Body: { city, country, latitude, longitude }
 */
router.post('/', (req, res) => {
  const { city, country, latitude, longitude } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  db.run(
    'INSERT INTO favorites (city, country, latitude, longitude) VALUES (?, ?, ?, ?)',
    [city, country || null, latitude || null, longitude || null],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'City already in favorites' });
        }
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to add favorite' });
      }
      res.status(201).json({
        id: this.lastID,
        city,
        country,
        latitude,
        longitude
      });
    }
  );
});

/**
 * Remove a favorite location
 * DELETE /api/favorites/:id
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM favorites WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete favorite' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json({ message: 'Favorite deleted successfully' });
  });
});

module.exports = router;