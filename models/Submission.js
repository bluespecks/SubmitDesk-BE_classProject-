import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
  grade: { type: Number, default: null },
  feedback: { type: String, default: null },
  content: { type: mongoose.Schema.Types.Mixed }, // answers or fileUrl
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
