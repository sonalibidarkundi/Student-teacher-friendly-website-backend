import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullname: { type: String, required: true },
  mobile_number: { type: String, required: true },
  address: { type: String, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;

