import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@mui/material/styles";
import StoreProvider from "./StoreProvider";
import theme from "./theme";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintess Partner",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} p-0 m-0 bg-slate-50 w-full max-w-full overflow-x-hidden`}
      >
        <div className="flex justify-center w-full">
          <div className="flex flex-col justify-center align-middle w-full">
            <AntdRegistry>
              <Navigation />
              <AppRouterCacheProvider>
                <StoreProvider>
                  <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </StoreProvider>
              </AppRouterCacheProvider>
            </AntdRegistry>
          </div>
        </div>
      </body>
    </html>
  );
}
