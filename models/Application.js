import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;

