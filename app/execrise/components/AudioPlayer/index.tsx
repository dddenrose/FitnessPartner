import React from "react";

const AudioPlayer: React.FC = () => {
  return (
    <div>
      <audio controls src="/media/cc0-audio/t-rex-roar.mp3"></audio>
    </div>
  );
};

export default AudioPlayer;
