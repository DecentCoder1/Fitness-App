import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = Router();

// Signup Route (unchanged)
router.post('/signup', async (req: Request, res: Response) => {
  const { email, fullName, password, isCoach } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, fullName, password: hashedPassword, isCoach });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login Route (bypasses DB check and password validation)
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Commented out DB lookup and password validation for bypass
  // const user = await User.findOne({ email });
  // if (!user) return res.status(404).json({ error: 'User not found.' });

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

  console.log(`Mock login attempt: email="${email}", password="${password}"`);

  // Mock user data for testing
  const mockUser = {
    id: '12345',
    email: email || 'test@example.com',
    fullName: 'John Doe',
    isCoach: false,
  };

  // Respond with mock user data
  res.json({
    message: 'Login successful!',
    user: mockUser,
  });
});

export default router;
