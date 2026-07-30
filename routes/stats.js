import express from 'express';
import Class from '../models/Class.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get teacher statistics
router.get('/teacher', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can access these stats' });
  }

  try {
    // Get all classes for this teacher
    const classes = await Class.find({ teacherId: req.user.userId });

    // Calculate unique students across all classes
    const uniqueStudents = new Set();
    classes.forEach(c => {
      c.students.forEach(s => uniqueStudents.add(s.toString()));
    });

    // Get all assignments for this teacher
    const assignments = await Assignment.find({ teacherId: req.user.userId });
    const assignmentIds = assignments.map(a => a._id);

    // Get all submissions for teacher's assignments
    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds }
    });

    // Calculate stats
    const totalAssignments = assignments.length;
    const pendingGrading = submissions.filter(s => s.status === 'submitted').length;
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.grade !== null);

    let averageScore = 0;
    if (gradedSubmissions.length > 0) {
      const totalScore = gradedSubmissions.reduce((sum, s) => sum + (Number(s.grade) || 0), 0);
      averageScore = Math.round(totalScore / gradedSubmissions.length);
    }

    res.json({
      totalStudents: uniqueStudents.size,
      totalAssignments,
      pendingGrading,
      averageScore,
      totalClasses: classes.length,
      totalSubmissions: submissions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics data for charts
router.get('/analytics', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can access analytics' });
  }

  try {
    // Get all assignments for this teacher
    const assignments = await Assignment.find({ teacherId: req.user.userId });
    const assignmentIds = assignments.map(a => a._id);

    // Get all submissions for teacher's assignments
    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds }
    }).populate('assignmentId', 'title');

    // Grade Distribution (0-20, 21-40, 41-60, 61-80, 81-100)
    const gradeRanges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    const gradedSubmissions = submissions.filter(s => s.grade !== null);
    gradedSubmissions.forEach(s => {
      const grade = s.grade;
      if (grade <= 20) gradeRanges['0-20']++;
      else if (grade <= 40) gradeRanges['21-40']++;
      else if (grade <= 60) gradeRanges['41-60']++;
      else if (grade <= 80) gradeRanges['61-80']++;
      else gradeRanges['81-100']++;
    });

    // Completion Rate per Assignment
    const completionRates = [];
    for (const assignment of assignments) {
      const assignmentSubmissions = submissions.filter(
        s => s.assignmentId._id.toString() === assignment._id.toString()
      );

      completionRates.push({
        assignmentTitle: assignment.title,
        submitted: assignmentSubmissions.length,
        graded: assignmentSubmissions.filter(s => s.status === 'graded').length
      });
    }

    // Average Score per Assignment
    const assignmentScores = [];
    for (const assignment of assignments) {
      const assignmentSubmissions = submissions.filter(
        s => s.assignmentId._id.toString() === assignment._id.toString() && s.grade !== null
      );

      if (assignmentSubmissions.length > 0) {
        const avgScore = Math.round(
          assignmentSubmissions.reduce((sum, s) => sum + s.grade, 0) / assignmentSubmissions.length
        );
        assignmentScores.push({
          assignmentTitle: assignment.title,
          averageScore: avgScore,
          submissionCount: assignmentSubmissions.length
        });
      }
    }

    // Submission Timeline (last 7 days)
    const today = new Date();
    const submissionTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = submissions.filter(s => {
        const subDate = new Date(s.submittedAt);
        return subDate >= date && subDate < nextDate;
      }).length;

      submissionTimeline.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    res.json({
      gradeDistribution: gradeRanges,
      completionRates: completionRates.slice(0, 10), // Top 10 assignments
      assignmentScores: assignmentScores.slice(0, 10), // Top 10 assignments
      submissionTimeline,
      totalGradedSubmissions: gradedSubmissions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
