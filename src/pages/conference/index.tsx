import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";

import { auth } from "../../utils";
import { withLayout } from "../../shared-component/Layout/Layout";

const Conference: React.FC = () => {
  const webcamRef = useRef<any>(null);
  const userVideo = useRef<any>(null);
  const socketRef = useRef<any>();
  const servers = undefined;

  const [yourID, setYourID] = useState<number>();
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();

  useEffect(() => {
    socketRef.current = io("localhost:8000");

    const token = auth.getUserToken();
    socketRef.current.on("connect", () => {
      socketRef.current.emit("authen", token);
    });

    socketRef.current.on("disconnect", (message: any) => {
      console.error("Socket disconnected: " + message);
    });

    const { id } = auth.getUserData();

    socketRef.current.on("yourId", (id: number) => {
      setYourID(id);
    });

    socketRef.current.on("allUsers", (users: object) => {
      setUsers(users);
    });

    socketRef.current.on("hey", (data: any) => {
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    // RTC server setup
    const localPeerConnection = new RTCPeerConnection(servers);
  }, []);

  const handleGetUserMedia = (stream: MediaStream) => {
    console.log(stream);
  };

  return (
    <div>
      <div>
        <Webcam audio={true} ref={webcamRef} onUserMedia={handleGetUserMedia} />
      </div>
      <div>
        <video
          className="userVideo"
          playsInline
          muted
          ref={userVideo}
          autoPlay
        />
      </div>
    </div>
  );
};

export default withLayout("1")(Conference);
