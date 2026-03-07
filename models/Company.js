import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '/uploads/default-logo.png' },
  username: { type: String, required: true }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;

