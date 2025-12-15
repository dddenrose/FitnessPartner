/**
 * Canvas 旋轉工具函數
 * 處理不同螢幕方向下的 Canvas 座標轉換
 */

/**
 * 計算需要的旋轉角度
 * @param videoWidth - Video 原始寬度
 * @param videoHeight - Video 原始高度
 * @returns 旋轉角度 (0, 90, 180, 270)
 */
export const calculateRotationAngle = (
  videoWidth: number,
  videoHeight: number
): number => {
  // 嘗試取得螢幕方向
  if (typeof window === "undefined" || !window.screen?.orientation) {
    // 降級方案：根據視窗尺寸判斷
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 如果 video 是橫的但視窗是直的
    if (videoWidth > videoHeight && windowHeight > windowWidth) {
      return 90;
    }
    // 如果 video 是直的但視窗是橫的
    if (videoWidth < videoHeight && windowWidth > windowHeight) {
      return 270;
    }
    return 0;
  }

  const orientation = window.screen.orientation.type;
  const isVideoLandscape = videoWidth > videoHeight;

  // Portrait 模式
  if (orientation.includes("portrait")) {
    if (isVideoLandscape) {
      // Video 是橫的，螢幕是直的
      return orientation === "portrait-secondary" ? 270 : 90;
    }
    // Video 和螢幕都是直的
    return orientation === "portrait-secondary" ? 180 : 0;
  }

  // Landscape 模式
  if (orientation.includes("landscape")) {
    if (!isVideoLandscape) {
      // Video 是直的，螢幕是橫的
      return orientation === "landscape-secondary" ? 270 : 90;
    }
    // Video 和螢幕都是橫的，但可能是相反方向
    return orientation === "landscape-secondary" ? 180 : 0;
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
  // 90° 或 270° 需要對調寬高
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
      ctx.translate(width, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 180:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 270:
      ctx.translate(0, height);
      ctx.rotate(-Math.PI / 2);
      break;
  }
};
