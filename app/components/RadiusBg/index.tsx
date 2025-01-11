import { Flex } from "antd";
import React from "react";

const RadiusBg = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      vertical
      align="center"
      gap={24}
      style={{
        width: "100%",
        padding: 32,
        backgroundColor: "#FFFFFFFF",
        borderRadius: 8,
        minHeight: "100vh",
      }}
    >
      {children}
    </Flex>
  );
};

export default RadiusBg;
