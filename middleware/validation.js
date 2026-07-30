import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Role must be student or teacher'),
  validate
];

// Class validations
export const createClassValidation = [
  body('name').trim().notEmpty().withMessage('Class name is required').isLength({ min: 3, max: 100 }).withMessage('Class name must be 3-100 characters'),
  validate
];

export const joinClassValidation = [
  body('code').trim().notEmpty().withMessage('Class code is required').isLength({ min: 6, max: 6 }).withMessage('Class code must be 6 characters').isAlphanumeric().withMessage('Class code must be alphanumeric'),
  validate
];

// Assignment validations
export const createAssignmentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('classId').optional().isMongoId().withMessage('Invalid class ID'),
  body('type').isIn(['file', 'mcq']).withMessage('Type must be file or mcq'),
  body('content').optional(),
  body('deadline').isISO8601().withMessage('Valid deadline date is required').custom((value) => {
    const deadline = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      throw new Error('Deadline cannot be in the past');
    }
    return true;
  }),
  validate
];

// Submission validations
export const createSubmissionValidation = [
  body('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
  body('content').optional(),
  validate
];

export const gradeSubmissionValidation = [
  param('id').isMongoId().withMessage('Valid submission ID is required'),
  body('grade').isInt({ min: 0, max: 100 }).withMessage('Grade must be between 0 and 100'),
  body('feedback').optional().isLength({ max: 1000 }).withMessage('Feedback must be less than 1000 characters'),
  validate
];

// ID parameter validation
export const mongoIdValidation = [
  param('id').isMongoId().withMessage('Valid ID is required'),
  validate
];
