import express from 'express';
import { searchFlights, searchLocations, bookFlight } from '../controllers/flightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Flight search routes
router.post('/search', searchFlights);
router.get('/locations', searchLocations);

// Book flight (protected route)
router.post('/book', protect, bookFlight);

export default router;