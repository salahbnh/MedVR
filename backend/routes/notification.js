import express from 'express';
import {authenticateJWT} from '../middlewares/authenticate.js'
import {SendNotification, getAllNotification, SetNotificationsAsSeen} from '../controllers/notification.js';

const router = express.Router();

router
    .route('/sendNotification')
    .post(authenticateJWT, SendNotification);
router 
    .route('/setNotification/:userId')
    .put(SetNotificationsAsSeen);
router 
    .route('/getAll/:userId')
    .get(authenticateJWT, getAllNotification);




export default router;