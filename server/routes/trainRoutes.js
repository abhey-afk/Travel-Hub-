import express from 'express';
import { searchTrains } from '../controllers/trainController.js';

const router = express.Router();

// Route to search trains between stations
router.post('/search', searchTrains);

export default router; 