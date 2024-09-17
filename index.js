const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://quiz-game-deld.vercel.app',
  methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      res.status(500).json({ error: 'Error reading leaderboard' });
    }
  }
});

// // Update leaderboard
// app.post('/api/leaderboard', async (req, res) => {
//   try {
//     const { name, score } = req.body;
//     let leaderboard = [];
    
//     try {
//       const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
//       leaderboard = JSON.parse(data);
//     } catch (error) {
//       if (error.code !== 'ENOENT') throw error;
//     }

//     leaderboard.push({ name, score });
//     leaderboard.sort((a, b) => b.score - a.score);
//     leaderboard = leaderboard.slice(0, 10);

//     await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard));
//     res.json(leaderboard);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating leaderboard' });
//   }
// });


app.post('/api/leaderboard', (req, res) => {
  try {
    const { name, score } = req.body;
    // Update leaderboard in-memory
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Error updating leaderboard' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the app for Vercel
