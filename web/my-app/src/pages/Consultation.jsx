// Consultation.jsx

import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "../api/axios";
import { useSocket } from "../context/socketProvider";

export default function Consultation() {
  const accessToken = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const { me, receivingCall, callAccepted, callEnded, callUser, answerCall, leaveCall } = useSocket();

  const username = user.fName + user.lName;

  const [name, setName] = useState("");
  const [stream, setStream] = useState();
  const [idToCall, setIdToCall] = useState("");
  const [copiedtext, setCopiedText] = useState("");
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      userVideo.current.srcObject = stream;
    });
  }, []);

  const handleCopy = async () => {
    setCopiedText(me);
    alert("ID copied!", me);
    try {
      const response = axios.post(
        "/rendezVous/sendCode",
        JSON.stringify({
          email: "salah.bounouh420@gmail.com",
          code: me,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <h1 className="text-4xl font-mono font-bold text-blue-950 py-12">Video Consultation</h1>
        <div style={{ display: "flex", marginTop: "10px", marginLeft: "10px", width: "85%" }}>
          <div className="video" style={{ width: "100%" }}>
            {stream && <video playsInline muted ref={userVideo} autoPlay style={{ width: "100%" }} />}
          </div>
          <div className="video" style={{ width: "20%" }}>
            {callAccepted && !callEnded ? <video playsInline ref={userVideo} autoPlay style={{ width: "100%" }} /> : null}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="bg-gray-400">
              <h1>{name} is calling...</h1>
              <button className="bg-blue-700" onClick={() => answerCall(userVideo, connectionRef, stream)}>
                Answer
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div
        style={{
          marginTop: "100opx",
          marginRight: "5rem",
          borderRadius: "5px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          id="filled-basic"
          label="ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          className="bg-gray-200"
        />
        <input id="filled-basic" label="Name" value={username} className="bg-gray-200 mb-3" style={{ display: "none" }} />
        <CopyToClipboard text={me} onCopy={handleCopy} style={{ marginBottom: "2rem" }}>
          <button className="font-mono bg-blue-500">Copy ID</button>
        </CopyToClipboard>

        <div className="call-button">
          {callAccepted && !callEnded ? (
            <button className="bg-red-500" onClick={() => leaveCall(connectionRef)}>
              End Call
            </button>
          ) : (
            <button
              className="bg-blue-700 mt-2"
              aria-label="call"
              onClick={() => {
                if (idToCall) {
                  console.log("Calling user with ID:", idToCall);
                  callUser(idToCall, userVideo, connectionRef, stream);
                } else {
                  console.log("ID to call is not set.");
                }
              }}
            >
              phone icon
            </button>
          )}
          {idToCall}
        </div>
      </div>
    </div>
  );
}
