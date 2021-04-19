import { VideoHTMLAttributes, useEffect, useRef } from "react";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};
const Video = ({ srcObject, ...props }: PropsType) => {
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
    console.log("srcObject updated");
  }, [srcObject]);

  useEffect(() => {
    return () => {
      console.log("Video unmounting");
    };
  }, []);

  return <video ref={refVideo} {...props} />;
};

export default Video;
