import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import classesRoutes from './routes/classes.js';
import assignmentsRoutes from './routes/assignments.js';
import submissionsRoutes from './routes/submissions.js';
import statsRoutes from './routes/stats.js';
import dotenv from 'dotenv';
dotenv.config();

import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './scripts/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    let mongoURL = process.env.MONGO_URL;

    if (!mongoURL || mongoURL.includes('localhost') || mongoURL === '') {
      console.log('No external MONGO_URL detected. Launching in-memory MongoDB for testing...');
      const mongoServer = await MongoMemoryServer.create();
      mongoURL = mongoServer.getUri();
    }

    await mongoose.connect(mongoURL);
    console.log('MongoDB successfully connected!');
    
    // Automatically execute seeding ensuring login details work
    await seedDatabase();

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/stats', statsRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets from the React 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - catch all non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

const port = process.env.PORT || 5176;
app.listen(port, () => {
  console.log(`Server is running natively and serving frontend on port ${port}`);
});