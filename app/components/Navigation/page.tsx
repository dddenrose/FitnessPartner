"use client";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import React, { useState } from "react";
import { Button, Flex, Space, Tooltip, Drawer, Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  MenuOutlined,
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

// 共用 Hook，處理導覽邏輯
const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isNavigationShow = useAppSelector(
    (state) => state.userInfo.user.isNavigationShow
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 檢查路由是否活動中
  const isRouteActive = (targetPath: string) => {
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
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setDrawerVisible(false);
  };

  return {
    pathname,
    isNavigationShow,
    isMobile,
    drawerVisible,
    setDrawerVisible,
    isRouteActive,
    navigateTo,
  };
};

// 桌面版導航組件
const DesktopNavigation: React.FC = () => {
  const { isRouteActive, navigateTo } = useNavigation();

  // 桌面版導覽項目
  const NavLink = ({ title }: { title: keyof typeof routerMap }) => {
    const targetPath = routerMap[title];
    const isActive = isRouteActive(targetPath);

    return (
      <Tooltip title={title}>
        <Button
          type="text"
          style={{
            color: isActive ? "#333333" : "#555555",
            fontSize: 13,
            letterSpacing: 0.8,
            fontWeight: isActive ? 600 : 400,
            position: "relative",
            borderRadius: 0,
            height: 44,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflow: "hidden",
            background: isActive ? "rgba(240, 240, 240, 0.8)" : "transparent",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigateTo(targetPath)}
        >
          {title}
        </Button>
      </Tooltip>
    );
  };

  return (
    <>
      <Flex align="center" gap={8}>
        <NavLink title="Home" />
        <NavLink title="Workout Plan" />
        <NavLink title="Workout Report" />
      </Flex>
      <Space align="center">
        <UserProfileMenu />
      </Space>
    </>
  );
};

// 移動版導航組件
const MobileNavigation: React.FC = () => {
  const { pathname, drawerVisible, setDrawerVisible, navigateTo } =
    useNavigation();

  return (
    <Flex align="center" justify="space-between" style={{ width: "100%" }}>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{
          fontSize: 16,
          color: "#333333",
          padding: "0 12px",
          background: "transparent",
          border: "none",
        }}
      />
      <UserProfileMenu />

      <Drawer
        title="選單"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="100%"
        height="100%"
      >
        <Menu
          mode="vertical"
          selectedKeys={[pathname || ""]}
          style={{
            border: "none",
            fontSize: "16px",
          }}
          items={[
            {
              key: routerMap["Home"],
              icon: <HomeOutlined style={{ fontSize: "18px" }} />,
              label: "Home",
              onClick: () => navigateTo(routerMap["Home"]),
            },
            {
              key: routerMap["Workout Plan"],
              icon: <CalendarOutlined style={{ fontSize: "18px" }} />,
              label: "Workout Plan",
              onClick: () => navigateTo(routerMap["Workout Plan"]),
            },
            {
              key: routerMap["Workout Report"],
              icon: <BarChartOutlined style={{ fontSize: "18px" }} />,
              label: "Workout Report",
              onClick: () => navigateTo(routerMap["Workout Report"]),
            },
          ]}
        />
      </Drawer>
    </Flex>
  );
};

// 主導航組件
const Navigation: React.FC = () => {
  const { isNavigationShow, isMobile } = useNavigation();

  return (
    isNavigationShow && (
      <Flex
        justify="center"
        style={{
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(8px)",
          height: "44px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          position: "fixed",
          top: 0,
          zIndex: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <Flex
          style={{ width: "80%", maxWidth: "1200px" }}
          align="center"
          justify="space-between"
        >
          {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
        </Flex>
      </Flex>
    )
  );
};

export default Navigation;
