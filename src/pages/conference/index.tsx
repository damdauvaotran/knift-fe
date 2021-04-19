import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
// @ts-ignore
import { Player } from "video-react";

import { auth } from "../../utils";
import { withLayout } from "../../shared-component/Layout/Layout";
import { ConferenceRoom } from "../../utils/conferenceRoom";
import Video from "../../shared-component/Video";
import { consumerObs } from "../../ observer/";
import { getUserData } from "../../utils/auth";

const Conference: React.FC = () => {
  const webcamRef = useRef<any>(null);
  const userVideo = useRef<any>(null);
  const socketRef = useRef<any>();
  const conferenceRoomRef = useRef<ConferenceRoom>();
  const remoteStreamListRef = useRef<Map<string, any>>(new Map<string, any>());

  const [remoteStreamList, setRemoteStreamList] = useState<any[]>([]);

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
    // @ts-ignore
    window.x = () => {
      console.log(remoteStreamList);
    };

    consumerObs.subscribe(addConsumer);

    return () => {
      console.log("Conference unmounting");
      consumerObs.unsubscribe(addConsumer);
    };

    // RTC server setup
  }, []);

  const addConsumer = ({
    consumerStream,
    consumerId,
  }: {
    consumerStream: MediaStream;
    consumerId: string;
  }) => {
    const tempRemotes = [...remoteStreamList];
    console.log("temp before", tempRemotes);
    tempRemotes.push(consumerId);
    remoteStreamListRef.current.set(consumerId, consumerStream);
    console.log("temp after", tempRemotes);
    setRemoteStreamList((old) => [...old, consumerId]);
  };

  const handleGetUserMedia = async (stream: MediaStream) => {
    console.log(stream);
    const a = new ConferenceRoom(
      Math.random().toString(),
      "2",
      socketRef.current
    );

    conferenceRoomRef.current = a;
    await a.init();
    await a.produce("videoType", stream);
  };

  useEffect(() => {
    console.log("State remoteStreamList", remoteStreamList);
  }, [remoteStreamList]);

  const { r } = getUserData();
  console.log("r", r);
  return (
    <div>
      <div>
        <Webcam
          audio={true}
          ref={webcamRef}
          onUserMedia={handleGetUserMedia}
          hidden={r === "STUDENT"}
        />
      </div>
      <div id="remote">
        {remoteStreamList.map((consumerId: string) => {
          return (
            <Video
              // @ts-ignore
              className={`${consumerId}`}
              key={`remote_${consumerId}`}
              srcObject={remoteStreamListRef.current.get(consumerId)}
              autoPlay
              playsInline
            />
          );
        })}
      </div>
    </div>
  );
};

export default withLayout("1")(Conference);
