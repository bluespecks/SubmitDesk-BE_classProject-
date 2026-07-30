import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Optional, can be global if null
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['file', 'mcq'], default: 'file' },
  deadline: { type: Date, required: true },
  points: { type: Number, default: 100 },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  content: { type: mongoose.Schema.Types.Mixed } // Can hold fileUrl or array of questions
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
