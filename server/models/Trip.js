import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripType: {
    type: String,
    enum: ['flight', 'hotel', 'train'],
    required: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  // Common fields for all trip types
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  // Flight specific fields
  flight: {
    airline: String,
    flightNumber: String,
    departure: {
      city: String,
      airport: String,
      terminal: String,
      time: Date
    },
    arrival: {
      city: String,
      airport: String,
      terminal: String,
      time: Date
    },
    class: String,
    passengers: [{
      type: {
        type: String,
        enum: ['adult', 'child', 'infant']
      },
      name: String,
      seatNumber: String
    }]
  },
  // Hotel specific fields
  hotel: {
    name: String,
    location: String,
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    rooms: Number
  },
  // Train specific fields
  train: {
    trainNumber: String,
    trainName: String,
    from: {
      station: String,
      code: String,
      time: Date
    },
    to: {
      station: String,
      code: String,
      time: Date
    },
    class: String,
    passengers: [{
      name: String,
      age: Number,
      seatNumber: String,
      berth: String
    }]
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ bookingId: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip; 