import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsers extends Document {
  email: string;
  name: string;
  password: string;
  // …other fields
}

const userSchema = new Schema<IUsers>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // …other fields
});

// Use existing model if it’s already been compiled, otherwise compile a new one
const Users: Model<IUsers> =
  mongoose.models.Users ||
  mongoose.model<IUsers>('Users', userSchema);

export default Users;
