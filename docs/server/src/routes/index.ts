import { Router } from 'express';
import userRoutes from './userRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

// Prefix routes with /api
router.use('/user', userRoutes);
router.use('/bookings', bookingRoutes);

export default router;
