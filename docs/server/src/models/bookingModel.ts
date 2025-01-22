import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
  coach: mongoose.Schema.Types.ObjectId; // Reference to Coach model
  date: Date;
  timeSlot: string;
}

const BookingSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },  // Add coach field
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
