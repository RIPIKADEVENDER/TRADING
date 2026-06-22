const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weather');
const favoritesRoutes = require('./routes/favorites');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Weather API running on port ${PORT}`);
});

module.exports = app;