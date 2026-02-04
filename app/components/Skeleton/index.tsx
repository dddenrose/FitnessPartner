"use client";

import React from "react";
import { Skeleton as AntSkeleton } from "antd";
import classNames from "classnames";

interface SkeletonProps {
  /** 骨架屏類型 */
  type?: "text" | "avatar" | "image" | "button" | "card" | "input";
  /** 數量（用於顯示多行或多個骨架） */
  count?: number;
  /** 是否顯示動畫 */
  active?: boolean;
  /** 自訂 className */
  className?: string;
}

/**
 * 統一的骨架屏組件
 * 用於載入狀態下的佔位符
 */
const Skeleton: React.FC<SkeletonProps> = ({
  type = "text",
  count = 1,
  active = true,
  className,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "avatar":
        return (
          <AntSkeleton.Avatar
            active={active}
            size="large"
            shape="circle"
            className={className}
          />
        );

      case "image":
        return (
          <AntSkeleton.Image
            active={active}
            className={className}
            style={{ width: "100%", height: 200 }}
          />
        );

      case "button":
        return (
          <AntSkeleton.Button
            active={active}
            size="large"
            block
            className={className}
          />
        );

      case "card":
        return (
          <AntSkeleton
            active={active}
            paragraph={{ rows: 4 }}
            className={className}
          />
        );

      case "input":
        return (
          <AntSkeleton.Input
            active={active}
            size="large"
            block
            className={className}
          />
        );

      case "text":
      default:
        return (
          <div className={classNames("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
              <AntSkeleton
                key={i}
                active={active}
                paragraph={{ rows: 1 }}
                title={false}
              />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default Skeleton;
