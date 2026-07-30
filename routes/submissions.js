import express from 'express';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { createSubmissionValidation, gradeSubmissionValidation, mongoIdValidation } from '../middleware/validation.js';

const router = express.Router();

// Get submissions (Teachers get for their assignments, students get their own)
router.get('/', auth, async (req, res) => {
  try {
    const { assignmentId } = req.query;
    let filter = {};
    if (assignmentId) filter.assignmentId = assignmentId;

    if (req.user.role === 'teacher') {
      // For now, allow teacher to see submissions for specified assignment
      const submissions = await Submission.find(filter).populate('studentId', 'name email').populate('assignmentId', 'title type');
      res.json(submissions);
    } else {
      filter.studentId = req.user.userId;
      const submissions = await Submission.find(filter).populate('assignmentId', 'title type');
      res.json(submissions);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a submission (Student only)
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can submit assignments' });

  try {
    const { assignmentId, content } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    let grade = null;
    let status = 'submitted';
    let feedback = null;
    let submissionContent;

    // Handle file upload
    if (assignment.type === 'file') {
      if (!req.file) {
        return res.status(400).json({ message: 'File is required for file-type assignments' });
      }
      submissionContent = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    // Handle MCQ submission
    else if (assignment.type === 'mcq') {
      const answers = JSON.parse(content);
      if (!Array.isArray(answers)) {
        return res.status(400).json({ message: 'MCQ answers must be an array' });
      }

      // Auto-grade MCQ
      if (Array.isArray(assignment.content)) {
        let correctCount = 0;
        assignment.content.forEach((q, index) => {
          if (answers[index] === q.correctOption) {
            correctCount++;
          }
        });
        grade = Math.round((correctCount / assignment.content.length) * 100);
        status = 'graded';
        feedback = 'Auto-graded';
      }
      submissionContent = answers;
    }

    const submission = new Submission({
      assignmentId,
      studentId: req.user.userId,
      content: submissionContent,
      status,
      grade,
      feedback
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Teacher grades a submission
router.put('/:id/grade', auth, gradeSubmissionValidation, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can grade' });

  const { grade, feedback } = req.body;

  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    await submission.save();
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download submitted file
router.get('/:id/download', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Check authorization
    if (req.user.role === 'student' && submission.studentId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (typeof submission.content === 'object' && submission.content.path) {
      res.download(submission.content.path, submission.content.originalName);
    } else {
      res.status(404).json({ message: 'No file found for this submission' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
