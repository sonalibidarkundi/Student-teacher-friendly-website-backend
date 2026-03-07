import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  image: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

