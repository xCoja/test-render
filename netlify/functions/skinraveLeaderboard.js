const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const response = await fetch('https://api.skinrave.gg/affiliates/applicants?skip=0&take=25&sort=wagered&order=DESC&userId=95902&from=2024-10-12T14:00:00Z&to=2024-10-26T14:00:00Z', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error fetching SkinRave leaderboard:", error);  // Log error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch SkinRave leaderboard' }),
        };
    }
};
