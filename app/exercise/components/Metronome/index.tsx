"use client";

import React from "react";
import { Typography } from "antd";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import { useMetronome } from "@/lib/hooks";
import styles from "./styles.module.css";

const { Text } = Typography;

interface MetronomeProps {
  // 節拍器是否可見
  visible: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({ visible }) => {
  const bpm = useAppSelector((state) => state.exercise.bpm);
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );
  const { flashOn } = useMetronome();

  // 只有當節拍器可見且啟用時才顯示
  if (!visible || !metronomeActive) return null;

  return (
    <div className="text-center">
      <div
        className={styles.flashLight}
        style={{
          backgroundColor: flashOn ? "#ff4d4f" : "#d9d9d9",
          boxShadow: flashOn ? "0 0 20px 5px rgba(255, 77, 79, 0.6)" : "none",
          margin: "0 auto 16px",
        }}
      />
      <Text style={{ color: "white" }}>{bpm} BPM</Text>
    </div>
  );
};

export default Metronome;
