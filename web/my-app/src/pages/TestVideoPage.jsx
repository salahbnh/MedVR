import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function View(){
    const [imageSrc, setImageSrc] = useState(null);
    const socket = useRef(null); 
  
    useEffect(() => {
      socket.current = io('http://localhost:9001'); 
  
      socket.current.on('live_frame', (frameData) => {
        console.log("connected")
        const blob = new Blob([frameData], { type: 'image/png' }); 
        const imageURL = URL.createObjectURL(blob);
  
        setImageSrc(imageURL);
        console.log(imageURL);
  
    });
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  
    //   return () => {
    //     if (socket.current) {
    //       socket.current.disconnect();
    //     }
    //   };
    }, []); 


    useEffect(() => {
      const handleSocketError = (error) => {
        console.error('Socket error:', error);
        setImageSrc(null); 
      };
  
      if (socket.current) {
        socket.current.on('error', handleSocketError);
      }
  
      return () => {
        if (socket.current) {
          socket.current.off('error', handleSocketError);
        }
      };
    }, [socket]); 
  
    return (
      <div>
        {imageSrc && <img src={imageSrc} alt="Scene View" />}
      </div>
    );
  };
  






// import React, { useEffect, useRef } from 'react';
// import { useSocket } from '../context/socketProvider'

// const VideoDisplay = () => {
//   const { socket, me } = useSocket();
//   const videoRef = useRef();

//   useEffect(() => {
//     if (socket) {
//       socket.on('live_frame', frameData => {
//         // Create a blob from the received frame data
//         const blob = new Blob([frameData], { type: 'image/png' });
//         const url = URL.createObjectURL(blob);

//         // Update the source of the video element
//         videoRef.current.src = url;
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('live_frame');
//       }
//     };
//   }, [socket]);

//   return (
//     <div>
//       <h2>Video Display</h2>
//       <video ref={videoRef} autoPlay controls />
//     </div>
//   );
// };

// export default VideoDisplay;
