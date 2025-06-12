import express from 'express';
import {
    addDoctor, addPatient, login, findAllDoctors, getUserById,
    SetProfilePicture, loginWithId, handleForgotPassword, ResetPassword,
    logout, refreshAccessToken, getPatientsByDoctor
} from '../controllers/user.js';
import { authenticateJWT } from '../middlewares/authenticate.js';
import {
    validateLogin, validateRegisterPatient, validateRegisterDoctor,
    validateForgotPassword, validateResetPassword
} from '../middlewares/validatorMiddleware.js';

const router = express.Router();

// auth
router.post('/login', validateLogin, login);
router.post('/logout', authenticateJWT, logout);
router.post('/refresh', refreshAccessToken);

// register
router.post('/register/patient', validateRegisterPatient, addPatient);
router.post('/register/doctor', validateRegisterDoctor, addDoctor);

// password
router.post('/resetPwd', validateForgotPassword, handleForgotPassword);
router.post('/modifPwd', validateResetPassword, ResetPassword);

// users
router.get('/doctors', findAllDoctors);
router.get('/users/:userId', getUserById);
router.get('/loginWithId/:userId', loginWithId);
router.get('/doctor/:doctorId/patients', authenticateJWT, getPatientsByDoctor);

// protected
router.put('/users/:userId', authenticateJWT, SetProfilePicture);

export default router;
