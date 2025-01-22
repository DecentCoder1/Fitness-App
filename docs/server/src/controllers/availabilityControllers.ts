import { Request, Response } from 'express';
import Availability from '../models/availabilityModel'; // Assuming this is the availability model

// Set Availability
export const setAvailability = async (req: Request, res: Response) => {
  const { coachId, date, timeSlots } = req.body;

  if (!coachId || !date || !timeSlots) {
    return res.status(400).json({ error: 'Coach ID, date, and time slots are required.' });
  }

  try {
    // Create or update availability for the given coach and date
    const availability = await Availability.findOneAndUpdate(
      { coach: coachId, date },
      { timeSlots },
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json({ message: 'Availability set successfully.', availability });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAvailableCoaches = async (req: Request, res: Response) => {
    const { date, timeSlot } = req.query;
  
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and time slot are required.' });
    }
  
    try {
      const availabilities = await Availability.find({
        date: new Date(date as string),
        timeSlots: { $in: [timeSlot] },
      }).populate<{ coach: { _id: string; fullName: string; email: string } }>('coach', 'fullName email');
  
      const coaches = availabilities.map((availability) => ({
        _id: availability.coach._id,
        fullName: availability.coach.fullName,
        email: availability.coach.email,
      }));
  
      res.status(200).json(coaches);
    } catch (error) {
      console.error('Error fetching available coaches:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
