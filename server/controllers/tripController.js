import Trip from '../models/Trip.js';

// Get all trips for a user
export const getUserTrips = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming we have user info from auth middleware
    const { status, type } = req.query;

    // Build query
    const query = { user: userId };
    if (status) query.status = status;
    if (type) query.tripType = type;

    const trips = await Trip.find(query)
      .sort({ travelDate: -1 }) // Sort by travel date, newest first
      .limit(20); // Limit to last 20 trips

    res.json(trips);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

// Get a single trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      user: req.user._id,
      bookingId: generateBookingId()
    };

    const trip = new Trip(tripData);
    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
};

// Update trip status
export const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
};

// Cancel a trip
export const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error cancelling trip:', error);
    res.status(500).json({ message: 'Error cancelling trip', error: error.message });
  }
};

// Helper function to generate unique booking ID
const generateBookingId = () => {
  const prefix = 'TH'; // Travel Hub
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}; 