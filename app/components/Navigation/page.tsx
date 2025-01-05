"use client";
import React from "react";
import { Button, Flex } from "antd";

const Navigation = () => {
  return (
    <div
      style={{
        padding: "8px 10%",
        backgroundColor: "#C5C5C5FF",
      }}
    >
      <Flex justify="space-between" align="center">
        <div>Home</div>
        <div>About</div>
        <div>Services</div>
        <div>Contact</div>
        <Button>Login</Button>
      </Flex>
    </div>
  );
};

export default Navigation;
