import { useEffect } from "react";
import type React from "react";
import { drawKeypoints, drawSkeleton } from "@/lib/utils/poseDrawing";
import {
  calculateRotationAngle,
  getRotatedCanvasSize,
} from "@/lib/utils/canvasRotation";

type ApplyTransformFn = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  videoWidth: number,
) => void;

/** canvas 座標轉換查表（依旋轉角度對應鏡像/旋轉組合） */
const CANVAS_TRANSFORMS: Record<number, ApplyTransformFn> = {
  // 橫向正常（筆電、手機正常橫躺）：只做水平鏡像
  0: (ctx, canvas) => {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  },
  // 手機順時針橫躺：水平 + 垂直翻轉
  180: (ctx, canvas) => {
    ctx.translate(canvas.width, canvas.height);
    ctx.scale(-1, -1);
  },
  // 直向（手機直立）：逆時針旋轉 90° 後鏡像
  90: (ctx, canvas, videoWidth) => {
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-videoWidth, 0);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  },
};

interface UseCanvasOverlayParams {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detector: any;
  cameraReady: boolean;
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculateBpm: (
    keypoints: any,
    updateActivity: (time: number) => void,
  ) => void;
  updateActivityTime: (time: number) => void;
}

/**
 * 負責在 canvas 上繪製姿態骨架並觸發 BPM 計算。
 * 封裝 requestAnimationFrame 迴圈、canvas transform 及 pose estimation。
 */
export const useCanvasOverlay = ({
  videoRef,
  canvasRef,
  detector,
  cameraReady,
  isActive,
  calculateBpm,
  updateActivityTime,
}: UseCanvasOverlayParams): void => {
  useEffect(() => {
    if (!detector || !videoRef.current || !cameraReady || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let rafId: number;

    async function detectAndDraw() {
      if (!video || video.paused || video.ended) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const rotationAngle = calculateRotationAngle(video);

      // 同步 canvas 解析度
      if (canvas) {
        const { width, height } = getRotatedCanvasSize(
          videoWidth,
          videoHeight,
          rotationAngle,
        );
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      }

      try {
        const poses = await detector?.estimatePoses(video);

        if (canvas && ctx) {
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 查表套用對應的座標轉換
          CANVAS_TRANSFORMS[rotationAngle]?.(ctx, canvas, videoWidth);
        }

        if (poses && poses.length > 0) {
          const pose = poses[0];
          if (canvas && ctx) {
            drawKeypoints(pose.keypoints, ctx, videoWidth, videoHeight);
            drawSkeleton(pose.keypoints, ctx, videoWidth, videoHeight);
          }
          calculateBpm(pose.keypoints, updateActivityTime);
        }

        if (canvas && ctx) {
          ctx.restore();
        }
      } catch (err) {
        console.error("Pose detection error:", err);
      }

      rafId = requestAnimationFrame(detectAndDraw);
    }

    detectAndDraw();

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
};
