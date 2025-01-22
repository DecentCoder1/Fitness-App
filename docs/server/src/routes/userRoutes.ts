import { Router } from 'express';
import { signup, login, getUser, getAllUsers, getUserById } from '../controllers/userControllers';

const router = Router();

// Get a specific user by email or id
router.get('/:id', getUserById);  // Fetch by ID instead of email

// Get all users
router.get('/all', getAllUsers);

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

export default router;
