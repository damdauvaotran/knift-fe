import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
// @ts-ignore
import { Player } from "video-react";
import {
  AudioMutedOutlined,
  DesktopOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { auth } from "../../utils";
import { withLayout } from "../../shared-component/Layout/Layout";
import { ConferenceRoom } from "../../utils/conferenceRoom";
import Video from "../../shared-component/Video";
import { consumerObs } from "../../ observer/";
import { getUserData } from "../../utils/auth";
import "./conference.scss";
import { Button, Tooltip } from "antd";

const Conference: React.FC = () => {
  const socketRef = useRef<any>();
  const conferenceRoomRef = useRef<ConferenceRoom>();
  const remoteStreamListRef = useRef<Map<string, any>>(new Map<string, any>());

  const [remoteStreamList, setRemoteStreamList] = useState<any[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [yourID, setYourID] = useState<number>();
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);

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

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(async (stream: MediaStream) => {
        setLocalStream(stream);
        await handleGetUserMedia(stream);
      });

    return () => {
      console.log("Conference unmounting");
      consumerObs.unsubscribe(addConsumer);
    };

    // RTC server setup
  }, []);

  useEffect(() => {
    console.log("local stream", localStream);
  }, [localStream]);

  useEffect(() => {
    console.log("State remoteStreamList", remoteStreamList);
  }, [remoteStreamList]);

  const handleShareScreen = async () => {
    // @ts-ignore
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);
  };

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

  const { r } = getUserData();
  console.log("r", r);
  return (
    <div className="conf-wrapper">
      <div className="local-cam-wrapper">
        <Video
          // @ts-ignore
          srcObject={localStream}
          autoPlay
          playsInline
          width={320}
          height={240}
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
      <div className="conf-util">
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<AudioMutedOutlined />}
        />
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<DesktopOutlined />}
        />
        <Button
          type="primary"
          size="large"
          danger
          shape="circle"
          icon={<PhoneOutlined />}
        />
      </div>
    </div>
  );
};

export default Conference;
