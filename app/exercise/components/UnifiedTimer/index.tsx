"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import { Typography, Space, Switch } from "antd";
import { SoundOutlined } from "@ant-design/icons";
import { toggleMetronome } from "@/lib/features/exercise/exerciseSlice";
import styles from "./styles.module.css";

const { Title, Text } = Typography;

interface UnifiedTimerProps {
  exerciseName?: string;
}

const UnifiedTimer: React.FC<UnifiedTimerProps> = ({ exerciseName }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector((state) => state.exercise.workoutType);
  const bpm = useAppSelector((state) => state.exercise.bpm);
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );

  const [elapsedTime, setElapsedTime] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 根據 BPM 計算閃爍間隔（毫秒）
  const flashInterval = 60000 / bpm;

  // 建立閃爍節奏
  useEffect(() => {
    if (workoutType === "slowrun" && metronomeActive && status === "active") {
      const timer = setInterval(() => {
        setFlashOn((prev) => !prev);

        // 播放節拍聲音
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.log("播放聲音失敗:", e));
        }
      }, flashInterval);

      return () => clearInterval(timer);
    }

    return () => {};
  }, [workoutType, metronomeActive, status, flashInterval]);

  // 更新經過的時間
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "active") {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleToggleMetronome = (checked: boolean) => {
    dispatch(toggleMetronome(checked));
  };

  return (
    <div className="flex flex-col items-center">
      {/* 步頻閃爍燈 (僅適用於超慢跑模式) */}
      {workoutType === "slowrun" && (
        <div className="mb-8 text-center">
          <div
            className={styles.flashLight}
            style={{
              backgroundColor: flashOn ? "#ff4d4f" : "#d9d9d9",
              boxShadow: flashOn
                ? "0 0 20px 5px rgba(255, 77, 79, 0.6)"
                : "none",
              margin: "0 auto 16px",
            }}
          />
          <Space>
            <Text style={{ color: "white" }}>節拍器:</Text>
            <Switch
              checked={metronomeActive}
              onChange={handleToggleMetronome}
              checkedChildren={<SoundOutlined />}
              unCheckedChildren={<SoundOutlined />}
            />
            <Text style={{ color: "white" }}>{bpm} BPM</Text>
          </Space>
        </div>
      )}

      {/* 主計時器 - 使用白色大字體 */}
      <div
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          color: "white",
          fontFamily: "monospace",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
};

export default UnifiedTimer;
