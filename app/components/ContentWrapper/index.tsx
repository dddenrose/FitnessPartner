import { Flex } from "antd";
import React from "react";

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      vertical
      align="center"
      style={{
        width: "100%",
        padding: 32,
        backgroundColor: "var(--bg-secondary)",
        minHeight: "100vh",
      }}
    >
      {children}
    </Flex>
  );
};

export default ContentWrapper;
