import { message } from "antd";
import { AxiosError } from "axios";

/**
 * 將不同類型的錯誤轉換為標準化的錯誤訊息
 * 
 * @param error - 捕獲的錯誤對象
 * @returns 標準化的錯誤訊息
 */
export function formatErrorMessage(error: any): string {
  // 處理 Axios 錯誤
  if (error instanceof AxiosError) {
    if (error.response) {
      // 服務器返回了錯誤狀態碼
      const status = error.response.status;
      const data = error.response.data;
      
      // 嘗試從響應中獲取錯誤訊息
      const serverMessage = data?.message || data?.error || JSON.stringify(data);
      
      switch (status) {
        case 401:
          return `驗證失敗：${serverMessage || "請重新登入"}`;
        case 403:
          return `權限不足：${serverMessage || "無法訪問此資源"}`;
        case 404:
          return `找不到資源：${serverMessage || "請求的資源不存在"}`;
        case 500:
          return `伺服器錯誤：${serverMessage || "請稍後再試"}`;
        default:
          return `請求錯誤 (${status}): ${serverMessage}`;
      }
    } else if (error.request) {
      // 請求發出，但沒有收到響應
      return "網路連接問題，請檢查您的網路設置";
    } else {
      // 設置請求時發生錯誤
      return `請求錯誤：${error.message}`;
    }
  } 
  // 處理 Firebase 錯誤
  else if (error.code && error.code.startsWith("auth/")) {
    switch (error.code) {
      case "auth/user-not-found":
        return "找不到此用戶，請檢查您的登入資訊";
      case "auth/wrong-password":
        return "密碼錯誤，請重新輸入";
      case "auth/email-already-in-use":
        return "此電子郵件已被註冊";
      case "auth/invalid-email":
        return "無效的電子郵件格式";
      case "auth/weak-password":
        return "密碼強度不足，請設置更複雜的密碼";
      case "auth/network-request-failed":
        return "網路連接問題，請檢查您的網路設置";
      default:
        return `認證錯誤：${error.message}`;
    }
  }
  // 處理一般錯誤
  else if (error instanceof Error) {
    return error.message;
  }
  // 處理其他未知錯誤
  else {
    return String(error);
  }
}

/**
 * 根據錯誤的嚴重性顯示不同類型的通知
 * 
 * @param error - 錯誤對象或錯誤訊息
 * @param severity - 錯誤嚴重性 ('error', 'warning', 'info')
 */
export function showErrorNotification(error: any, severity: 'error' | 'warning' | 'info' = 'error'): void {
  const errorMessage = formatErrorMessage(error);
  
  switch (severity) {
    case 'error':
      message.error(errorMessage);
      break;
    case 'warning':
      message.warning(errorMessage);
      break;
    case 'info':
      message.info(errorMessage);
      break;
  }
}

/**
 * 通用的錯誤處理函數，可用於 Promise 錯誤處理
 * 
 * @param error - 捕獲的錯誤對象
 * @param showNotification - 是否顯示錯誤通知
 * @returns 格式化的錯誤訊息
 * 
 * @example
 * fetch('/api/data')
 *   .then(response => response.json())
 *   .catch(handleApiError);
 */
export function handleApiError(error: any, showNotification = true): string {
  const errorMessage = formatErrorMessage(error);
  
  // 記錄到控制台
  console.error("API 錯誤:", error);
  
  // 顯示通知
  if (showNotification) {
    showErrorNotification(error);
  }
  
  return errorMessage;
}

/**
 * 包裝 async 函數，自動處理錯誤
 * 
 * @param fn - 要執行的異步函數
 * @param errorHandler - 自定義錯誤處理函數
 * @returns 包裝後的異步函數
 * 
 * @example
 * const safeLoadData = withErrorHandling(loadData);
 * const result = await safeLoadData();
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: any) => void
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        handleApiError(error);
      }
      return null;
    }
  };
}