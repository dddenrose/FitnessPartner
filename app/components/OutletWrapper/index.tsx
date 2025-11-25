"use client";
import { useAppSelector } from "@/lib/hooks/index";
import React from "react";

const OutletWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isNavigationShow = useAppSelector(
    (state) => state.userInfo.user.isNavigationShow
  );

  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 44px)",
      }}
    >
      {children}
    </div>
  );
};

export default OutletWrapper;
