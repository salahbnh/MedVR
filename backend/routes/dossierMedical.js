import express from 'express';
import { getMedicalFolder, createMedicalFolder, modifyMedicalFolder, giveMedicalFolderAccess, removeMedicalFolderAccess } from '../controllers/dossierMedical.js';
import { authenticateJWT } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/getMedFolder', authenticateJWT, getMedicalFolder);
router.post('/createMedFolder', authenticateJWT, createMedicalFolder);
router.put('/modifMedFolder', authenticateJWT, modifyMedicalFolder);
router.post('/giveAccess', authenticateJWT, giveMedicalFolderAccess);
router.post('/removeAccess', authenticateJWT, removeMedicalFolderAccess);

export default router;
