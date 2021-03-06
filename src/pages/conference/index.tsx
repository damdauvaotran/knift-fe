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
import {
  Button,
  notification,
  Popconfirm,
  Tooltip,
  Popover,
  Row,
  InputNumber,
  Col,
  Form,
} from "antd";
import { ROLE } from "../../constant";
import { useTranslation } from "react-i18next";
import { endConference } from "../../api/conference";
import { delay } from "../../utils/async";

const Conference: React.FC = () => {
  const socketRef = useRef<any>();
  const conferenceRoomRef = useRef<ConferenceRoom>();
  const remoteStreamListRef = useRef<Map<string, any>>(new Map<string, any>());

  const [remoteStreamList, setRemoteStreamList] = useState<any[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [muted, setMuted] = useState<boolean>(false);
  const [groupCount, setGroupCount] = useState<number>(4);
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);
  const [isGroupDiscussion, setIsGroupDiscussion] = useState<boolean>(false);
  const [groupDiscussInfo, setGroupDiscussInfo] = useState<any[]>([]);
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

    socketRef.current.on("startGroupDiscuss", () => {
      notification.success({ message: t("teacherStartGroupDiscuss") });
      setIsGroupDiscussion(true);
      socketRef.current.emit("getGroup", token);
    });

    socketRef.current.on("newGroup", (data: any) => {
      setGroupDiscussInfo(data);
    });

    socketRef.current.on("endGroupDiscuss", () => {
      notification.success({ message: t("groupDiscussionOver") });
      setIsGroupDiscussion(false);
    });

    socketRef.current.on("closeConference", async () => {
      notification.open({ message: t("returnToMainPage") });
      await delay(1000);
      // @ts-ignore
      history.goBack();
    });

    consumerObs.subscribe(addConsumer);
    closeConsumerObs.subscribe(removeConsumer);

    // @ts-ignore
    window.x = () => {
      console.log(remoteStreamListRef.current);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(async (stream: MediaStream) => {
        setLocalStream(stream);
        await handleGetUserMedia(stream);

        socketRef.current.emit("getRoomInfo", (data: any) => {
          console.log("Room info", data);
          setIsGroupDiscussion(data?.isGroupDiscussion);
        });
      });

    return () => {
      console.log("Conference unmounting");
      consumerObs.unsubscribe(addConsumer);
      closeConsumerObs.unsubscribe(removeConsumer);
      conferenceRoomRef?.current?.producerTransport?.close();
      conferenceRoomRef?.current?.consumerTransport?.close();
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
    console.log("adding consumer", consumer);
    remoteStreamListRef.current.set(consumer.id, {
      stream: consumerStream,
      consumer: consumer,
    });
    setRemoteStreamList((old) => [
      ...old,
      {
        stream: consumerStream,
        consumer: consumer,
      },
    ]);
  };

  const removeConsumer = ({ consumerId }: { consumerId: string }) => {
    remoteStreamListRef.current.delete(consumerId);
    setRemoteStreamList((old) =>
      old.filter((cs: any) => cs.consumer.id !== consumerId)
    );
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

  const toggleGroupDiscussion = () => {
    if (isGroupDiscussion) {
      closeGroupDiscuss();
    } else {
      startGroupDiscuss();
    }
    setIsGroupDiscussion(!isGroupDiscussion);
  };

  const startGroupDiscuss = () => {
    console.log(`start with ${groupCount} member`);
    socketRef.current.emit(
      "groupDiscuss",
      { count: groupCount },
      (data: any) => {
        console.log(data);
      }
    );
  };

  const closeGroupDiscuss = () => {
    socketRef.current.emit("closeGroupDiscuss");
  };

  const endCall = async () => {
    if (role === ROLE.teacher) {
      await endConference(conferenceId);
      socketRef.current.emit("endCall");
    }
    // @ts-ignore
    await history.goBack();
  };

  const renderGroupDiscussSetting = () => {
    return (
      <div>
        <Row>
          <Form.Item label={t("memberCount")}>
            <InputNumber value={groupCount} onChange={setGroupCount} />
          </Form.Item>
        </Row>
        <Row>
          <Col offset={12}>
            <Form.Item>
              <Button type="primary" onClick={startGroupDiscuss}>
                {t("start")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
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
        {isGroupDiscussion ? (
          <div className="remote">
            {remoteStreamList
              .filter((consumerStream: any) => {
                return groupDiscussInfo
                  .map((discussInfo: any) => discussInfo.userId)
                  .includes(consumerStream.consumer.appData.userId);
              })
              .map((consumerStream: any) => {
                return (
                  <div
                    className="peer-wrapper"
                    key={`remote_${consumerStream}`}
                  >
                    <Video
                      // @ts-ignore
                      className="remote-video peer-video"
                      srcObject={consumerStream.stream}
                      autoPlay
                      width={320}
                      height={240}
                    />
                    <div className="peer-name">
                      {consumerStream.consumer?.appData?.name}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="remote">
            {remoteStreamList.map((consumerStream: any) => {
              return (
                <div className="peer-wrapper" key={`remote_${consumerStream}`}>
                  <Video
                    // @ts-ignore
                    className="remote-video peer-video"
                    srcObject={consumerStream.stream}
                    autoPlay
                    width={320}
                    height={240}
                  />
                  <div className="peer-name">
                    {consumerStream.consumer?.appData?.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="conf-util">
        <Tooltip title={t("audio")}>
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={toggleMute}
          />
        </Tooltip>
        <Tooltip title={t("shareScreen")}>
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={<DesktopOutlined />}
            onClick={() => {
              setIsShareScreen(true);
            }}
          />
        </Tooltip>

        {role === ROLE.teacher && !isGroupDiscussion && (
          <Tooltip title={t("groupDiscuss")}>
            <Popover content={renderGroupDiscussSetting()} trigger="click">
              <Button
                type="primary"
                size="large"
                shape="circle"
                icon={<TeamOutlined />}
              />
            </Popover>
          </Tooltip>
        )}

        {role === ROLE.teacher && isGroupDiscussion && (
          <Tooltip title={t("groupDiscuss")}>
            <Button
              type="primary"
              danger
              size="large"
              shape="circle"
              onClick={closeGroupDiscuss}
              icon={<TeamOutlined />}
            />
          </Tooltip>
        )}
        {role === ROLE.teacher && (
          <Popconfirm
            title={t("areYouSureEndConference")}
            onConfirm={() => endCall()}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title={t("end")}>
              <Button
                type="primary"
                size="large"
                danger
                shape="circle"
                icon={<PhoneOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        )}
      </div>
    </div>
  );
};

export default Conference;
