import express from 'express';
import { Add, Verify } from '../controllers/payment.js';
import { authenticateJWT } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticateJWT, Add);
router.post('/:id', authenticateJWT, Verify);

export default router;
