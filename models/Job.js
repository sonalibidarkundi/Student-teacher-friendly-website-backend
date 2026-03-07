import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: String, required: true },
  username: { type: String, required: true }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;

