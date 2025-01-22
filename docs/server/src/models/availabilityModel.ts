import mongoose, { Schema, Document } from 'mongoose';

interface IAvailability extends Document {
  coach: mongoose.Schema.Types.ObjectId;
  date: Date;
  timeSlots: string[];
}

const AvailabilitySchema: Schema = new Schema({
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlots: { type: [String], required: true },
});

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);
