export const drawKeypoints = (
  keypoints: any,
  ctx: CanvasRenderingContext2D
) => {
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

export const drawSkeleton = (keypoints: any, ctx: CanvasRenderingContext2D) => {
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
