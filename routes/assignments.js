import express from 'express';
import Assignment from '../models/Assignment.js';
import Class from '../models/Class.js';
import auth from '../middleware/auth.js';
import { createAssignmentValidation, mongoIdValidation } from '../middleware/validation.js';

const router = express.Router();

// Get assignments relative to the user
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const assignments = await Assignment.find({ teacherId: req.user.userId }).populate('classId', 'name code').sort({ createdAt: -1 });
      res.json(assignments);
    } else {
      // Find classes student is enrolled in
      const classes = await Class.find({ students: req.user.userId });
      const classIds = classes.map(c => c._id);
      
      const assignments = await Assignment.find({
        $or: [
          { classId: { $in: classIds } },
          { classId: null } // Global assignments
        ]
      }).populate('teacherId', 'name').sort({ createdAt: -1 });
      res.json(assignments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create assignment
router.post('/', auth, createAssignmentValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can create assignments' });

  const { title, description, classId, type, content, deadline } = req.body;

  try {
    const newAssignment = new Assignment({
      title,
      description,
      classId: classId || null,
      teacherId: req.user.userId,
      type,
      content,
      deadline
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single assignment by ID
router.get('/:id', auth, mongoIdValidation, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacherId', 'name')
      .populate('classId', 'name code');

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check authorization
    if (req.user.role === 'student') {
      // Students can only see assignments from their classes or global assignments
      if (assignment.classId) {
        const studentClass = await Class.findOne({
          _id: assignment.classId,
          students: req.user.userId
        });
        if (!studentClass) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }
    } else if (req.user.role === 'teacher') {
      // Teachers can only see their own assignments
      if (assignment.teacherId._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update assignment (Teacher only)
router.put('/:id', auth, mongoIdValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can update assignments' });

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.teacherId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own assignments' });
    }

    const { title, description, deadline, status, content } = req.body;

    if (title) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        return res.status(400).json({ message: 'Deadline cannot be in the past' });
      }
      assignment.deadline = deadline;
    }
    if (status) assignment.status = status;
    if (content) assignment.content = content;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete assignment (Teacher only)
router.delete('/:id', auth, mongoIdValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can delete assignments' });

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.teacherId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own assignments' });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
