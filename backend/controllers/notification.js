import { validationResult } from 'express-validator';
import Notification from '../models/notification.js';
import { io } from '../socketIO.js';

export async function SendNotification(req, res){
    try{
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({ error: validationResult(req).array() });
        }
        
        const {user, type , text} = req.body;

        Notification.create({
            user: user,
            type: type,
            text: text
        })
        .then(notif => {
            io.emit('addNotification', {
                notification: notif,
              });          
            return res.status(201).json({
                message : `notification sent to ${notif.user}`,
                createdAt : notif.createdAt
            })
        })
        .catch(error => {
            return res.status(500).json({message : error});
        })

    }
    catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAllNotification(req, res){
    try {        
        const userId = req.params.userId;
        const notifications = await Notification.find({ user: userId });

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


// export async function setNotificationAsSeen(req, res){
//     const notificationId = req.params.notificationId; 

//     try {
//         const notification = await Notification.findById(notificationId);

//         if (!notification) {
//             return res.status(404).json({ message: "Notification not found" });
//         }

//         notification.isSeen = true;

//         await notification.save();

//         return res.status(200).json({ message: "Notification marked as seen successfully" });
//     } catch (error) {
//         console.error("Error marking notification as seen:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

export async function SetNotificationsAsSeen(req, res) {
    try {
      const userId = req.params.userId;
  
      const result = await Notification.updateMany(
        { user: userId, isSeen: false },
        { $set: { isSeen: true } }
      );
  
      return res.status(200).json({
        message: `Marked ${result.modifiedCount} notifications as seen for user ${userId}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }