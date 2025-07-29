"use client";
import React, { useState, useEffect } from "react";
import { Button, Flex, Space, Tooltip } from "antd";
import {
  FieldNumberOutlined,
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { routerMap } from "./const";
import { useAppSelector } from "@/lib/hooks";
import UserProfileMenu from "../UserProfileMenu";

// 定義導航項的圖標
const navIcons = {
  Home: <HomeOutlined />,
  "Workout Plan": <CalendarOutlined />,
  Execrise: <ThunderboltOutlined />,
  "Workout Report": <BarChartOutlined />,
};

const Link = ({ title }: { title: keyof typeof routerMap }) => {
  const router = useRouter();
  const pathname = usePathname(); // 使用 Next.js 的 usePathname 獲取當前路徑
  const targetPath = routerMap[title];
  const icon = navIcons[title as keyof typeof navIcons];

  // 透過直接比較 pathname 與 targetPath 來確定是否為活動狀態
  const isActive = React.useMemo(() => {
    // 如果 pathname 還沒有準備好，則使用 window.location.pathname
    const currentPath = pathname || window.location.pathname;

    // 根路徑特殊處理
    if (targetPath === "/" && (currentPath === "/" || currentPath === "")) {
      return true;
    }

    // 精確匹配
    if (currentPath === targetPath) {
      return true;
    }

    // 子路徑匹配 (非首頁時)
    if (targetPath !== "/" && currentPath?.startsWith(targetPath)) {
      return true;
    }

    return false;
  }, [pathname, targetPath]);

  return (
    <Tooltip title={title}>
      <Button
        type="text"
        style={{
          color: isActive ? "#1890ff" : "white",
          fontSize: 13,
          letterSpacing: 0.8,
          fontWeight: isActive ? 500 : 400,
          position: "relative",
          borderRadius: 0,
          height: 44,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          overflow: "hidden",
        }}
        onClick={() => router.push(targetPath)}
      >
        {icon}
        {title}
        {isActive && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 2,
              backgroundColor: "#1890ff",
            }}
          />
        )}
      </Button>
    </Tooltip>
  );
};

const Navigation: React.FC = () => {
  const pathname = usePathname(); // 用於監聽路徑變化，強制導航組件重新渲染
  const isNavigationShow = useAppSelector(
    (state) => state.userInfo.user.isNavigationShow
  );

  return (
    isNavigationShow && (
      <Flex
        justify="center"
        style={{
          width: "100%",
          backgroundColor: "#282828FF",
          height: "44px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          position: "fixed",
          top: 0,
          zIndex: 2,
          borderBottom: "1px solid #202020FF",
        }}
      >
        <Flex
          style={{ width: "80%", maxWidth: "1200px" }}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap={8}>
            <Link title="Home" />
            <Link title="Workout Plan" />
            <Link title="Execrise" />
            <Link title="Workout Report" />
          </Flex>
          <Space align="center">
            <UserProfileMenu />
          </Space>
        </Flex>
      </Flex>
    )
  );
};

export default Navigation;
