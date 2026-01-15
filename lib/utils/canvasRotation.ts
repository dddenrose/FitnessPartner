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

  // 1. 直式判斷 (Portrait)
  // 當 video 高度 > 寬度時，代表影片串流本身已經是直向，不需要額外旋轉矯正
  if (videoHeight > videoWidth) {
    return 0;
  }

  // 2. 橫式判斷 (Landscape)
  if (typeof window !== "undefined") {
    // 優先檢查明確的 "secondary" 類型 (此為大多數裝置的逆時針橫躺)
    if (
      window.screen &&
      window.screen.orientation &&
      window.screen.orientation.type &&
      window.screen.orientation.type.includes("landscape-secondary")
    ) {
      return 0;
    }

    // 針對 window.screen.orientation.angle 為 -90 的情況 (逆時針橫躺)
    if (
      window.screen &&
      window.screen.orientation &&
      window.screen.orientation.angle === -90
    ) {
      return 0;
    }

    // 如果是明確的 Landscape Primary (通常是順時針橫躺)
    // 根據觀察到的現象，這時需要 180 度翻轉以校正感測器方向
    if (
      window.screen &&
      window.screen.orientation &&
      window.screen.orientation.type &&
      window.screen.orientation.type.includes("landscape-primary")
    ) {
      return 180;
    }
  }

  // 預設情況 (PC 瀏覽器、無法辨識的橫向)
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
