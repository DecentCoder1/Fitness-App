import express, { Request, Response } from 'express';

const router = express.Router();

// Booking Route
router.post('/', (req: Request, res: Response) => {
  const { email, date, timeSlot } = req.body;

  if (!email || !date || !timeSlot) {
    return res.status(400).json({ error: 'All fields are required: email, date, and timeSlot.' });
  }

  console.log(`Booking received:
  - Email: ${email}
  - Date: ${date}
  - Time Slot: ${timeSlot}`);

  res.status(200).json({ message: 'Booking successfully logged.' });
});

router.get('/', (req: Request, res: Response) => {
  
  res.status(200).json({ message: 'Booking successfully logged.' });
});

export default router;
