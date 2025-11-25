import { useRef, useCallback, useState } from "react";

// ==================== BPM 計算常數 ====================
/** BPM 轉換係數 */
const BPM_CONVERSION_FACTOR = 0.75;

/** 腳踝運動評分權重 */
const ANKLE_MOVEMENT_WEIGHT = 0.5;
const ANKLE_ALTERNATION_WEIGHT = 0.5;
const ANKLE_FORWARD_WEIGHT = 0.8;

/** 手肘運動評分權重 */
const ELBOW_MOVEMENT_WEIGHT = 1.2;
const ELBOW_ALTERNATION_WEIGHT = 0.8;
const ELBOW_FORWARD_WEIGHT = 1.0;

/** 步伐偵測閾值 */
const MOVEMENT_SCORE_THRESHOLD = 7.8;
const SIGNIFICANT_MOVEMENT_THRESHOLD = 3.0;

/** BPM 有效範圍 */
const MIN_VALID_BPM = 80;
const MAX_VALID_BPM = 280;

/** 時間窗口配置 */
const RECENT_TIME_WINDOW = 5000; // 5秒內的步伐
const MIN_STEP_INTERVAL = 150; // 最小步伐間隔（毫秒）
const MAX_AVERAGE_INTERVAL = 2000; // 計算平均 BPM 的最大間隔

/** 最小步伐檢測數 */
const MIN_RECENT_STEPS = 3; // 計算即時 BPM 需要的最小步伐數
const MIN_AVERAGE_STEPS = 4; // 計算平均 BPM 需要的最小步伐數

/** 關鍵點置信度閾值 */
const KEYPOINT_CONFIDENCE_THRESHOLD = 0.3;

// ========================================================

interface UseBpmCalculationProps {
  targetBpm: number;
  onBpmDetected?: (recentBpm: number, averageBpm: number) => void;
}

