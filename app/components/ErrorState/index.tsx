"use client";

import React from "react";
import { Alert, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import classNames from "classnames";

interface ErrorStateProps {
  /** 標題 */
  title?: string;
  /** 錯誤訊息 */
  message: string;
  /** 錯誤類型 */
  type?: "error" | "warning" | "info";
  /** 詳細錯誤信息 */
  details?: string;
  /** 重試按鈕回調 */
  onRetry?: () => void;
  /** 關閉按鈕回調 */
  onClose?: () => void;
  /** 自訂 className */
  className?: string;
}

/**
 * 錯誤狀態組件
 * 用於顯示友善的錯誤訊息
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  title = "出現錯誤",
  message,
  type = "error",
  details,
  onRetry,
  onClose,
  className,
}) => {
  const typeMap = {
    error: "error",
    warning: "warning",
    info: "info",
  } as const;

  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "gap-4",
        "p-6",
        "rounded-lg",
        className
      )}
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <Alert
        type={typeMap[type]}
        icon={<ExclamationCircleOutlined />}
        message={title}
        description={
          <div className="space-y-2 mt-2">
            <p>{message}</p>
            {details && (
              <details className="text-xs opacity-75 cursor-pointer">
                <summary>詳細信息</summary>
                <pre className="mt-2 p-2 bg-black/10 rounded overflow-auto">
                  {details}
                </pre>
              </details>
            )}
          </div>
        }
        closable
        onClose={handleClose}
      />

      {onRetry && (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onRetry}
            aria-label="重試"
            block
          >
            重試
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
