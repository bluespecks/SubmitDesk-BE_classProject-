import express from 'express';
import Class from '../models/Class.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { createClassValidation, joinClassValidation, mongoIdValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all classes for the logged in user
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const classes = await Class.find({ teacherId: req.user.userId }).populate('teacherId', 'name email').populate('students', 'name email');
      res.json(classes);
    } else {
      const classes = await Class.find({ students: req.user.userId }).populate('teacherId', 'name email');
      res.json(classes);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new class (Teacher only)
router.post('/', auth, createClassValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can create classes' });

  const { name } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const newClass = new Class({
      name,
      code,
      teacherId: req.user.userId,
      students: []
    });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a class using class code (Student only)
router.post('/join', auth, joinClassValidation, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can join classes' });

  const { code } = req.body;
  try {
    const targetClass = await Class.findOne({ code });
    if (!targetClass) return res.status(404).json({ message: 'Invalid class code' });

    if (targetClass.students.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    targetClass.students.push(req.user.userId);
    await targetClass.save();
    res.json(targetClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class (Teacher only)
router.put('/:id', auth, mongoIdValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can update classes' });

  try {
    const classToUpdate = await Class.findById(req.params.id);
    if (!classToUpdate) return res.status(404).json({ message: 'Class not found' });

    if (classToUpdate.teacherId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own classes' });
    }

    const { name } = req.body;
    if (name) classToUpdate.name = name;

    await classToUpdate.save();
    res.json(classToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class (Teacher only)
router.delete('/:id', auth, mongoIdValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can delete classes' });

  try {
    const classToDelete = await Class.findById(req.params.id);
    if (!classToDelete) return res.status(404).json({ message: 'Class not found' });

    if (classToDelete.teacherId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own classes' });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
