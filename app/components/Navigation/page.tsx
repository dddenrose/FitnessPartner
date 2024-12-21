"use client";
import React from "react";
import { Button, Flex } from "antd";

const Navigation = () => {
  return (
    <div
      style={{
        padding: "16px 10%",
        backgroundColor: "gray",
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
