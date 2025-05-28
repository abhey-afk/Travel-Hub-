import Amadeus from 'amadeus';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Helper function to chunk array into smaller arrays
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Helper function to add delay between API calls with exponential backoff
const delay = (ms, retryCount = 0) => {
  const backoffMs = ms * Math.pow(2, retryCount);
  return new Promise(resolve => setTimeout(resolve, backoffMs));
};

// Search for hotels
export const searchHotels = async (req, res) => {
  try {
    // Initialize Amadeus client with hotel-specific credentials
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_HOTEL_CLIENT_ID,
      clientSecret: process.env.AMADEUS_HOTEL_CLIENT_SECRET
    });
    
    const {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      priceRange,
      ratings
    } = req.body;

    // Validate required parameters
    if (!cityCode || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // First get hotels in the city to get their details
    const cityHotels = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode
    });

    // Create a map of hotel IDs to their details
    const hotelDetailsMap = cityHotels.data.reduce((map, hotel) => {
      map[hotel.hotelId] = {
        name: hotel.name,
        address: hotel.address,
        latitude: hotel.geoCode?.latitude,
        longitude: hotel.geoCode?.longitude,
        distance: hotel.distance?.value,
        distanceUnit: hotel.distance?.unit
      };
      return map;
    }, {});

    // Split hotel IDs into chunks of 10 to avoid URI length issues and rate limits
    const hotelIds = cityHotels.data.map(hotel => hotel.hotelId);
    const hotelIdChunks = chunkArray(hotelIds, 10);
    
    let allHotelOffers = [];
    let retryCount = 0;
    
    // Process each chunk with exponential backoff delay
    for (let i = 0; i < hotelIdChunks.length; i++) {
      const chunk = hotelIdChunks[i];
      let success = false;
      
      while (!success && retryCount < 3) { // Limit retries to 3 attempts
        try {
          const hotelOffers = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: chunk.join(','),
            adults: parseInt(adults),
            checkInDate,
            checkOutDate,
            roomQuantity: parseInt(roomQuantity) || 1,
            priceRange,
            ratings,
            bestRateOnly: true,
            view: 'FULL' // Request full hotel details including images
          });
          
          if (hotelOffers.data) {
            // Enhance each hotel offer with the details from hotelDetailsMap
            const enhancedOffers = hotelOffers.data.map(offer => ({
              ...offer,
              hotel: {
                ...offer.hotel,
                ...hotelDetailsMap[offer.hotel.hotelId],
                // If the API returns media/images, include them
                media: offer.hotel.media || []
              }
            }));
            
            allHotelOffers = allHotelOffers.concat(enhancedOffers);
          }
          
          // Reset retry count on successful request
          retryCount = 0;
          success = true;
          
          // Add delay between chunks with base delay of 1000ms
          await delay(1000, retryCount);
        } catch (chunkError) {
          console.error('Chunk processing error:', chunkError);
          
          if (chunkError.response?.statusCode === 429) {
            retryCount++;
            // Wait longer on rate limit with exponential backoff
            await delay(2000, retryCount);
            // Continue retrying the same chunk
            continue;
          } else {
            // For non-rate-limit errors, break the retry loop and move to next chunk
            success = true;
            retryCount = 0;
          }
        }
      }
      
      // Reset retry count when moving to a new chunk
      retryCount = 0;
    }

    return res.json(allHotelOffers);
  } catch (error) {
    console.error('Hotel search error:', error);
    
    // Handle rate limiting error specifically
    if (error.response?.statusCode === 429) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again in a few moments.',
        error: error.response?.data?.errors || error.message
      });
    }
    
    return res.status(500).json({
      message: 'Error searching hotels',
      error: error.response?.data?.errors || error.message
    });
  }
};

// City search for autocomplete with rate limiting handling
export const searchCities = async (req, res) => {
  try {
    // Initialize Amadeus client with hotel-specific credentials
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_HOTEL_CLIENT_ID,
      clientSecret: process.env.AMADEUS_HOTEL_CLIENT_SECRET
    });
    
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 1) {
      return res.status(400).json({ message: 'Search keyword required' });
    }

    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.city
    });

    return res.json(response.data);
  } catch (error) {
    console.error('City search error:', error);
    
    // Handle rate limiting error specifically
    if (error.response?.statusCode === 429) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again in a few moments.',
        error: error.response?.data?.errors || error.message
      });
    }
    
    return res.status(500).json({
      message: 'Error searching cities',
      error: error.response?.data?.errors || error.message
    });
  }
}; 