import express from 'express';
import { searchHotels, searchCities } from '../controllers/hotelController.js';

const router = express.Router();

// Hotel search routes
router.post('/search', searchHotels);
router.get('/cities', searchCities);

export default router; 