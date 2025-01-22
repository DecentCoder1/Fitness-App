import { Router } from 'express';
import userRoutes from './userRoutes';
import bookingRoutes from './bookingRoutes';
import availabilityRoutes from './availabilityRoutes';

const router = Router();

// Prefix routes with /api
router.use('/user', userRoutes);
router.use('/booking', bookingRoutes);
router.use('/availability', availabilityRoutes);

export default router;
