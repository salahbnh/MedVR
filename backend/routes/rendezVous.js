import express from 'express';
import { BookRDV, deleteRDV, setRdvFinished, getAllRdvByUserId, SendCodeEmail, CheckRdvStatus } from '../controllers/rendezVous.js';
import { authenticateJWT } from '../middlewares/authenticate.js';
import { validateBookRDV, validateSendCode } from '../middlewares/validatorMiddleware.js';

const router = express.Router();

router.get('/:userId', authenticateJWT, getAllRdvByUserId);
router.post('/bookRDV', authenticateJWT, validateBookRDV, BookRDV);
router.post('/sendCode', authenticateJWT, validateSendCode, SendCodeEmail);
router.delete('/deleteRDV/:rdvId', authenticateJWT, deleteRDV);
router.put('/checkRdvStatus', authenticateJWT, CheckRdvStatus);
router.put('/setRdvFinished/:id', authenticateJWT, setRdvFinished);

export default router;
