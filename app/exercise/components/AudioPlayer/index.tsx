import { useAppSelector } from "@/lib/hooks/index";
import React, { useEffect } from "react";
import useSound from "use-sound";
import countDownAudio from "@/app/static/audio/countDownAudio.wav";

const AudioPlayer: React.FC = () => {
  const time = useAppSelector((state) => state.exercise.times);
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );
  const isPause = useAppSelector((state) => state.exercise.pause);

  // 使用 use-sound hook 載入倒數音效
  const [playCountDown, { stop: stopCountDown }] = useSound(countDownAudio, {
    volume: 0.2,
    interrupt: true, // 允許音效中斷並重新開始
  });

  /**
   * 當運動時間<=5秒時撥放音樂
   * 或者，當休息時間<=5秒時撥放音樂
   */
  useEffect(() => {
    const commonLimit =
      isGlobalPlaying && time?.[0]?.name && time.length > 0 && !isPause;

    let shouldPlay = false;

    // 檢查是否應該播放音效
    if (
      commonLimit &&
      time[0].time <= 5 &&
      time[0].time !== 0 &&
      time[0].rest > 5
    ) {
      // 運動倒數最後 5 秒
      shouldPlay = true;
    } else if (commonLimit && time[0].time === 0 && time[0].rest <= 5) {
      // 休息倒數最後 5 秒
      shouldPlay = true;
    } else {
      shouldPlay = false;
    }

    // 根據條件播放或停止音效
    if (shouldPlay) {
      playCountDown();
    } else {
      stopCountDown();
    }

    // 組件卸載時停止音效
    return () => {
      stopCountDown();
    };
  }, [time, isPause, isGlobalPlaying, playCountDown, stopCountDown]);

  // 組件不需要渲染任何內容
  return null;
};

export default AudioPlayer;
