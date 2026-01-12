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
  const displayWidth = videoElement.clientWidth;
  const displayHeight = videoElement.clientHeight;

  // 判斷 video 原始方向（橫向 or 直向）
  const videoIsLandscape = videoWidth > videoHeight;

  // 判斷實際顯示方向（橫向 or 直向）
  const displayIsLandscape = displayWidth > displayHeight;

  // 反轉邏輯：如果 video 和顯示的方向一致，才需要旋轉 90 度
  // 因為手機前鏡頭的座標系統與實際顯示方向相反
  const needsRotation = videoIsLandscape === displayIsLandscape;

  return needsRotation ? 90 : 0;
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
  // 90 度或 270 度需要對調寬高
  if (rotationAngle === 90 || rotationAngle === 270) {
    return {
      width: videoHeight,
      height: videoWidth,
    };
  }

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
  if (rotationAngle === 0) return;

  const { width, height } = canvas;

  switch (rotationAngle) {
    case 90:
      // 順時針旋轉 90 度：先旋轉，再向下平移修正位置
      ctx.rotate(Math.PI / 2);
      ctx.translate(0, -width);
      break;
    case 180:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 270:
      // 逆時針旋轉 90 度：先旋轉，再向右平移修正位置
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-height, 0);
      break;
  }
};
