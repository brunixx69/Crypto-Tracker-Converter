/**
 * API Module for CoinGecko integration
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_KEY = 'crypto_data_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches the top 100 cryptocurrencies by market cap with caching
 * @returns {Promise<Array>} List of crypto data
 */
export async function fetchTopCryptos() {
    // Check Cache first
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Serving from cache...');
            return data;
        }
    }

    try {
        const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`);

        if (response.status === 429) {
            throw new Error('RATE_LIMIT');
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Save to cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));

        return data;
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
        throw error;
    }
}
