import React, { useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    
    useEffect(() => {
    const socket = socketIOClient('http://localhost:9001');

    // Listen for live frame updates
    socket.on('live_frame', (frameData) => {
      const blob = new Blob([frameData], { type: 'image/jpeg' });
      const objectURL = URL.createObjectURL(blob);
      
      // Update video source  
      videoRef.current.src = objectURL;
    });

    return () => {
      // Clean up socket connection
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Live Video Stream</h1>
      <video ref={videoRef} controls autoPlay width="auto" height="auto">
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
