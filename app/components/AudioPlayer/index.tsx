import countDownAudio from "@/app/static/audio/countDownAudio.wav";
import React from "react";

const AudioPlayer: React.FC<{
  isPlaying: boolean;
}> = ({ isPlaying }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  /**
   * when isPlaying is true, play the audio
   * when isPlaying is false, pause the audio and restart it
   */
  React.useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div>
      <audio ref={audioRef} controls src={countDownAudio}></audio>
    </div>
  );
};

export default AudioPlayer;
