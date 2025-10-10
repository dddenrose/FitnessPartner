"use client";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useAppSelector } from "@/lib/hooks/index";
import { selectTheme } from "@/lib/features/theme/themeSlice";

/**
 * Dynamic Ant Design theme provider that switches between light and dark themes
 */
export default function DynamicAntdTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeMode = useAppSelector(selectTheme);

  const themeConfig = {
    algorithm:
      themeMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: themeMode === "dark" ? "#0066aa" : "#0066aa",
      colorBgBase: themeMode === "dark" ? "#000000" : "#ffffff",
      colorTextBase: themeMode === "dark" ? "#ffffff" : "#1a1a1a",
      fontSize: 14,
      borderRadius: 6,
    },
    components: {
      Button: {
        colorPrimary: themeMode === "dark" ? "#0066aa" : "#0066aa",
        algorithm: true,
      },
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
