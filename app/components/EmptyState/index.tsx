"use client";

import React from "react";
import { Empty, Button } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface EmptyStateProps {
  /** 標題 */
  title?: string;
  /** 描述文字 */
  description?: string;
  /** 自訂圖示 */
  icon?: React.ReactNode;
  /** 操作按鈕 */
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | {
        label: string;
        onClick: () => void;
      }[];
  /** 自訂 className */
  className?: string;
}

/**
 * 空狀態組件
 * 用於顯示無資料或無結果的情況
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = "沒有資料",
  description = "目前沒有可顯示的內容",
  icon,
  action,
  className,
}) => {
  const renderActions = () => {
    if (!action) return null;

    const actions = Array.isArray(action) ? action : [action];

    return (
      <div className="flex gap-3 justify-center mt-6">
        {actions.map((btn, idx) => (
          <Button
            key={idx}
            type={idx === 0 ? "primary" : "default"}
            onClick={btn.onClick}
            aria-label={btn.label}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "py-12",
        "px-4",
        className
      )}
    >
      <Empty
        description={description}
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        style={{
          color: "var(--text-secondary)",
        }}
      >
        {title && (
          <p
            className="text-lg font-semibold mt-4"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </p>
        )}
        {renderActions()}
      </Empty>
    </div>
  );
};

export default EmptyState;
