import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModels';

// Signup Controller
export const signup = async (req: Request, res: Response) => {
  const { email, fullName, password, isCoach } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      isCoach,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Return user data (excluding the password)
    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        isCoach: user.isCoach,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
