import { useRef, useCallback, useState } from "react";

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

    score += (leftAnkleMovement + rightAnkleMovement) * 0.5;

    if (leftAnkleDiff * rightAnkleDiff < 0) {
      score += Math.min(leftAnkleMovement, rightAnkleMovement) * 0.5;
    }

    if (lastKeypoints.leftAnkleX && lastKeypoints.rightAnkleX) {
      const leftAnkleXDiff = leftAnkle.x - lastKeypoints.leftAnkleX;
      const rightAnkleXDiff = rightAnkle.x - lastKeypoints.rightAnkleX;
      const ankleForwardMovement = Math.max(
        Math.abs(leftAnkleXDiff),
        Math.abs(rightAnkleXDiff)
      );
      score += ankleForwardMovement * 0.8;
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

    score += (leftElbowMovement + rightElbowMovement) * 1.2;

    if (leftElbowDiff * rightElbowDiff < 0) {
      score += Math.min(leftElbowMovement, rightElbowMovement) * 0.8;
    }

    if (lastKeypoints.leftElbowX && lastKeypoints.rightElbowX) {
      const leftElbowXDiff = leftElbow.x - lastKeypoints.leftElbowX;
      const rightElbowXDiff = rightElbow.x - lastKeypoints.rightElbowX;
      const elbowForwardMovement = Math.max(
        Math.abs(leftElbowXDiff),
        Math.abs(rightElbowXDiff)
      );
      score += elbowForwardMovement * 1.0;
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
    return Math.round((60000 / avgInterval) * 0.7);
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
      const significantMovement = movementScore > 3.0;
      if (significantMovement && onActivityDetected) {
        onActivityDetected(Date.now());
      }

      // 步伐檢測
      const threshold = 7.8;
      if (movementScore > threshold) {
        const now = Date.now();
        if (onActivityDetected) {
          onActivityDetected(now);
        }

        const minStepInterval = Math.max(150, 60000 / (targetBpm * 2));
        const lastTimestamp =
          stepTimestamps.current[stepTimestamps.current.length - 1];

        if (!lastTimestamp || now - lastTimestamp > minStepInterval) {
          stepTimestamps.current.push(now);
          allStepTimestamps.current.push(now);

          // 計算即時 BPM
          const recentTimeWindow = now - 5000;
          stepTimestamps.current = stepTimestamps.current.filter(
            (ts) => ts > recentTimeWindow
          );

          if (stepTimestamps.current.length >= 3) {
            const calculatedRecentBpm = calculateBpmFromIntervals(
              stepTimestamps.current
            );
            if (calculatedRecentBpm >= 80 && calculatedRecentBpm <= 280) {
              setRecentBpm(calculatedRecentBpm);
              recentBpmRef.current = calculatedRecentBpm;
            }
          }

          // 計算平均 BPM
          if (allStepTimestamps.current.length >= 4) {
            const calculatedAverageBpm = calculateBpmFromIntervals(
              allStepTimestamps.current,
              2000
            );
            if (calculatedAverageBpm >= 80 && calculatedAverageBpm <= 280) {
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
