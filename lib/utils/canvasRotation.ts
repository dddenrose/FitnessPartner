/**
 * Canvas 旋轉工具函數
 * 處理不同螢幕方向下的 Canvas 座標轉換
 */

/**
 * 計算需要的旋轉角度（簡化版本）
 * 直接比較 video 原始尺寸與實際顯示尺寸，避免依賴不可靠的 API
 * @param videoElement - Video 元素
 * @returns 旋轉角度 (0 或 90)
 */
export const calculateRotationAngle = (
  videoElement: HTMLVideoElement
): number => {
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  // 當 video 是直向時（高度 > 寬度），MoveNet 的座標系統可能還是橫向的
  // 所以需要旋轉 90 度來對齊
  const videoIsPortrait = videoHeight > videoWidth;

  if (videoIsPortrait) {
    return 90;
  }

  // 如果是橫向，檢查是否為逆時針橫躺 (Landscape Secondary)
  // 這通常會導致繪製的骨架上下顛倒，因此需要 180 度的修正
  if (
    typeof window !== "undefined" &&
    window.screen &&
    window.screen.orientation
  ) {
    const { type, angle } = window.screen.orientation;
    // landscape-secondary 通常是 270 度或 -90 度
    if (type === "landscape-secondary" || angle === 270 || angle === -90) {
      return 180;
    }
  }

  return 0;
};

/**
 * 計算旋轉後的 Canvas 尺寸
 * @param videoWidth - Video 原始寬度
 * @param videoHeight - Video 原始高度
 * @param rotationAngle - 旋轉角度
 * @returns { width, height } - Canvas 應該設定的尺寸
 */
export const getRotatedCanvasSize = (
  videoWidth: number,
  videoHeight: number,
  rotationAngle: number
): { width: number; height: number } => {
  // 直接回傳原始尺寸，確保 Canvas 解析度與 Video 訊號源一致
  // 避免因為對調寬高而導致 CSS 擠壓變形
  return {
    width: videoWidth,
    height: videoHeight,
  };
};

/**
 * 應用 Canvas 旋轉變換
 * @param ctx - Canvas 2D Context
 * @param canvas - Canvas 元素
 * @param rotationAngle - 旋轉角度
 */
export const applyCanvasRotation = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  rotationAngle: number
): void => {
  // 由於 rotationAngle 始終為 0，這裡保留介面但實際上不會執行旋轉
  if (rotationAngle === 0) return;

  const { width, height } = canvas;

  switch (rotationAngle) {
    case 90:
      ctx.rotate(Math.PI / 2);
      ctx.translate(0, -width);
      break;
    case 180:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 270:
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-height, 0);
      break;
  }
};
