import express from 'express';
import cors from 'cors'; // Import CORS middleware
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;  // Use dynamic port for Render

// Your API keys and URLs
const CHICKEN_API_KEY = '05381fe04025772964ce1fedc91b55d7';  // Chicken.gg API key
const SKINRAVE_API_URL = 'https://api.skinrave.gg/affiliates/applicants?skip=0&take=25&sort=wagered&order=DESC&userId=95902&from=2024-10-12T14:00:00Z&to=2024-10-26T14:00:00Z';

// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow all origins (you can restrict this to your Netlify domain)
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

// Define __dirname manually since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the minTime and maxTime manually for your desired time range for Chicken.gg
const MIN_TIME = 1728935622359; // October 15, 2024, at 00:00 UTC
const MAX_TIME = 1729886022000; // October 25, 2024, at 00:00 UTC

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch and serve Chicken.gg leaderboard data
app.get('/api/chicken-leaderboard', async (req, res) => {
    try {
        const cacheFile = 'chicken-leaderboard-cache.json';

        // Check if the cache file exists and if it's still valid
        if (fs.existsSync(cacheFile)) {
            const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
            const currentTime = Date.now();

            // If the cache is valid (within the CACHE_DURATION), return cached data
            if (currentTime - cachedData.timestamp < CACHE_DURATION) {
                return res.json(cachedData.data);
            }
        }

        // Fetch fresh data from Chicken.GG API
        const url = `https://affiliates.chicken.gg/v1/referrals?key=${CHICKEN_API_KEY}&minTime=${MIN_TIME}&maxTime=${MAX_TIME}`;

        const response = await fetch(url);
        const data = await response.json();

        // Write the fresh data to the cache file
        fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), data }));

        // Send the fresh data to the client
        res.json(data);
    } catch (error) {
        console.error('Error fetching Chicken.gg API:', error);
        res.status(500).json({ error: 'Failed to fetch Chicken.gg leaderboard data' });
    }
});

// API route to fetch and serve SkinRave leaderboard data
app.get('/api/skinrave-leaderboard', async (req, res) => {
    try {
        // Fetch fresh data from SkinRave API
        const response = await fetch(SKINRAVE_API_URL);
        const data = await response.json();

        // Send the fresh data to the client
        res.json(data);
    } catch (error) {
        console.error('Error fetching SkinRave API:', error);
        res.status(500).json({ error: 'Failed to fetch SkinRave leaderboard data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
