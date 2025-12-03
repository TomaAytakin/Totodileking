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
    const url = 'https://www.cardmarket.com/en/Pokemon/Products/Singles/Neo-Genesis/Totodile-V2-NG81';

    // Note: Cardmarket might block automated requests or require headers.
    // We will try with standard headers.
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Logic Update: Find "Available from" (Lowest Price)
    // Selector: dt:contains("Available from") + dd

    let lowestPriceText = '';
    const availableFromLabel = $('dt').filter((i, el) => $(el).text().includes('Available from'));
    if (availableFromLabel.length > 0) {
        lowestPriceText = availableFromLabel.next('dd').text();
    }

    // Keep existing logic for Trend Price as reference
    let trendPriceText = '';
    const priceTrendLabel = $('dt').filter((i, el) => $(el).text().includes('Price Trend'));
    if (priceTrendLabel.length > 0) {
        trendPriceText = priceTrendLabel.next('dd').find('span').text();
    }

    // Helper to parse price
    const parsePrice = (text) => {
        if (!text) return null;
        // Clean the price string (e.g., "55,50 €")
        // Replace comma with dot, remove currency symbol
        const cleanString = text.replace('€', '').replace(',', '.').trim();
        const val = parseFloat(cleanString);
        return isNaN(val) ? null : val;
    };

    const lowestPrice = parsePrice(lowestPriceText);
    const trendPrice = parsePrice(trendPriceText);

    // Determine final price (Use Lowest if found, else Trend)
    let finalPrice = 55.50; // default fallback
    let isLowPrice = false;

    if (lowestPrice !== null) {
        finalPrice = lowestPrice;
        isLowPrice = true;
    } else if (trendPrice !== null) {
        finalPrice = trendPrice;
    } else {
        console.log("Could not scrape price, using default.");
    }

    res.status(200).json({
        price: finalPrice,
        trendPrice: trendPrice !== null ? trendPrice : 0,
        isLowPrice: isLowPrice, // Boolean to track which one we found
        url: url
    });

  } catch (error) {
    console.error('Error fetching price:', error);
    // In case of error, return the default price as per requirements or error
    res.status(200).json({
        price: 55.50,
        trendPrice: 0,
        isLowPrice: false,
        url: 'https://www.cardmarket.com/en/Pokemon/Products/Singles/Neo-Genesis/Totodile-V2-NG81',
        error: 'Failed to scrape, using fallback'
    });
  }
});
