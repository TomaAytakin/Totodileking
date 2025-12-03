const axios = require('axios');
const cheerio = require('cheerio');
const functions = require('@google-cloud/functions-framework');

functions.http('getPrice', async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    // New Target URL: PriceCharting
    const url = 'https://www.pricecharting.com/game/pokemon-neo-genesis/totodile-81';

    // Headers to mimic a browser and avoid 403/400 errors
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
    };

    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    // Scraping Logic: Find "Ungraded" price.
    // Based on analysis, "Ungraded" often corresponds to the #used_price element id in PriceCharting for cards.
    // or simply the first price in the table.

    let priceText = $('#used_price .price').text().trim();

    // Fallback: Try the first .price element inside #game-page if specific ID fails
    if (!priceText) {
        priceText = $('#game-page .price').first().text().trim();
    }

    // Parse the price
    const parsePrice = (text) => {
        if (!text) return null;
        // Clean: Remove '$', ',', and whitespace
        const cleanString = text.replace('$', '').replace(',', '').trim();
        const val = parseFloat(cleanString);
        return isNaN(val) ? null : val;
    };

    const scrapedPrice = parsePrice(priceText);
    const finalPrice = scrapedPrice !== null ? scrapedPrice : 55.50; // Fallback to 55.50 if scrape fails (legacy default)

    res.status(200).json({
        price: finalPrice,
        url: url
    });

  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(200).json({
        price: 55.50, // Default fallback
        url: 'https://www.pricecharting.com/game/pokemon-neo-genesis/totodile-81',
        error: 'Failed to scrape, using fallback'
    });
  }
});
