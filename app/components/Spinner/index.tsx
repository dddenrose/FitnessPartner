"use client";

import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface SpinnerProps {
  /** Spinner 大小 */
  size?: "small" | "default" | "large";
  /** 是否全屏顯示 */
  fullscreen?: boolean;
  /** 載入提示文字 */
  tip?: string;
  /** 自訂 className */
  className?: string;
  /** Spinner 樣式 */
  style?: React.CSSProperties;
}

/**
 * 統一的加載指示器組件
 * 用於載入和處理中的狀態顯示
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = "default",
  fullscreen = false,
  tip = "載入中...",
  className,
  style,
}) => {
  const spinnerIcon = (
    <LoadingOutlined
      style={{
        fontSize: size === "large" ? 48 : size === "small" ? 24 : 32,
        color: "var(--color-primary-500)",
      }}
    />
  );

  if (fullscreen) {
    return (
      <div
        className={classNames(
          "fixed",
          "inset-0",
          "flex",
          "items-center",
          "justify-center",
          "bg-black/30",
          "backdrop-blur-sm",
          "z-50",
          className
        )}
        style={style}
      >
        <div
          className="rounded-lg p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <Spin
            indicator={spinnerIcon}
            tip={tip}
            size={size}
            style={{
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "flex",
        "justify-center",
        "items-center",
        className
      )}
      style={style}
    >
      <Spin
        indicator={spinnerIcon}
        tip={tip}
        size={size}
        style={{
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
};

export default Spinner;
