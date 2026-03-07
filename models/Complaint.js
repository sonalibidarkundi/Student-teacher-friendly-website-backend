import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;

