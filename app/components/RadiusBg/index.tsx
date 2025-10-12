import { Flex } from "antd";
import React from "react";

const RadiusBg = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <Flex
      vertical
      align="center"
      gap={24}
      style={{
        width: "100%",
        padding: 32,
        backgroundColor: "var(--bg-primary)",
        borderRadius: 8,
        minHeight: "100vh",
        ...style,
      }}
    >
      {children}
    </Flex>
  );
};

export default RadiusBg;
