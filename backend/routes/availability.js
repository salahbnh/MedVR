import express from 'express';
import { setAvailability, getDoctorAvailability, getAvailableSlots, deleteAvailability } from '../controllers/availability.js';
import { authenticateJWT } from '../middlewares/authenticate.js';
import { validateSetAvailability } from '../middlewares/validatorMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, validateSetAvailability, setAvailability);
router.get('/slots/available', getAvailableSlots);
router.get('/:doctorId', getDoctorAvailability);
router.delete('/', authenticateJWT, deleteAvailability);

export default router;
