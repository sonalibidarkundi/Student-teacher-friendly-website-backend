import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullname: { type: String, required: true },
  mobile_number: { type: String, required: true },
  address: { type: String, required: true },
  class_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;

