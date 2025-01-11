"use client";
import React from "react";
import { Button, Flex } from "antd";
import { OpenAIOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { routerMap } from "./const";

const Link = ({ title }: { title: keyof typeof routerMap }) => {
  const router = useRouter();
  const pathName = routerMap[title];

  return (
    <Button
      type="text"
      style={{ color: "white" }}
      onClick={() => router.push(pathName)}
    >
      {title}
    </Button>
  );
};

const Navigation = () => {
  return (
    <Flex
      justify="center"
      style={{
        width: "100%",
        backgroundColor: "#282828FF",
        padding: "8px 0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex style={{ width: "70%" }} justify="space-between" align="center">
        <OpenAIOutlined style={{ color: "white" }} />
        <Link title="Home" />
        <Link title="Workout Plan" />
        <Link title="Execrise" />
        <Link title="Contact" />
        <Link title="Login" />
      </Flex>
    </Flex>
  );
};

export default Navigation;
