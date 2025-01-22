import express from 'express';
import { setAvailability, getAvailableCoaches } from '../controllers/availabilityControllers';

const router = express.Router();

// POST: Set coach availability
router.post('/', setAvailability);

// GET: Get available coaches for a specific date and time slot
router.get('/', getAvailableCoaches);

export default router;
