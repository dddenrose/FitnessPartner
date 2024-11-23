"use client";
import React from "react";
import { Button, Flex } from "antd";

const Navigation = () => {
  return (
    <div
      style={{
        zIndex: 5,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 10%",
      }}
    >
      <Flex justify="space-between">
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
