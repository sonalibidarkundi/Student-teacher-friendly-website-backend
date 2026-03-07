import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  file_path: { type: String, required: true },
  file_type: { type: String, required: true }
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
export default File;

