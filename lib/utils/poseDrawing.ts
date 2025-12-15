/**
 * 繪製關鍵點
 * @param keypoints - 關鍵點陣列
 * @param ctx - Canvas 上下文
 * @param canvasWidth - Canvas 寬度（預設 640）
 * @param canvasHeight - Canvas 高度（預設 480）
 */
export const drawKeypoints = (
  keypoints: any,
  ctx: CanvasRenderingContext2D,
  canvasWidth: number = 640,
  canvasHeight: number = 480
) => {
  ctx.fillStyle = "aqua";

  keypoints.forEach((keypoint: any) => {
    if (keypoint.score > 0.3) {
      const { x, y } = keypoint;

      // 檢查座標是否在有效範圍內
      if (x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  });
};

/**
 * 繪製骨架連線
 * @param keypoints - 關鍵點陣列
 * @param ctx - Canvas 上下文
 * @param canvasWidth - Canvas 寬度（預設 640）
 * @param canvasHeight - Canvas 高度（預設 480）
 */
export const drawSkeleton = (
  keypoints: any,
  ctx: CanvasRenderingContext2D,
  canvasWidth: number = 640,
  canvasHeight: number = 480
) => {
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

  ctx.lineWidth = 2;
  ctx.strokeStyle = "aqua";

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

      // 檢查兩個端點的座標和置信度
      if (
        firstPoint.score > 0.3 &&
        secondPoint.score > 0.3 &&
        firstPoint.x >= 0 &&
        firstPoint.x <= canvasWidth &&
        firstPoint.y >= 0 &&
        firstPoint.y <= canvasHeight &&
        secondPoint.x >= 0 &&
        secondPoint.x <= canvasWidth &&
        secondPoint.y >= 0 &&
        secondPoint.y <= canvasHeight
      ) {
        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        ctx.lineTo(secondPoint.x, secondPoint.y);
        ctx.stroke();
      }
    }
  });
};
