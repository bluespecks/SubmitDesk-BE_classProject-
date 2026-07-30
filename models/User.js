import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  avatar: { type: String }
}, { timestamps: true });

// Pre-save hook to generate avatar URL if name is set but avatar isn't
userSchema.pre('save', function() {
  if (this.name && !this.avatar) {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
  }
});

export default mongoose.model('User', userSchema);
