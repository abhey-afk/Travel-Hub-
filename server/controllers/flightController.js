import Amadeus from 'amadeus';
import dotenv from 'dotenv';
import Trip from '../models/Trip.js';

// Ensure environment variables are loaded
dotenv.config();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Search for flights
export const searchFlights = async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      travelClass
    } = req.body;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Search flight offers
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      travelClass
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Flight search error:', error);
    return res.status(500).json({
      message: 'Error searching flights',
      error: error.response?.data?.errors || error.message
    });
  }
};

// Airport/City search for autocomplete
export const searchLocations = async (req, res) => {
  try {
    // Initialize Amadeus client
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET
    });
    
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 1) {
      return res.status(400).json({ message: 'Search keyword required' });
    }

    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.any
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Location search error:', error);
    return res.status(500).json({
      message: 'Error searching locations',
      error: error.response?.data?.errors || error.message
    });
  }
};

// Book a flight
export const bookFlight = async (req, res) => {
  try {
    const { flightOffer, passengers, contact } = req.body;
    
    // Validate the flight offer with Amadeus
    const flightValidation = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer]
        }
      })
    );

    // Create flight order
    const order = await amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: 'flight-order',
          flightOffers: [flightValidation.data.flightOffers[0]],
          travelers: passengers.map((passenger, index) => ({
            id: (index + 1).toString(),
            dateOfBirth: passenger.dob,
            name: {
              firstName: passenger.firstName,
              lastName: passenger.lastName
            },
            contact: {
              emailAddress: contact.email,
              phones: [{
                deviceType: 'MOBILE',
                countryCallingCode: '91',
                number: contact.phone
              }]
            }
          }))
        }
      })
    );

    // Create trip record in database
    const firstSegment = flightOffer.itineraries[0].segments[0];
    const lastSegment = flightOffer.itineraries[0].segments[flightOffer.itineraries[0].segments.length - 1];

    const trip = new Trip({
      user: req.user._id,
      tripType: 'flight',
      bookingId: order.data.id,
      status: 'upcoming',
      travelDate: new Date(firstSegment.departure.at),
      returnDate: flightOffer.itineraries[1] ? new Date(flightOffer.itineraries[1].segments[0].departure.at) : null,
      price: {
        amount: parseFloat(flightOffer.price.total),
        currency: flightOffer.price.currency
      },
      flight: {
        airline: firstSegment.carrierCode,
        flightNumber: firstSegment.number,
        departure: {
          city: firstSegment.departure.iataCode,
          airport: firstSegment.departure.iataCode,
          terminal: firstSegment.departure.terminal,
          time: new Date(firstSegment.departure.at)
        },
        arrival: {
          city: lastSegment.arrival.iataCode,
          airport: lastSegment.arrival.iataCode,
          terminal: lastSegment.arrival.terminal,
          time: new Date(lastSegment.arrival.at)
        },
        class: flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin,
        passengers: passengers.map(passenger => ({
          type: 'adult',
          name: `${passenger.title} ${passenger.firstName} ${passenger.lastName}`
        }))
      }
    });

    await trip.save();

    res.status(201).json({
      message: 'Flight booked successfully',
      bookingId: trip.bookingId,
      tripId: trip._id
    });
  } catch (error) {
    console.error('Flight booking error:', error);
    res.status(500).json({
      message: 'Error booking flight',
      error: error.response?.data?.errors || error.message
    });
  }
};