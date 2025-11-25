import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

interface UsePoseDetectionProps {
  isActive: boolean;
}

export const usePoseDetection = ({ isActive }: UsePoseDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  );
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化 TensorFlow 模型
  useEffect(() => {
    if (!isActive) return;

    async function setupModel() {
      try {
        await tf.ready();

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
      } catch (err) {
        setError("無法加載姿態偵測模型");
        console.error("Model loading error:", err);
      }
    }

    setupModel();
  }, [isActive]);

  // 設置攝像頭
  useEffect(() => {
    if (!isActive) return;

    const videoElement = videoRef.current;

    async function setupCamera() {
      if (!videoElement) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        videoElement.srcObject = stream;
        setCameraReady(true);
      } catch (err) {
        setError("無法訪問攝像頭");
        console.error("Camera access error:", err);
      }
    }

    setupCamera();

    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  return {
    videoRef,
    canvasRef,
    detector,
    cameraReady,
    error,
  };
};
