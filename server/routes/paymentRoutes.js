import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create payment intent (protected route)
router.post('/create-payment-intent', protect, createPaymentIntent);

// Webhook endpoint (public route - Stripe needs to access it)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router; 