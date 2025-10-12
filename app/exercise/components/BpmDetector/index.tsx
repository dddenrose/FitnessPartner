"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Flex,
  Typography,
  Progress,
  Segmented,
  Tooltip,
  Button,
  Badge,
} from "antd";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import styles from "./styles.module.css";

const { Text, Title } = Typography;

interface BpmDetectorProps {
  isActive: boolean;
  onBpmDetected?: (recentBpm: number, averageBpm: number) => void;
  isDebug?: boolean; // 可選的調試模式
}

const BpmDetector: React.FC<BpmDetectorProps> = ({
  isActive,
  onBpmDetected,
  isDebug = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  );

  // 兩種 BPM 指標
  const [recentBpm, setRecentBpm] = useState<number>(0); // 即時 BPM (近 5-10 秒)
  const [averageBpm, setAverageBpm] = useState<number>(0); // 平均 BPM (整個運動期間)
  const [displayMode, setDisplayMode] = useState<"recent" | "average">(
    "recent"
  );

  // 調試信息
  const [showDebug, setShowDebug] = useState<boolean>(isDebug);
  const [lastMovementScore, setLastMovementScore] = useState<number>(0);
  const [detectedPattern, setDetectedPattern] = useState<string>("");
  const [correctionFactor, setCorrectionFactor] = useState<number>(0.7); // 校正係數，默認0.7

  // 其他狀態
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inactivityDetected, setInactivityDetected] = useState<boolean>(false);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // 從 Redux 獲取目標 BPM
  const targetBpm = useAppSelector((state) => state.exercise.bpm);
  // BPM 容許誤差
  const tolerance = 10;

  // 用於步頻計算的狀態
  const stepTimestamps = useRef<number[]>([]);
  const allStepTimestamps = useRef<number[]>([]); // 儲存所有步伐時間戳，用於計算平均 BPM
  const lastKeypoints = useRef<any>(null);

  // 初始化 TensorFlow 模型
  useEffect(() => {
    if (!isActive) return;

    async function setupModel() {
      try {
        // 確保 TF.js 已準備好
        await tf.ready();
        console.log("TensorFlow.js ready");

        // 創建 MoveNet 模型 - 輕量級且準確度高
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        };

        const detector = await poseDetection.createDetector(
          model,
          detectorConfig
        );
        setDetector(detector);
        console.log("姿態偵測模型已加載");
      } catch (err) {
        setError("無法加載姿態偵測模型");
        console.error("模型加載錯誤:", err);
      }
    }

    setupModel();

    // 清理函數
    return () => {
      // 釋放資源
    };
  }, [isActive]);

  // 設置攝像頭
  useEffect(() => {
    if (!isActive) return;

    async function setupCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch (err) {
        setError("無法訪問攝像頭");
        console.error("攝像頭訪問錯誤:", err);
      }
    }

    setupCamera();

    return () => {
      // 清理攝像頭資源
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  // 運行姿態檢測
  useEffect(() => {
    if (!detector || !videoRef.current || !cameraReady || !isActive) return;

    // 初始化檢測時只執行一次的設置
    const initialTime = Date.now();
    setLastActivityTime(initialTime); // 只在初始化時設置一次

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let rafId: number;

    async function detectPoseAndCalculateBpm() {
      if (!video || video.paused || video.ended) return;

      try {
        // 執行姿態檢測
        const poses = await detector?.estimatePoses(video);

        if (!poses) return;

        if (poses.length > 0) {
          const pose = poses[0];

          // 繪製檢測結果（可選）
          if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawKeypoints(pose.keypoints, ctx);
            drawSkeleton(pose.keypoints, ctx);
          }

          // 計算 BPM
          calculateBpm(pose.keypoints);
        }
      } catch (err) {
        console.error("姿態檢測錯誤:", err);
      }

      rafId = requestAnimationFrame(detectPoseAndCalculateBpm);
    }

    // 開始檢測循環
    detectPoseAndCalculateBpm();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [detector, cameraReady, isActive]);

  // 檢測不活動（休息或中斷）
  useEffect(() => {
    if (!isActive) return;

    let inactivityTimer: NodeJS.Timeout;
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;

      // 增加閾值到 5 秒，給用戶更多容忍度
      if (timeSinceLastActivity > 5000) {
        if (!inactivityDetected) {
          console.log("檢測到不活動/休息狀態");
          setInactivityDetected(true);
        }
      } else if (inactivityDetected) {
        console.log("恢復活動");
        setInactivityDetected(false);
      }
    };

    // 減少檢查頻率，避免過於敏感
    inactivityTimer = setInterval(checkInactivity, 2000);

    // 當組件初始化或重新啟用時，重置活動時間
    setLastActivityTime(Date.now());
    setInactivityDetected(false);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [isActive]); // 移除循環依賴

  // 計算步頻 BPM
  const calculateBpm = (keypoints: any) => {
    // 獲取多個關鍵點，包括手肘、肩膀、腳踝和膝蓋
    const leftAnkle = keypoints.find((kp: any) => kp.name === "left_ankle");
    const rightAnkle = keypoints.find((kp: any) => kp.name === "right_ankle");
    const leftKnee = keypoints.find((kp: any) => kp.name === "left_knee");
    const rightKnee = keypoints.find((kp: any) => kp.name === "right_knee");
    const leftElbow = keypoints.find((kp: any) => kp.name === "left_elbow");
    const rightElbow = keypoints.find((kp: any) => kp.name === "right_elbow");
    const leftShoulder = keypoints.find(
      (kp: any) => kp.name === "left_shoulder"
    );
    const rightShoulder = keypoints.find(
      (kp: any) => kp.name === "right_shoulder"
    );

    // 檢查關鍵點是否有效 - 現在需要考慮更多可能的關節組合
    const anklesVisible =
      leftAnkle &&
      rightAnkle &&
      leftAnkle.score > 0.3 &&
      rightAnkle.score > 0.3;
    const elbowsVisible =
      leftElbow &&
      rightElbow &&
      leftElbow.score > 0.3 &&
      rightElbow.score > 0.3;
    const shouldersVisible =
      leftShoulder &&
      rightShoulder &&
      leftShoulder.score > 0.3 &&
      rightShoulder.score > 0.3;

    // 如果既沒有有效的腳踝也沒有有效的手肘，則無法計算
    if (!anklesVisible && (!elbowsVisible || !shouldersVisible)) {
      console.log("無法檢測到足夠的身體關節點，無法計算步頻");
      return;
    }

    // 檢測步伐 - 整合多種身體運動檢測
    if (lastKeypoints.current) {
      // 運動檢測得分變量 (綜合考慮多個因素)
      let movementScore = 0;

      // 1. 計算腳踝垂直和水平移動
      let leftAnkleDiff = 0;
      let rightAnkleDiff = 0;
      let leftAnkleMovement = 0;
      let rightAnkleMovement = 0;
      let ankleForwardMovement = 0;

      if (
        anklesVisible &&
        lastKeypoints.current.leftAnkle &&
        lastKeypoints.current.rightAnkle
      ) {
        leftAnkleDiff = leftAnkle.y - lastKeypoints.current.leftAnkle;
        rightAnkleDiff = rightAnkle.y - lastKeypoints.current.rightAnkle;
        leftAnkleMovement = Math.abs(leftAnkleDiff);
        rightAnkleMovement = Math.abs(rightAnkleDiff);

        // 檢測前後擺動 (水平方向)
        if (
          lastKeypoints.current.leftAnkleX &&
          lastKeypoints.current.rightAnkleX
        ) {
          const leftAnkleXDiff = leftAnkle.x - lastKeypoints.current.leftAnkleX;
          const rightAnkleXDiff =
            rightAnkle.x - lastKeypoints.current.rightAnkleX;
          ankleForwardMovement = Math.max(
            Math.abs(leftAnkleXDiff),
            Math.abs(rightAnkleXDiff)
          );
          // 增加水平運動的得分比重
          movementScore += ankleForwardMovement * 0.8;
        }

        // 腳踝垂直運動得分
        movementScore += (leftAnkleMovement + rightAnkleMovement) * 0.5;

        // 對角運動模式 (一上一下) 給予更高權重
        if (leftAnkleDiff * rightAnkleDiff < 0) {
          movementScore +=
            Math.min(leftAnkleMovement, rightAnkleMovement) * 0.5;
        }
      }

      // 2. 計算手肘擺動
      let leftElbowDiff = 0;
      let rightElbowDiff = 0;
      let elbowSwing = 0;

      if (
        elbowsVisible &&
        shouldersVisible &&
        lastKeypoints.current.leftElbow &&
        lastKeypoints.current.rightElbow
      ) {
        // 計算手肘相對於肩膀的垂直位置變化
        const leftElbowRelativeY = leftElbow.y - leftShoulder.y;
        const rightElbowRelativeY = rightElbow.y - rightShoulder.y;
        const lastLeftElbowRelativeY =
          lastKeypoints.current.leftElbow -
          (lastKeypoints.current.leftShoulder || leftShoulder.y);
        const lastRightElbowRelativeY =
          lastKeypoints.current.rightElbow -
          (lastKeypoints.current.rightShoulder || rightShoulder.y);

        leftElbowDiff = leftElbowRelativeY - lastLeftElbowRelativeY;
        rightElbowDiff = rightElbowRelativeY - lastRightElbowRelativeY;

        // 手肘垂直擺動
        const leftElbowMovement = Math.abs(leftElbowDiff);
        const rightElbowMovement = Math.abs(rightElbowDiff);
        elbowSwing = leftElbowMovement + rightElbowMovement;

        // 手肘運動得分 - 超慢跑手臂擺動較明顯
        movementScore += elbowSwing * 1.2;

        // 檢測前後擺動 (水平方向)
        if (
          lastKeypoints.current.leftElbowX &&
          lastKeypoints.current.rightElbowX
        ) {
          const leftElbowXDiff = leftElbow.x - lastKeypoints.current.leftElbowX;
          const rightElbowXDiff =
            rightElbow.x - lastKeypoints.current.rightElbowX;
          const elbowForwardMovement = Math.max(
            Math.abs(leftElbowXDiff),
            Math.abs(rightElbowXDiff)
          );
          // 增加水平運動的得分比重
          movementScore += elbowForwardMovement * 1.0;
        }

        // 手臂交替擺動模式給予更高權重
        if (leftElbowDiff * rightElbowDiff < 0) {
          movementScore +=
            Math.min(leftElbowMovement, rightElbowMovement) * 0.8;
        }
      }

      // 檢測是否有運動（用於活動監測）
      const significantMovement = movementScore > 3.0;
      if (significantMovement) {
        // 使用單一更新，避免多次觸發渲染
        const now = Date.now();
        setLastActivityTime(now);
      }

      // 步伐檢測閾值 - 增加閾值以減少錯誤檢測
      const threshold = 7.8; // 提高綜合得分閾值

      // 保存調試信息
      setLastMovementScore(movementScore);

      // 步伐檢測條件 - 綜合考慮所有因素
      const isStepPattern = movementScore > threshold;

      // 設置檢測到的模式，用於調試顯示
      if (isStepPattern) {
        let pattern = "";
        if (elbowSwing > 3) pattern += "手肘擺動 ";
        if (ankleForwardMovement > 3) pattern += "腳踝前後移動 ";
        if (leftAnkleMovement > 3 || rightAnkleMovement > 3)
          pattern += "腳踝上下移動 ";
        if (pattern === "") pattern = "綜合運動模式";
        setDetectedPattern(pattern.trim());
      }
      if (isStepPattern) {
        const now = Date.now();
        // 檢測到有效步伐時刷新活動時間，但避免重複設置狀態
        setLastActivityTime(now);
        // 移除在計算函數中對不活動標記的更新

        // 使最小間隔更加寬容，讓更多步伐可以被檢測到
        const minStepInterval = Math.max(150, 60000 / (targetBpm * 2));

        const lastTimestamp =
          stepTimestamps.current[stepTimestamps.current.length - 1];
        if (!lastTimestamp || now - lastTimestamp > minStepInterval) {
          console.log(
            "記錄有效步伐，間隔:",
            lastTimestamp ? now - lastTimestamp : "首次記錄"
          );

          // 添加時間戳到即時 BPM 計算陣列
          stepTimestamps.current.push(now);

          // 同時添加到總體步伐記錄中
          allStepTimestamps.current.push(now);

          // 即時 BPM：只保留最近 5 秒的步伐數據
          const recentTimeWindow = now - 5000; // 降至 5 秒更快反應當前變化
          stepTimestamps.current = stepTimestamps.current.filter(
            (ts) => ts > recentTimeWindow
          );

          // 計算即時 BPM (近期步頻)
          if (stepTimestamps.current.length >= 3) {
            let recentIntervals = [];
            for (let i = 1; i < stepTimestamps.current.length; i++) {
              recentIntervals.push(
                stepTimestamps.current[i] - stepTimestamps.current[i - 1]
              );
            }

            // 移除異常值
            if (recentIntervals.length > 3) {
              const avgRaw =
                recentIntervals.reduce((sum, val) => sum + val, 0) /
                recentIntervals.length;
              recentIntervals = recentIntervals.filter(
                (interval) => interval > avgRaw * 0.5 && interval < avgRaw * 1.5
              );
            }

            const avgRecentInterval =
              recentIntervals.reduce((sum, val) => sum + val, 0) /
              recentIntervals.length;

            // 修改 BPM 計算公式 - 使用可調整的校正因子
            // 根據您的反饋，實際跑步時 BPM 約為 170，而測量值約 245
            // 校正比例大約是 170/245 ≈ 0.7
            const calculatedRecentBpm = Math.round(
              (60000 / avgRecentInterval) * correctionFactor
            );

            console.log(
              "原始 BPM:",
              Math.round(60000 / avgRecentInterval),
              "校正後 BPM:",
              calculatedRecentBpm
            );

            // 排除明顯不合理的值
            if (calculatedRecentBpm >= 80 && calculatedRecentBpm <= 280) {
              setRecentBpm(calculatedRecentBpm);
            }
          }

          // 計算平均 BPM (全程步頻)
          // 我們需要至少 4 步才開始計算平均 BPM
          if (allStepTimestamps.current.length >= 4) {
            // 計算全部有效間隔
            let allIntervals = [];

            // 排除可能的長時間休息
            // 定義最大有效間隔 (例如 2 秒，超過視為休息)
            const maxValidInterval = 2000;

            for (let i = 1; i < allStepTimestamps.current.length; i++) {
              const interval =
                allStepTimestamps.current[i] - allStepTimestamps.current[i - 1];
              // 只計算有效間隔 (排除休息時間)
              if (interval <= maxValidInterval) {
                allIntervals.push(interval);
              }
            }

            if (allIntervals.length > 0) {
              // 計算平均間隔
              const avgAllInterval =
                allIntervals.reduce((sum, val) => sum + val, 0) /
                allIntervals.length;

              // 使用相同的校正因子
              const calculatedAverageBpm = Math.round(
                (60000 / avgAllInterval) * correctionFactor
              );

              console.log(
                "原始平均 BPM:",
                Math.round(60000 / avgAllInterval),
                "校正後平均 BPM:",
                calculatedAverageBpm
              );

              if (calculatedAverageBpm >= 80 && calculatedAverageBpm <= 280) {
                setAverageBpm(calculatedAverageBpm);
              }
            }
          }

          // 回調通知上層組件 (確保兩個值都可用時再回調)
          if (onBpmDetected && recentBpm > 0) {
            onBpmDetected(recentBpm, averageBpm > 0 ? averageBpm : recentBpm);
          }
        }
      }
    }

    // 更新上一幀的關鍵點 - 現在包括更多關節
    lastKeypoints.current = {
      leftAnkle: leftAnkle?.y,
      rightAnkle: rightAnkle?.y,
      leftKnee: leftKnee?.y,
      rightKnee: rightKnee?.y,
      leftElbow: leftElbow?.y,
      rightElbow: rightElbow?.y,
      leftShoulder: leftShoulder?.y,
      rightShoulder: rightShoulder?.y,
      // 保存水平位置用於計算前後擺動
      leftElbowX: leftElbow?.x,
      rightElbowX: rightElbow?.x,
      leftAnkleX: leftAnkle?.x,
      rightAnkleX: rightAnkle?.x,
    };
  };

  // 繪製關鍵點
  const drawKeypoints = (keypoints: any, ctx: CanvasRenderingContext2D) => {
    keypoints.forEach((keypoint: any) => {
      if (keypoint.score > 0.3) {
        const { x, y } = keypoint;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
      }
    });
  };

  // 繪製骨架
  const drawSkeleton = (keypoints: any, ctx: CanvasRenderingContext2D) => {
    const connections = [
      ["nose", "left_eye"],
      ["left_eye", "left_ear"],
      ["nose", "right_eye"],
      ["right_eye", "right_ear"],
      ["nose", "left_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["left_shoulder", "left_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["nose", "right_shoulder"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["right_shoulder", "right_hip"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
      ["left_shoulder", "right_shoulder"],
      ["left_hip", "right_hip"],
    ];

    connections.forEach(([firstPart, secondPart]) => {
      const firstPointIndex = keypoints.findIndex(
        (kp: any) => kp.name === firstPart
      );
      const secondPointIndex = keypoints.findIndex(
        (kp: any) => kp.name === secondPart
      );

      if (firstPointIndex !== -1 && secondPointIndex !== -1) {
        const firstPoint = keypoints[firstPointIndex];
        const secondPoint = keypoints[secondPointIndex];

        if (firstPoint.score > 0.3 && secondPoint.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(firstPoint.x, firstPoint.y);
          ctx.lineTo(secondPoint.x, secondPoint.y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "aqua";
          ctx.stroke();
        }
      }
    });
  };

  // 切換顯示模式 (即時/平均)
  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === "recent" ? "average" : "recent");
  };

  // 取得目前顯示的 BPM 值
  const displayedBpm = displayMode === "recent" ? recentBpm : averageBpm;

  // 計算 BPM 匹配百分比
  const calculateMatchPercentage = () => {
    if (displayedBpm === 0) return 0;

    const diff = Math.abs(displayedBpm - targetBpm);
    const matchPercentage = Math.max(0, 100 - (diff / targetBpm) * 100);
    return Math.min(100, matchPercentage);
  };

  const matchPercentage = calculateMatchPercentage();
  const isInRange = Math.abs(displayedBpm - targetBpm) <= tolerance;

  if (!isActive) return null;

  return (
    <Flex vertical align="center" style={{ marginTop: 20 }}>
      <Title level={4} style={{ color: "white", marginBottom: 16 }}>
        步頻監測
      </Title>

      <div className={styles.cameraContainer}>
        <video ref={videoRef} className={styles.video} autoPlay playsInline />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={640}
          height={480}
        />

        {/* 顯示檢測狀態指示器 */}
        <div
          className={styles.detectionIndicator}
          style={{
            backgroundColor: displayedBpm > 0 ? "#52c41a" : "#1890ff",
            boxShadow: `0 0 10px ${displayedBpm > 0 ? "#52c41a" : "#1890ff"}`,
          }}
        >
          {displayedBpm > 0 ? "✓" : "⋯"}
        </div>

        {/* 不活動狀態提示 - 改為半透明提示而非全屏覆蓋 */}
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

        {/* 顯示目標 BPM 區間 */}
        <div className={styles.bpmTargetZone}>
          <div
            className={styles.bpmZoneIndicator}
            style={{
              backgroundColor: isInRange
                ? "rgba(82, 196, 26, 0.6)"
                : "rgba(255, 77, 79, 0.6)",
            }}
          ></div>
          <span
            style={{
              color: "white",
              fontSize: "12px",
              position: "absolute",
              bottom: "5px",
              right: "5px",
            }}
          >
            目標: {targetBpm - tolerance} - {targetBpm + tolerance} BPM
          </span>
        </div>

        {error && (
          <div className={styles.errorOverlay}>
            <Text style={{ color: "white" }}>{error}</Text>
          </div>
        )}
      </div>

      <Flex vertical gap="small" style={{ width: "100%", maxWidth: "320px" }}>
        <Flex justify="space-between" align="center">
          {/* 模式切換 */}
          <Segmented
            value={displayMode}
            onChange={(value) => setDisplayMode(value as "recent" | "average")}
            options={[
              { label: "即時步頻", value: "recent" },
              { label: "平均步頻", value: "average" },
            ]}
            style={{ marginBottom: "10px", flex: 1 }}
          />

          {/* 調試模式開關 */}
          <Button
            type="text"
            size="small"
            onClick={() => setShowDebug(!showDebug)}
            style={{ marginLeft: 8 }}
          >
            {showDebug ? "隱藏調試" : "調試"}
          </Button>
        </Flex>

        {/* 調試信息 */}
        {showDebug && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                color: "#ff9800",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              運動得分: {lastMovementScore.toFixed(1)} (閾值: 7.8)
            </div>
            {detectedPattern && (
              <div
                style={{
                  color: "#4caf50",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                檢測到: {detectedPattern}
              </div>
            )}

            {/* BPM 校正滑塊 */}
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  color: "#2196f3",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                BPM 校正係數: {correctionFactor.toFixed(2)}
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={correctionFactor}
                onChange={(e) =>
                  setCorrectionFactor(parseFloat(e.target.value))
                }
                style={{ width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "#aaa",
                }}
              >
                <span>0.5</span>
                <span>0.75</span>
                <span>1</span>
              </div>
            </div>
          </div>
        )}

        <Flex justify="space-between">
          <div style={{ color: "white", fontSize: "16px" }}>
            目標 BPM: {targetBpm}
          </div>
          <div
            style={{
              color: isInRange ? "#52c41a" : "#ff4d4f",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {displayMode === "recent" ? "即時" : "平均"} BPM:{" "}
            {displayedBpm || "偵測中..."}
            {displayMode === "recent" && averageBpm > 0 && (
              <span
                style={{
                  color: "#1890ff",
                  fontSize: "14px",
                  marginLeft: "8px",
                }}
              >
                (平均: {averageBpm})
              </span>
            )}
          </div>
        </Flex>

        <Progress
          percent={matchPercentage}
          status={isInRange ? "success" : "exception"}
          strokeColor={{
            from: isInRange ? "#52c41a" : "#faad14",
            to: isInRange ? "#52c41a" : "#ff4d4f",
          }}
          strokeWidth={10}
        />

        <div
          style={{
            color: isInRange ? "#52c41a" : "#ff4d4f",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          {inactivityDetected
            ? "⚠️ 未檢測到有效運動"
            : isInRange
            ? "✓ 步頻完美！保持節奏"
            : displayedBpm > targetBpm
            ? "⬇ 請放慢腳步"
            : displayedBpm === 0
            ? "💡 開始跑步，系統將檢測您的步頻"
            : "⬆ 請加快腳步"}
        </div>

        {stepTimestamps.current.length > 0 &&
          stepTimestamps.current.length < 3 && (
            <div
              style={{ color: "white", textAlign: "center", fontSize: "14px" }}
            >
              已檢測到 {stepTimestamps.current.length} 步，再需要{" "}
              {3 - stepTimestamps.current.length} 步來計算 BPM
            </div>
          )}
      </Flex>
    </Flex>
  );
};

export default BpmDetector;
