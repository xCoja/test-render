const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    // The SkinRave API URL (replace with actual API URL)
    const url = 'https://api.skinrave.gg/affiliates/applicants?skip=0&take=25&sort=wagered&order=DESC&userId=95902&from=2024-10-12T14:00:00Z&to=2024-10-26T14:00:00Z';

    // Fetch data from SkinRave API
    const response = await fetch(url);
    
    // Check if the response is OK
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Network response was not ok, status: ${response.status}` }),
      };
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Return the data to the client (browser)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Error fetching SkinRave API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch SkinRave leaderboard data' }),
    };
  }
};
