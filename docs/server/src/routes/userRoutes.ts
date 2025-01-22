import { Router } from 'express';
import { signup, login, getUser, getAllUsers } from '../controllers/userControllers';

const router = Router();

// Get a specific user by email
router.get('/', getUser);

// Get all users
router.get('/all', getAllUsers);

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

export default router;
