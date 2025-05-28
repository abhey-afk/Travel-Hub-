import express from 'express';
import { getUserTrips, getTripById, createTrip, updateTripStatus, cancelTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// Get all trips for the logged-in user
router.get('/', getUserTrips);

// Get a specific trip by ID
router.get('/:id', getTripById);

// Create a new trip
router.post('/', createTrip);

// Update trip status
router.patch('/:id/status', updateTripStatus);

// Cancel a trip
router.patch('/:id/cancel', cancelTrip);

export default router; 