import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
// @ts-ignore
import { Player } from "video-react";
import {
  AudioMutedOutlined,
  AudioOutlined,
  DesktopOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import { auth } from "../../utils";
import { ConferenceRoom } from "../../utils/conferenceRoom";
import Video from "../../shared-component/Video";
import { consumerObs, closeConsumerObs } from "../../ observer/";
import { getUserData } from "../../utils/auth";
import "./conference.scss";
import { Button, Popconfirm, Tooltip } from "antd";
import { ROLE } from "../../constant";
import { useTranslation } from "react-i18next";
import { endConference } from "../../api/conference";

const Conference: React.FC = () => {
  const socketRef = useRef<any>();
  const conferenceRoomRef = useRef<ConferenceRoom>();
  const remoteStreamListRef = useRef<Map<string, any>>(new Map<string, any>());

  const [remoteStreamList, setRemoteStreamList] = useState<any[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [muted, setMuted] = useState<boolean>(false);
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);

  // @ts-ignore
  const { id: conferenceId } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const { role, id: userId, displayName } = getUserData();
  useEffect(() => {
    socketRef.current = io("localhost:8000");

    const token = auth.getUserToken();
    socketRef.current.on("connect", () => {
      socketRef.current.emit("authen", token);
    });

    socketRef.current.on("disconnect", (message: any) => {
      console.error("Socket disconnected: " + message);
    });

    consumerObs.subscribe(addConsumer);
    closeConsumerObs.subscribe(removeConsumer);

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(async (stream: MediaStream) => {
        setLocalStream(stream);
        await handleGetUserMedia(stream);
      });

    return () => {
      console.log("Conference unmounting");
      consumerObs.unsubscribe(addConsumer);
      closeConsumerObs.unsubscribe(removeConsumer);
    };

    // RTC server setup
  }, []);

  useEffect(() => {
    if (conferenceRoomRef.current) {
      const { id } = getUserData();
      conferenceRoomRef.current?.closeProducer("videoType");
      conferenceRoomRef.current.produce("videoType", localStream, id);
    }
  }, [localStream]);

  useEffect(() => {
    if (isShareScreen) {
      handleShareScreen();
    } else {
      handleVideoCall();
    }
  }, [isShareScreen]);

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

  const handleVideoCall = async () => {
    // @ts-ignore
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);
  };

  const addConsumer = ({
    consumerStream,
    consumer,
  }: {
    consumerStream: MediaStream;
    consumer: any;
  }) => {
    console.log("Update remote video list", consumer);

    remoteStreamListRef.current.set(consumer.id, {
      stream: consumerStream,
      consumer: consumer,
    });
    setRemoteStreamList((old) => [...old, consumer.id]);
  };

  const removeConsumer = ({ consumerId }: { consumerId: string }) => {
    console.log("removing ", consumerId);
    remoteStreamListRef.current.delete(consumerId);
    setRemoteStreamList((old) => old.filter((csId) => csId !== consumerId));
  };

  const handleGetUserMedia = async (stream: MediaStream) => {
    const a = new ConferenceRoom(
      conferenceId.toString(),
      conferenceId.toString(),
      socketRef.current
    );

    conferenceRoomRef.current = a;
    await a.init();
    const { id } = getUserData();
    await a.produce("videoType", stream, id);
  };

  const toggleMute = () => {
    if (localStream.getAudioTracks()[0]) {
      localStream.getAudioTracks()[0].enabled = muted;
    }
    setMuted(!muted);
  };

  const startGroupDiscuss = () => {
    socketRef.current.emit("groupDiscuss", {}, (data: any) => {
      console.log(data);
    });
  };

  const endCall = async () => {
    if (role === ROLE.teacher) {
      await endConference(conferenceId);
    }
    // @ts-ignore
    history.goBack();
  };

  return (
    <div className="conf-wrapper">
      <div className="local-cam-wrapper">
        <div className="peer-wrapper">
          <Video
            // @ts-ignore
            srcObject={localStream}
            autoPlay
            playsInline
            width={320}
            height={240}
            muted
            className="peer-video"
          />
          <div className="peer-name">{displayName}</div>
        </div>
      </div>
      <div className="remote-wrapper">
        <div className="remote">
          {remoteStreamList.map((consumerId: string) => {
            return (
              <div className="peer-wrapper" key={`remote_${consumerId}`}>
                <Video
                  // @ts-ignore
                  className="remote-video peer-video"
                  srcObject={remoteStreamListRef.current.get(consumerId).stream}
                  autoPlay
                  width={320}
                  height={240}
                />
                <div className="peer-name">
                  {
                    remoteStreamListRef.current.get(consumerId).consumer
                      ?.appData?.name
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="conf-util">
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
          onClick={toggleMute}
        />
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<DesktopOutlined />}
          onClick={() => {
            setIsShareScreen(true);
          }}
        />
        {role === ROLE.teacher && (
          <Button
            type="primary"
            size="large"
            shape="circle"
            onClick={startGroupDiscuss}
            icon={<TeamOutlined />}
          />
        )}
        <Popconfirm
          title={t("areYouSureEndConference")}
          onConfirm={() => endCall()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            size="large"
            danger
            shape="circle"
            icon={<PhoneOutlined />}
          />
        </Popconfirm>
      </div>
    </div>
  );
};

export default Conference;
