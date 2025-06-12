import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
];

export const validateRegisterPatient = [
    body('fName').trim().isLength({ min: 2, max: 30 }).withMessage('First name must be 2–30 characters'),
    body('lName').trim().isLength({ min: 2, max: 30 }).withMessage('Last name must be 2–30 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('phoneNbr').trim().notEmpty().withMessage('Phone number is required'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
    handleValidationErrors,
];

export const validateRegisterDoctor = [
    body('fName').trim().isLength({ min: 2, max: 30 }).withMessage('First name must be 2–30 characters'),
    body('lName').trim().isLength({ min: 2, max: 30 }).withMessage('Last name must be 2–30 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('phoneNbr').trim().notEmpty().withMessage('Phone number is required'),
    body('specialization').trim().notEmpty().withMessage('Specialization is required'),
    body('yearsOfExperience').isInt({ min: 0, max: 100 }).withMessage('Years of experience must be 0–100'),
    handleValidationErrors,
];

export const validateBookRDV = [
    body('patientId').isMongoId().withMessage('Invalid patient ID'),
    body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
    body('date').isISO8601().withMessage('Invalid date format'),
    handleValidationErrors,
];

export const validateSendCode = [
    body('email').isEmail().withMessage('Invalid email'),
    body('code').notEmpty().withMessage('Code is required'),
    handleValidationErrors,
];

export const validateForgotPassword = [
    body('email').isEmail().withMessage('Invalid email'),
    handleValidationErrors,
];

export const validateResetPassword = [
    body('email').isEmail().withMessage('Invalid email'),
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain uppercase, lowercase, number and special character'),
    handleValidationErrors,
];

export const validateSetAvailability = [
    body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
    body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0–6'),
    body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid start time format (HH:MM)'),
    body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid end time format (HH:MM)'),
    body('slotDurationMinutes').optional().isInt({ min: 10, max: 120 }).withMessage('Slot duration must be 10–120 minutes'),
    handleValidationErrors,
];
