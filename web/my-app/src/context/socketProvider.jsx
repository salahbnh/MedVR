import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [me, setMe] = useState("");
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState("");
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState("");
	const [notif, setNotif] = useState({});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user') || 'null');
		if (!user) return;

		const SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:9001';
		const newSocket = io(SERVER_URL, { query: { userId: user._id } });

		newSocket.on('connect', () => {
			console.log('Socket connected:', newSocket.id);
		});

		newSocket.emit("userLoggedIn", user._id);

		newSocket.on("me", (id) => setMe(id));

		newSocket.on("callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});

		newSocket.on("addNotification", (data) => {
			setNotif(data);
		});

		setSocket(newSocket);

		return () => newSocket.close();
	}, []);

	const callUser = (id, userVideo, connectionRef, stream) => {
		const peer = new Peer({ initiator: true, trickle: false, stream });
		peer.on("signal", (data) => {
			socket.emit("callUser", { userToCall: id, signalData: data, from: me, name });
		});
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream;
		});
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});
		connectionRef.current = peer;
	};

	const answerCall = (userVideo, connectionRef, stream) => {
		setCallAccepted(true);
		const peer = new Peer({ initiator: false, trickle: false, stream });
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller });
		});
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream;
		});
		peer.signal(callerSignal);
		connectionRef.current = peer;
	};

	const leaveCall = (connectionRef) => {
		setCallEnded(true);
		connectionRef.current.destroy();
	};

	return (
		<SocketContext.Provider value={{ socket, me, receivingCall, callAccepted, callEnded, callUser, answerCall, leaveCall, notif }}>
			{children}
		</SocketContext.Provider>
	);
};
