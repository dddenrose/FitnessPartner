"use client";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useAppSelector } from "@/lib/hooks/index";
import { selectEffectiveTheme } from "@/lib/features/theme/themeSlice";

/**
 * Dynamic Ant Design theme provider that switches between light and dark themes
 * 使用 design tokens 確保與自訂組件的視覺一致性
 */
export default function DynamicAntdTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const effectiveTheme = useAppSelector(selectEffectiveTheme);
  const isDark = effectiveTheme === "dark";

  const themeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      // Primary colors - 使用 design tokens 的 primary 色系
      colorPrimary: "#0066aa", // var(--color-primary-500)
      colorInfo: "#3b82f6", // var(--color-info-500)
      colorSuccess: "#38a169", // var(--color-success-500)
      colorWarning: "#faad14", // var(--color-warning-500)
      colorError: "#ef4444", // var(--color-error-500)

      // Base colors
      colorBgBase: isDark ? "#000000" : "#ffffff", // var(--bg-primary)
      colorTextBase: isDark ? "#ffffff" : "#1a1a1a", // var(--text-primary)

      // Background colors
      colorBgContainer: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      colorBgElevated: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      colorBgLayout: isDark ? "#0a0a0a" : "#f8f9fa", // var(--bg-secondary)
      colorBgSpotlight: isDark ? "#1a1a1a" : "#e9ecef", // var(--bg-tertiary)

      // Border colors
      colorBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", // var(--border-primary)
      colorBorderSecondary: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)", // var(--border-secondary)

      // Text colors
      colorText: isDark ? "#ffffff" : "#1a1a1a", // var(--text-primary)
      colorTextSecondary: isDark ? "#b0b0b0" : "#4a4a4a", // var(--text-secondary)
      colorTextTertiary: isDark ? "#808080" : "#6a6a6a", // var(--text-tertiary)
      colorTextDisabled: isDark ? "#4a4a4a" : "#9e9e9e", // var(--text-disabled)

      // Typography
      fontSize: 16, // var(--font-size-base)
      fontSizeHeading1: 36, // var(--font-size-4xl)
      fontSizeHeading2: 30, // var(--font-size-3xl)
      fontSizeHeading3: 24, // var(--font-size-2xl)
      fontSizeHeading4: 20, // var(--font-size-xl)
      fontSizeHeading5: 18, // var(--font-size-lg)

      // Spacing & layout
      borderRadius: 6, // var(--radius-base)
      borderRadiusLG: 12, // var(--radius-lg)
      borderRadiusSM: 4, // var(--radius-sm)

      // Motion
      motionDurationFast: "0.15s", // var(--transition-fast)
      motionDurationMid: "0.3s", // var(--transition-base)
      motionDurationSlow: "0.5s", // var(--transition-slow)
    },
    components: {
      Button: {
        primaryShadow: "0 2px 0 rgba(0, 102, 170, 0.1)",
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        paddingContentHorizontal: 16,
      },
      Input: {
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        paddingInline: 12,
      },
      Card: {
        borderRadiusLG: 12, // var(--radius-lg)
        boxShadowTertiary: isDark
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // var(--shadow-md)
      },
      Modal: {
        borderRadiusLG: 16, // var(--radius-xl)
        contentBg: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
        headerBg: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      },
      Drawer: {
        colorBgElevated: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      },
      Select: {
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
      },
      DatePicker: {
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
      },
      Table: {
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", // var(--border-primary)
        headerBg: isDark ? "#1a1a1a" : "#f8f9fa", // var(--bg-tertiary)
      },
      Menu: {
        itemBg: "transparent",
        itemSelectedBg: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)", // var(--hover-overlay)
        itemHoverBg: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)", // var(--hover-overlay)
      },
      Tooltip: {
        colorBgSpotlight: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      },
      Notification: {
        colorBgElevated: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      },
      Message: {
        contentBg: isDark ? "#1f1f1f" : "#ffffff", // var(--bg-elevated)
      },
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
