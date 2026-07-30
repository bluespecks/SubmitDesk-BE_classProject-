import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });



export async function seedDatabase() {
  try {
    console.log('Checking database seed requirement...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Provide default teacher
    let teacher = await User.findOne({ email: 'teacher@school.edu' });
    if (!teacher) {
      teacher = new User({
        name: 'Sarah Wilson (Teacher)',
        email: 'teacher@school.edu',
        password,
        role: 'teacher'
      });
      await teacher.save();
      console.log('Seed: Created Teacher (teacher@school.edu / password123)');
    } else {
      console.log('Seed: Teacher already seeded.');
    }

    // Provide default student
    let student = await User.findOne({ email: 'student@school.edu' });
    if (!student) {
      student = new User({
        name: 'Alex Johnson (Student)',
        email: 'student@school.edu',
        password,
        role: 'student'
      });
      await student.save();
      console.log('Seed: Created Student (student@school.edu / password123)');
    } else {
      console.log('Seed: Student already seeded.');
    }

  } catch (error) {
    console.error('Seeding error:', error);
  }
}

