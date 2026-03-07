import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
export default Class;

