const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not set.');
  process.exit(1); // Exit the application with an error code
}

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB:', error));

app.use(cors({
  origin: 'https://quiz-game-deld.vercel.app',
  methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Define a schema and model for the leaderboard
const leaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

// Update leaderboard
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, score } = req.body;
    const newEntry = { name, score };

    await Leaderboard.updateOne(
      { name }, // Query to find existing entry
      { $set: newEntry }, // Update entry
      { upsert: true } // Create if not exists
    );

    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ error: 'Error updating leaderboard' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
