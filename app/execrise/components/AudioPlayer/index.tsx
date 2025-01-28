import React from "react";
import countDownAudio from "@/app/static/audio/countDownAudio.wav";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/lib/hooks";
import AudioComponent from "@/app/components/AudioPlayer";
import { CiOutlined } from "@ant-design/icons";

const AudioPlayer: React.FC = () => {
  const time = useAppSelector((state) => state.execrise.time);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (Boolean(time.length > 0 && time[0].name && time[0].time <= 5)) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [time]);

  return (
    <div style={{ display: "none" }}>
      <AudioComponent isPlaying={isPlaying} />
    </div>
  );
};

export default AudioPlayer;
