import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  isCoach: boolean;
  bookings: mongoose.Schema.Types.ObjectId[]; // Array of Booking references
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  isCoach: { type: Boolean, required: true },
});

// Virtual field to populate bookings
UserSchema.virtual('bookings', {
  ref: 'Booking', // Name of the Booking model
  localField: '_id', // Field in User schema
  foreignField: 'user', // Field in Booking schema
});

// Ensure virtuals are included in JSON and objects
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IUser>('User', UserSchema);
