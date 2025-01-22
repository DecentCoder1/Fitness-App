import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  isCoach: boolean;
}

const UserModel: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  isCoach: { type: Boolean, required: true },
});

export default mongoose.model<IUser>('User', UserModel);