export const useBpmCalculation = ({
  targetBpm,
  onBpmDetected,
}: UseBpmCalculationProps) => {
  const [recentBpm, setRecentBpm] = useState<number>(0);
  const [averageBpm, setAverageBpm] = useState<number>(0);

  const stepTimestamps = useRef<number[]>([]);
  const allStepTimestamps = useRef<number[]>([]);
  const lastKeypoints = useRef<any>(null);

  // ✅ 使用 Ref 追蹤最新的 BPM 值，避免在依賴中使用它們
  const recentBpmRef = useRef<number>(0);
  const averageBpmRef = useRef<number>(0);

  // 輔助函數：構建關鍵點快照
  const buildKeypointSnapshot = (
    leftAnkle: any,
    rightAnkle: any,
    leftKnee: any,
    rightKnee: any,
    leftElbow: any,
    rightElbow: any,
    leftShoulder: any,
    rightShoulder: any
  ) => {
    return {
      leftAnkle: leftAnkle?.y,
      rightAnkle: rightAnkle?.y,
      leftKnee: leftKnee?.y,
      rightKnee: rightKnee?.y,
      leftElbow: leftElbow?.y,
      rightElbow: rightElbow?.y,
      leftShoulder: leftShoulder?.y,
      rightShoulder: rightShoulder?.y,
      leftElbowX: leftElbow?.x,
      rightElbowX: rightElbow?.x,
      leftAnkleX: leftAnkle?.x,
      rightAnkleX: rightAnkle?.x,
    };
  };

  // 計算腳踝運動
  const calculateAnkleMovement = (
    leftAnkle: any,
    rightAnkle: any,
    lastKeypoints: any
  ) => {
    let score = 0;
    const leftAnkleDiff = leftAnkle.y - lastKeypoints.leftAnkle;
    const rightAnkleDiff = rightAnkle.y - lastKeypoints.rightAnkle;
    const leftAnkleMovement = Math.abs(leftAnkleDiff);
    const rightAnkleMovement = Math.abs(rightAnkleDiff);

    score += (leftAnkleMovement + rightAnkleMovement) * ANKLE_MOVEMENT_WEIGHT;

    if (leftAnkleDiff * rightAnkleDiff < 0) {
      score +=
        Math.min(leftAnkleMovement, rightAnkleMovement) *
        ANKLE_ALTERNATION_WEIGHT;
    }

    if (lastKeypoints.leftAnkleX && lastKeypoints.rightAnkleX) {
      const leftAnkleXDiff = leftAnkle.x - lastKeypoints.leftAnkleX;
      const rightAnkleXDiff = rightAnkle.x - lastKeypoints.rightAnkleX;
      const ankleForwardMovement = Math.max(
        Math.abs(leftAnkleXDiff),
        Math.abs(rightAnkleXDiff)
      );
      score += ankleForwardMovement * ANKLE_FORWARD_WEIGHT;
    }

    return score;
  };

  // 計算手肘運動
  const calculateElbowMovement = (
    leftElbow: any,
    rightElbow: any,
    leftShoulder: any,
    rightShoulder: any,
    lastKeypoints: any
  ) => {
    let score = 0;
    const leftElbowRelativeY = leftElbow.y - leftShoulder.y;
    const rightElbowRelativeY = rightElbow.y - rightShoulder.y;
    const lastLeftElbowRelativeY =
      lastKeypoints.leftElbow - (lastKeypoints.leftShoulder || leftShoulder.y);
    const lastRightElbowRelativeY =
      lastKeypoints.rightElbow -
      (lastKeypoints.rightShoulder || rightShoulder.y);

    const leftElbowDiff = leftElbowRelativeY - lastLeftElbowRelativeY;
    const rightElbowDiff = rightElbowRelativeY - lastRightElbowRelativeY;
    const leftElbowMovement = Math.abs(leftElbowDiff);
    const rightElbowMovement = Math.abs(rightElbowDiff);

    score += (leftElbowMovement + rightElbowMovement) * ELBOW_MOVEMENT_WEIGHT;

    if (leftElbowDiff * rightElbowDiff < 0) {
      score +=
        Math.min(leftElbowMovement, rightElbowMovement) *
        ELBOW_ALTERNATION_WEIGHT;
    }

    if (lastKeypoints.leftElbowX && lastKeypoints.rightElbowX) {
      const leftElbowXDiff = leftElbow.x - lastKeypoints.leftElbowX;
      const rightElbowXDiff = rightElbow.x - lastKeypoints.rightElbowX;
      const elbowForwardMovement = Math.max(
        Math.abs(leftElbowXDiff),
        Math.abs(rightElbowXDiff)
      );
      score += elbowForwardMovement * ELBOW_FORWARD_WEIGHT;
    }

    return score;
  };

  // 從間隔計算 BPM
  const calculateBpmFromIntervals = (
    timestamps: number[],
    maxValidInterval?: number
  ): number => {
    let intervals = [];

    for (let i = 1; i < timestamps.length; i++) {
      const interval = timestamps[i] - timestamps[i - 1];
      if (!maxValidInterval || interval <= maxValidInterval) {
        intervals.push(interval);
      }
    }

    if (intervals.length === 0) return 0;

    const avgInterval =
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    return Math.round((60000 / avgInterval) * BPM_CONVERSION_FACTOR);
  };

  const calculateBpm = useCallback(
    (keypoints: any, onActivityDetected?: (time: number) => void) => {
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

      // 檢查關鍵點有效性
      const anklesVisible =
        leftAnkle &&
        rightAnkle &&
        leftAnkle.score > KEYPOINT_CONFIDENCE_THRESHOLD &&
        rightAnkle.score > KEYPOINT_CONFIDENCE_THRESHOLD;
      const elbowsVisible =
        leftElbow &&
        rightElbow &&
        leftElbow.score > KEYPOINT_CONFIDENCE_THRESHOLD &&
        rightElbow.score > KEYPOINT_CONFIDENCE_THRESHOLD;
      const shouldersVisible =
        leftShoulder &&
        rightShoulder &&
        leftShoulder.score > KEYPOINT_CONFIDENCE_THRESHOLD &&
        rightShoulder.score > KEYPOINT_CONFIDENCE_THRESHOLD;

      if (!anklesVisible && (!elbowsVisible || !shouldersVisible)) {
        return;
      }

      if (!lastKeypoints.current) {
        lastKeypoints.current = buildKeypointSnapshot(
          leftAnkle,
          rightAnkle,
          leftKnee,
          rightKnee,
          leftElbow,
          rightElbow,
          leftShoulder,
          rightShoulder
        );
        return;
      }

      // 計算運動得分
      let movementScore = 0;

      if (anklesVisible && lastKeypoints.current.leftAnkle) {
        movementScore += calculateAnkleMovement(
          leftAnkle,
          rightAnkle,
          lastKeypoints.current
        );
      }

      if (
        elbowsVisible &&
        shouldersVisible &&
        lastKeypoints.current.leftElbow
      ) {
        movementScore += calculateElbowMovement(
          leftElbow,
          rightElbow,
          leftShoulder,
          rightShoulder,
          lastKeypoints.current
        );
      }

      // 檢測活動
      const significantMovement =
        movementScore > SIGNIFICANT_MOVEMENT_THRESHOLD;
      if (significantMovement && onActivityDetected) {
        onActivityDetected(Date.now());
      }

      // 步伐檢測
      const threshold = MOVEMENT_SCORE_THRESHOLD;
      if (movementScore > threshold) {
        const now = Date.now();
        if (onActivityDetected) {
          onActivityDetected(now);
        }

        const minStepInterval = Math.max(
          MIN_STEP_INTERVAL,
          60000 / (targetBpm * 2)
        );
        const lastTimestamp =
          stepTimestamps.current[stepTimestamps.current.length - 1];

        if (!lastTimestamp || now - lastTimestamp > minStepInterval) {
          stepTimestamps.current.push(now);
          allStepTimestamps.current.push(now);

          // 計算即時 BPM
          const recentTimeWindow = now - RECENT_TIME_WINDOW;
          stepTimestamps.current = stepTimestamps.current.filter(
            (ts) => ts > recentTimeWindow
          );

          if (stepTimestamps.current.length >= MIN_RECENT_STEPS) {
            const calculatedRecentBpm = calculateBpmFromIntervals(
              stepTimestamps.current
            );
            if (
              calculatedRecentBpm >= MIN_VALID_BPM &&
              calculatedRecentBpm <= MAX_VALID_BPM
            ) {
              setRecentBpm(calculatedRecentBpm);
              recentBpmRef.current = calculatedRecentBpm;
            }
          }

          // 計算平均 BPM
          if (allStepTimestamps.current.length >= MIN_AVERAGE_STEPS) {
            const calculatedAverageBpm = calculateBpmFromIntervals(
              allStepTimestamps.current,
              MAX_AVERAGE_INTERVAL
            );
            if (
              calculatedAverageBpm >= MIN_VALID_BPM &&
              calculatedAverageBpm <= MAX_VALID_BPM
            ) {
              setAverageBpm(calculatedAverageBpm);
              averageBpmRef.current = calculatedAverageBpm;
            }
          }

          // ✅ 使用 Ref 中的最新值進行回調
          if (onBpmDetected && recentBpmRef.current > 0) {
            onBpmDetected(
              recentBpmRef.current,
              averageBpmRef.current > 0
                ? averageBpmRef.current
                : recentBpmRef.current
            );
          }
        }
      }

      // 更新上一幀關鍵點
      lastKeypoints.current = buildKeypointSnapshot(
        leftAnkle,
        rightAnkle,
        leftKnee,
        rightKnee,
        leftElbow,
        rightElbow,
        leftShoulder,
        rightShoulder
      );
    },
    // ✅ 移除 recentBpm 和 averageBpm，只保留必要的依賴
    [targetBpm, onBpmDetected]
  );

  return {
    recentBpm,
    averageBpm,
    calculateBpm,
    resetBpm: () => {
      setRecentBpm(0);
      setAverageBpm(0);
      recentBpmRef.current = 0;
      averageBpmRef.current = 0;
      stepTimestamps.current = [];
      allStepTimestamps.current = [];
    },
  };
};
