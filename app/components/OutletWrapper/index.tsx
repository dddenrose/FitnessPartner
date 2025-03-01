"use client";
import { useAppSelector } from "@/lib/hooks";
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
        padding: isNavigationShow ? "36px 0px 0px 0px" : 0,
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default OutletWrapper;
