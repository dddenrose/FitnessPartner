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
import {
  calculateRotationAngle,
  getRotatedCanvasSize,
  applyCanvasRotation,
} from "@/lib/utils/canvasRotation";
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

  // 增加一個穩定旋轉角度的 state，避免每幀計算
  const [stableRotation, setStableRotation] = useState(0);

  // 監聽螢幕旋轉與攝像頭準備狀態
  useEffect(() => {
    if (!isActive || !videoRef.current || !cameraReady) return;

    const updateRotation = () => {
      if (videoRef.current) {
        setStableRotation(calculateRotationAngle(videoRef.current));
      }
    };

    window.addEventListener("orientationchange", updateRotation);
    videoRef.current.addEventListener("loadedmetadata", updateRotation);
    updateRotation();

    return () => {
      window.removeEventListener("orientationchange", updateRotation);
    };
  }, [isActive, cameraReady, videoRef]);

  // 運行姿態檢測
  useEffect(() => {
    if (!detector || !videoRef.current || !cameraReady || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let rafId: number;

    async function detectPoseAndCalculateBpm() {
      if (!video || video.paused || video.ended) return;

      // 取得 video 原始尺寸
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const rotationAngle = stableRotation;

      // 確保畫布尺寸與影像原始解析度一致
      if (canvas) {
        if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
        }
      }

      try {
        const poses = await detector?.estimatePoses(video);

        if (canvas && ctx) {
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 核心修正：根據穩定的旋轉角度與影像比例處理變換
          if (videoHeight > videoWidth || rotationAngle === 0) {
            // 直式影像或標準橫式：只需處理水平鏡像
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          } else if (rotationAngle === 180) {
            // 處理橫向 primary 可能產生的倒置
            ctx.translate(canvas.width, canvas.height);
            ctx.scale(-1, -1);
          } else if (rotationAngle === 90) {
            // 需要垂直旋轉時的處理
            ctx.translate(canvas.width, 0);
            ctx.rotate(Math.PI / 2);
            ctx.translate(0, -canvas.width);
            ctx.scale(-1, 1);
          }

          if (poses && poses.length > 0) {
            const pose = poses[0];
            // 直接由 ctx 的 transform 處理座標映射
            drawKeypoints(pose.keypoints, ctx, videoWidth, videoHeight);
            drawSkeleton(pose.keypoints, ctx, videoWidth, videoHeight);
            calculateBpm(pose.keypoints, updateActivityTime);
          }

          ctx.restore();
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
    stableRotation,
  ]);

  // 計算顯示的 BPM 和匹配百分比
  const displayedBpm = displayMode === "recent" ? recentBpm : averageBpm;

  const isInRange = Math.abs(displayedBpm - targetBpm) <= tolerance;

  if (!isActive) return null;

  // Vercel 環境變數（自動注入）
  const buildId =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev";

  return (
    <Flex vertical align="center" style={{ marginTop: 20 }}>
      {/* 攝像頭容器 */}
      <div className={styles.cameraContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline />
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* 調試信息顯示 */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            background: "rgba(0,0,0,0.9)",
            color: "#0f0",
            padding: "8px",
            fontSize: "11px",
            zIndex: 999,
            fontFamily: "monospace",
            lineHeight: "1.4",
            borderRadius: "4px",
          }}
        >
          Video: {videoRef.current?.videoWidth || 0} x{" "}
          {videoRef.current?.videoHeight || 0}
          <br />
          Display: {videoRef.current?.clientWidth || 0} x{" "}
          {videoRef.current?.clientHeight || 0}
          <br />
          Canvas: {canvasRef.current?.width || 0} x{" "}
          {canvasRef.current?.height || 0}
          <br />
          Stable Rotate: {stableRotation}°
          <br />
          Orn:{" "}
          {typeof window !== "undefined"
            ? window.screen?.orientation?.angle ??
              (window as any).orientation ??
              "N/A"
            : "N/A"}
          <br />
          Type:{" "}
          {typeof window !== "undefined"
            ? window.screen?.orientation?.type ?? "N/A"
            : "N/A"}
        </div>

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

      {/* 版本標記 - 不明顯的顯示在底部 */}
      <div
        style={{
          marginTop: "8px",
          fontSize: "10px",
          color: "rgba(0, 0, 0, 0.25)",
          userSelect: "none",
        }}
      >
        {buildId}
      </div>
    </Flex>
  );
};

export default BpmDetector;
