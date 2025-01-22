import { Request, Response } from 'express';
import Booking from '../models/bookingModel';
import User from '../models/userModel';

export const getAllBookings = async (_req: Request, res: Response) => {
    try {
      // Retrieve all bookings and populate user details
      const bookings = await Booking.find().populate('user', 'fullName email');
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error retrieving bookings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Create Booking
export const createBooking = async (req: Request, res: Response) => {
  const { email, date, timeSlot } = req.body;

  if (!email || !date || !timeSlot) {
    return res
      .status(400)
      .json({ error: 'All fields are required: email, date, and timeSlot.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create a new booking with the user's ObjectId
    const newBooking = new Booking({
      user: user._id,
      date,
      timeSlot,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
