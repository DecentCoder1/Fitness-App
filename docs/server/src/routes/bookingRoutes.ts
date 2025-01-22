import express from 'express';
import { createBooking, getAllBookings } from '../controllers/bookingControllers';

const router = express.Router();

router.post('/', createBooking); // Create booking
router.get('/', getAllBookings); // Retrieve all bookings

export default router;
