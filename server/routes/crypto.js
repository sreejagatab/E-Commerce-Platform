const express = require("express");
const router = express.Router();

// Cache for ETH price to avoid too many API calls
let ethPriceCache = {
  price: null,
  timestamp: null,
  cacheDuration: 60000 // 1 minute cache
};

// Get real-time ETH price from CoinGecko API
router.get("/eth-price", async (req, res) => {
  try {
    const now = Date.now();

    // Return cached price if still valid
    if (ethPriceCache.price && ethPriceCache.timestamp &&
        (now - ethPriceCache.timestamp) < ethPriceCache.cacheDuration) {
      return res.json({
        status: 'success',
        data: {
          price: ethPriceCache.price,
          currency: 'USD',
          source: 'cache',
          cached_at: new Date(ethPriceCache.timestamp).toISOString()
        }
      });
    }

    // Fetch from CoinGecko API (free, no API key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch ETH price');
    }

    const data = await response.json();
    const ethPrice = data.ethereum.usd;
    const change24h = data.ethereum.usd_24h_change;

    // Update cache
    ethPriceCache.price = ethPrice;
    ethPriceCache.timestamp = now;

    res.json({
      status: 'success',
      data: {
        price: ethPrice,
        change_24h: change24h ? change24h.toFixed(2) : null,
        currency: 'USD',
        source: 'coingecko',
        fetched_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching ETH price:', error);

    // Return cached price if available, even if expired
    if (ethPriceCache.price) {
      return res.json({
        status: 'success',
        data: {
          price: ethPriceCache.price,
          currency: 'USD',
          source: 'cache-fallback',
          cached_at: new Date(ethPriceCache.timestamp).toISOString(),
          warning: 'Using cached price due to API error'
        }
      });
    }

    // Fallback to a default price if no cache
    res.json({
      status: 'success',
      data: {
        price: 2000, // Fallback price
        currency: 'USD',
        source: 'fallback',
        warning: 'Using fallback price due to API error'
      }
    });
  }
});

// Get multiple crypto prices
router.get("/prices", async (req, res) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,matic-network&vs_currencies=usd&include_24hr_change=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }

    const data = await response.json();

    res.json({
      status: 'success',
      data: {
        ethereum: {
          price: data.ethereum.usd,
          change_24h: data.ethereum.usd_24h_change?.toFixed(2)
        },
        bitcoin: {
          price: data.bitcoin.usd,
          change_24h: data.bitcoin.usd_24h_change?.toFixed(2)
        },
        polygon: {
          price: data['matic-network'].usd,
          change_24h: data['matic-network'].usd_24h_change?.toFixed(2)
        }
      },
      fetched_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to fetch crypto prices'
    });
  }
});

module.exports = router;
