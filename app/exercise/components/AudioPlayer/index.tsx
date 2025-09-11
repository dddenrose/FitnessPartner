import AudioComponent from "@/app/components/AudioPlayer";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

const AudioPlayer: React.FC = () => {
  const time = useAppSelector((state) => state.exercise.times);
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );
  const isPause = useAppSelector((state) => state.exercise.pause);
  const [isPlaying, setIsPlaying] = React.useState(false);

  /**
   * 當運動時間<=5秒時撥放音樂
   * 或者，當休息時間<=5秒時撥放音樂
   */
  React.useEffect(() => {
    const commonLimit =
      isGlobalPlaying && time[0].name && time.length > 0 && !isPause;

    if (
      Boolean(
        commonLimit &&
          time[0].time <= 5 &&
          time[0].time !== 0 &&
          time[0].rest > 5
      )
    ) {
      setIsPlaying(true);
    } else if (commonLimit && time[0].time === 0 && time[0].rest > 5) {
      setIsPlaying(false);
    } else if (commonLimit && time[0].time === 0 && time[0].rest <= 5) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [time, isPause, isGlobalPlaying]);

  return (
    <div style={{ display: "none" }}>
      <AudioComponent isPlaying={isPlaying} />
    </div>
  );
};

export default AudioPlayer;
