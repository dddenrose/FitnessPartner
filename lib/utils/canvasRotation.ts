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
  videoElement: HTMLVideoElement,
): number => {
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  // 1. 直式判斷 (Portrait)
  // 當 video 高度 > 寬度時，一定是直向。
  if (videoHeight > videoWidth) {
    return 90;
  }

  // 2. 橫式判斷 (Landscape)
  if (typeof window !== "undefined") {
    const orientationAngle = window.screen?.orientation?.angle ?? 0;

    // 角度為 0 代表螢幕的原始橫向方向（筆電、平板預設橫向）
    // 不需要任何旋轉修正，直接回傳 0（標準鏡像）
    if (orientationAngle === 0) {
      return 0;
    }

    // 依據 Log 分析：
    // landscape-secondary (270度/逆時針) -> 修正為 0 (標準鏡像)
    // landscape-primary (angle 90，手機順時針橫躺) -> 修正為 180 (旋轉/翻轉)

    // 優先檢查明確的 "secondary" 類型 (此為大多數裝置的逆時針橫躺)
    if (window.screen?.orientation?.type?.includes("landscape-secondary")) {
      // 逆時針橫躺 (270/-90) 回傳 0 (標準鏡像)
      return 0;
    }

    // 其次檢查 window.orientation (iOS Safari 常見)
    const winOrientation = (window as any).orientation;
    if (typeof winOrientation === "number" && winOrientation === -90) {
      // 逆時針橫躺 (-90) 回傳 0
      return 0;
    }

    // 針對 window.screen.orientation.angle 為 -90 的情況
    if (window.screen?.orientation?.angle === -90) {
      // 逆時針橫躺 (-90) 回傳 0
      return 0;
    }

    // 如果是明確的 Landscape Primary 且 angle 不為 0
    // 代表手機順時針橫躺（angle 90），需要 180 度翻轉修正
    if (
      window.screen?.orientation?.type?.includes("landscape-primary") &&
      orientationAngle !== 0
    ) {
      return 180;
    }
  }

  // 預設情況 (包含PC瀏覽器、無法辨識的橫向)
  // 保持使用 0 (標準鏡像)
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
  rotationAngle: number,
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
  rotationAngle: number,
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
