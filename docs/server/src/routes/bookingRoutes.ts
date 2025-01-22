import express from 'express';
import { createBooking, getAllBookings, getUserBookings } from '../controllers/bookingControllers';

const router = express.Router();

router.post('/', createBooking); // Create booking
router.get('/', getAllBookings); // Retrieve all bookings
router.get('/user', getUserBookings);

export default router;
