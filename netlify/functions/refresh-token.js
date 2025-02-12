const axios = require('axios');

exports.handler = async function(event, context) {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const refreshToken = process.env.REFRESH_TOKEN;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };

    try {
        const response = await axios.post(tokenUrl, new URLSearchParams(data), {
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const newAccessToken = response.data.access_token;

        return {
            statusCode: 200,
            body: JSON.stringify({ access_token: newAccessToken }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error('Error refreshing token:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error refreshing token', details: error.message }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        };
    }
};
