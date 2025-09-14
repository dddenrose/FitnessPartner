"use client";

import { useEffect, useCallback } from "react";
import useSound from "use-sound";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import countDownAudio from "@/app/static/audio/countDownAudio.wav";

interface CountdownSoundOptions {
  /** 音量 (0-1) */
  volume?: number;
  /** 是否自動播放 (根據時間狀態) */
  autoPlay?: boolean;
  /** 運動倒數時間閾值 (秒) */
  exerciseThreshold?: number;
  /** 休息倒數時間閾值 (秒) */
  restThreshold?: number;
}

/**
 * 自訂 Hook，用於處理倒計時音效
 *
 * 根據運動與休息狀態自動播放音效，可自定義行為
 *
 * @example
 * // 基本用法 - 自動播放
 * useCountdownSound();
 *
 * @example
 * // 自定義配置
 * const { playCountDown } = useCountdownSound({
 *   volume: 0.5,
 *   autoPlay: false
 * });
 *
 * // 手動播放
 * playCountDown();
 */
export function useCountdownSound(options: CountdownSoundOptions = {}) {
  const {
    volume = 0.2,
    autoPlay = true,
    exerciseThreshold = 5,
    restThreshold = 5,
  } = options;

  const time = useSelector((state: RootState) => state.exercise.times);
  const isGlobalPlaying = useSelector(
    (state: RootState) => state.audio.isGlobalPlaying
  );
  const isPause = useSelector((state: RootState) => state.exercise.pause);

  // 使用 use-sound hook 載入倒數音效
  const [playCountDown, { stop: stopCountDown }] = useSound(countDownAudio, {
    volume,
    interrupt: true, // 允許音效中斷並重新開始
    soundEnabled: isGlobalPlaying, // 遵循全局靜音設置
  });

  /**
   * 檢查是否應該播放音效
   */
  const shouldPlaySound = useCallback(() => {
    // 基本條件：全局未靜音、有運動數據、未暫停
    if (!isGlobalPlaying || !time?.[0] || !time.length || isPause) {
      return false;
    }

    // 運動倒數
    if (
      time[0].time > 0 &&
      time[0].time <= exerciseThreshold &&
      time[0].time !== 0
    ) {
      return true;
    }

    // 休息倒數
    if (
      time[0].time === 0 &&
      time[0].rest <= restThreshold &&
      time[0].rest > 0
    ) {
      return true;
    }

    return false;
  }, [time, isPause, isGlobalPlaying, exerciseThreshold, restThreshold]);

  /**
   * 根據運動狀態自動播放音效
   */
  useEffect(() => {
    // 如果不需要自動播放，則跳過此邏輯
    if (!autoPlay) return;

    const shouldPlay = shouldPlaySound();

    if (shouldPlay) {
      playCountDown();
    } else {
      stopCountDown();
    }

    // 組件卸載時停止音效
    return () => {
      stopCountDown();
    };
  }, [
    time,
    isPause,
    isGlobalPlaying,
    autoPlay,
    playCountDown,
    stopCountDown,
    shouldPlaySound,
  ]);

  /**
   * 返回控制函數與狀態，方便外部控制和檢查
   */
  return {
    // 控制函數
    playCountDown,
    stopCountDown,

    // 狀態
    shouldPlaySound: shouldPlaySound(),
    isMuted: !isGlobalPlaying,

    // 當前運動資訊
    currentTime: time?.[0]?.time,
    isResting: time?.[0]?.time === 0,
    restTime: time?.[0]?.rest,
  };
}
