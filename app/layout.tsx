import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ConfigProvider, Flex } from "antd";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Navigation from "./components/Navigation";
import OutletWrapper from "./components/OutletWrapper";
import StoreProvider from "./StoreProvider";
import ThemeProvider from "./components/ThemeProvider";
import DynamicAntdTheme from "./components/DynamicAntdTheme";
import "./globals.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase";
import dynamic from "next/dynamic";

// Import AuthProvider with dynamic to avoid SSR issues with Firebase
const AuthProvider = dynamic(() => import("./components/AuthProvider"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

const roboto = Bricolage_Grotesque({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neo - Fitness Partner",
  description: "Your personal fitness companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} p-0 m-0`}>
        <AntdRegistry>
          <StoreProvider>
            <ThemeProvider>
              <DynamicAntdTheme>
                <Flex vertical justify="flex-start">
                  <AuthProvider>
                    <Navigation />
                    <AppRouterCacheProvider>
                      <OutletWrapper>{children}</OutletWrapper>
                    </AppRouterCacheProvider>
                  </AuthProvider>
                </Flex>
              </DynamicAntdTheme>
            </ThemeProvider>
          </StoreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
