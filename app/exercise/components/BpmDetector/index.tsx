"use client";

import React, { useState } from "react";
import { Flex, Typography, Segmented, Badge } from "antd";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  usePoseDetection,
  useBpmCalculation,
  useInactivityDetection,
} from "@/lib/hooks";
import { useCanvasOverlay } from "./hooks/useCanvasOverlay";
import styles from "./styles.module.css";

const { Text } = Typography;

const BPM_TOLERANCE = 10;
const BUILD_ID =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev";

interface BpmDetectorProps {
  isActive: boolean;
  onBpmDetected?: (recentBpm: number, averageBpm: number) => void;
}

const BpmDetector: React.FC<BpmDetectorProps> = ({
  isActive,
  onBpmDetected,
}) => {
  const targetBpm = useAppSelector((state) => state.exercise.bpm);
  const [displayMode, setDisplayMode] = useState<"recent" | "average">(
    "recent",
  );

  // 使用自訂 Hooks
  const { videoRef, canvasRef, detector, cameraReady, error } =
    usePoseDetection({ isActive });

  const { recentBpm, averageBpm, calculateBpm } = useBpmCalculation({
    targetBpm,
    onBpmDetected,
  });

  const { inactivityDetected, updateActivityTime } = useInactivityDetection({
    isActive,
  });

  // 骨架繪製與 BPM 計算（rAF 迴圈）
  useCanvasOverlay({
    videoRef,
    canvasRef,
    detector,
    cameraReady,
    isActive,
    calculateBpm,
    updateActivityTime,
  });

  const displayedBpm = displayMode === "recent" ? recentBpm : averageBpm;
  const isInRange = Math.abs(displayedBpm - targetBpm) <= BPM_TOLERANCE;

  if (!isActive) return null;

  return (
    <Flex vertical align="center" style={{ marginTop: 20 }}>
      {/* 攝像頭容器 */}
      <div className={styles.cameraContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline />
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* 不活動狀態提示 */}
        {inactivityDetected && (
          <div className={styles.inactivityAlert}>
            <Badge status="warning" />
            <span className={styles.inactivityAlertText}>請增加動作幅度</span>
          </div>
        )}

        {/* 目標 BPM 區間指示器 */}
        <Flex
          justify="space-between"
          align="center"
          className={`${styles.bpmBar} ${isInRange ? styles.bpmBarInRange : styles.bpmBarOutOfRange}`}
        >
          <Segmented
            value={displayMode}
            onChange={(value) => setDisplayMode(value as "recent" | "average")}
            options={[
              { label: "即時", value: "recent" },
              { label: "平均", value: "average" },
            ]}
          />
          {displayedBpm} BPM
          <div>
            目標: {targetBpm - BPM_TOLERANCE} - {targetBpm + BPM_TOLERANCE} BPM
          </div>
        </Flex>

        {/* 錯誤提示 */}
        {error && (
          <div className={styles.errorOverlay}>
            <Text className={styles.errorText}>{error}</Text>
          </div>
        )}
      </div>

      {/* 版本標記 */}
      <div className={styles.buildId}>{BUILD_ID}</div>
    </Flex>
  );
};

export default BpmDetector;
