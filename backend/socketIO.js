import { Server } from 'socket.io';
import Notification from './models/notification.js';

export let io; 

export async function AttachIoToServer(server){
    
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    
    
    io.on('connection', (socket) => {
      console.log('A user connected');
      
      socket.emit("me", socket.id);
      
      socket.on('live_frame', (frameData) => {
        console.log('Received frame:', frameData);
        socket.broadcast.emit('live_frame', frameData);
      });
    
      socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.broadcast.emit("callEnded");
      });
      
      
      socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name})
      })
    
    
      socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
      })
    
      socket.on("userLoggedIn", async (userId) => {
        try {
          const unseenNotifications = await Notification.find({ user: userId, isSeen: false });
  
          socket.emit("unseenNotifications", unseenNotifications );
          
        
        } catch (error) {
          console.error("Error fetching or updating notifications:", error);
        }
      });

    });
}
