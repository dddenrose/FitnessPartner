"use client";

import React, { useEffect, useState } from "react";
import { Flex, Typography, Progress, Segmented, Tooltip, Badge } from "antd";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  usePoseDetection,
  useBpmCalculation,
  useInactivityDetection,
} from "@/lib/hooks";
import { drawKeypoints, drawSkeleton } from "@/lib/utils/poseDrawing";
import styles from "./styles.module.css";

const { Text, Title } = Typography;

interface BpmDetectorProps {
  isActive: boolean;
  onBpmDetected?: (recentBpm: number, averageBpm: number) => void;
}

const BpmDetector: React.FC<BpmDetectorProps> = ({
  isActive,
  onBpmDetected,
}) => {
  const targetBpm = useAppSelector((state) => state.exercise.bpm);
  const tolerance = 10;
  const [displayMode, setDisplayMode] = useState<"recent" | "average">(
    "recent"
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

  // 運行姿態檢測
  useEffect(() => {
    if (!detector || !videoRef.current || !cameraReady || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let rafId: number;

    async function detectPoseAndCalculateBpm() {
      if (!video || video.paused || video.ended) return;

      try {
        const poses = await detector?.estimatePoses(video);

        // 無論是否有偵測到人物，都要先清除 Canvas
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (poses && poses.length > 0) {
          const pose = poses[0];

          if (canvas && ctx) {
            drawKeypoints(pose.keypoints, ctx);
            drawSkeleton(pose.keypoints, ctx);
          }

          calculateBpm(pose.keypoints, updateActivityTime);
        }
      } catch (err) {
        console.error("Pose detection error:", err);
      }

      rafId = requestAnimationFrame(detectPoseAndCalculateBpm);
    }

    detectPoseAndCalculateBpm();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [
    detector,
    cameraReady,
    isActive,
    calculateBpm,
    updateActivityTime,
    videoRef,
    canvasRef,
  ]);

  // 計算顯示的 BPM 和匹配百分比
  const displayedBpm = displayMode === "recent" ? recentBpm : averageBpm;

  const isInRange = Math.abs(displayedBpm - targetBpm) <= tolerance;

  if (!isActive) return null;

  return (
    <Flex vertical align="center" style={{ marginTop: 20 }}>
      {/* 攝像頭容器 */}
      <div className={styles.cameraContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={640}
          height={480}
        />

        {/* 不活動狀態提示 */}
        {inactivityDetected && (
          <div className={styles.inactivityAlert}>
            <Badge status="warning" />
            <span
              style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
            >
              請增加動作幅度
            </span>
          </div>
        )}

        {/* 目標 BPM 區間指示器 */}
        <Flex
          justify="space-between"
          align="center"
          style={{
            color: "white",
            fontSize: "12px",
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "100%",
            backgroundColor: isInRange
              ? "rgba(82, 196, 26, 0.6)"
              : "rgba(255, 77, 79, 0.6)",
            padding: "8px",
          }}
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
            目標: {targetBpm - tolerance} - {targetBpm + tolerance} BPM
          </div>
        </Flex>

        {/* 錯誤提示 */}
        {error && (
          <div className={styles.errorOverlay}>
            <Text style={{ color: "white" }}>{error}</Text>
          </div>
        )}
      </div>
    </Flex>
  );
};

export default BpmDetector;
