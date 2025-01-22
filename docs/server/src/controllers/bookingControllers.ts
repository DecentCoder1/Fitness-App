import { Request, Response } from 'express';
import Booking from '../models/bookingModel';
import User from '../models/userModel';

// Get Bookings for a Specific User using user._id
export const getUserBookings = async (req: Request, res: Response) => {
  const { userId } = req.query; // Get userId from the query parameter

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Find bookings by the user _id
    const bookings = await Booking.find({ user: userId }).populate('user', 'fullName email');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error retrieving user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Bookings
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

// Create Booking with validation to prevent double booking at the same time
export const createBooking = async (req: Request, res: Response) => {
  const { userId, date, timeSlot, coachId } = req.body;  // Get coachId from the request body

  if (!userId || !date || !timeSlot || !coachId) {
    return res
      .status(400)
      .json({ error: 'All fields are required: userId, date, timeSlot, and coachId.' });
  }

  try {
    // Check if the user already has a booking for the same date, time slot, and coach
    const existingBooking = await Booking.findOne({
      user: userId,
      date: new Date(date),
      timeSlot: timeSlot,
      coach: coachId,  // Check if a booking exists for the same coach
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: 'You have already booked a slot with this coach for this date and time.' });
    }

    // Create a new booking with the user's ObjectId and the selected coach's ObjectId
    const newBooking = new Booking({
      user: userId,
      coach: coachId,  // Save the selected coach
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