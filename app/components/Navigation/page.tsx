"use client";
import React from "react";
import { Button, Flex } from "antd";
import { OpenAIOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { routerMap } from "./const";
import { useAppSelector } from "@/lib/hooks";

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

const Navigation: React.FC = () => {
  const isNavigationShow = useAppSelector(
    (state) => state.userInfo.user.isNavigationShow
  );

  console.log(isNavigationShow, "===:isNavigationShow");

  return (
    isNavigationShow && (
      <Flex
        justify="center"
        style={{
          width: "100%",
          backgroundColor: "#282828FF",
          height: "60px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          zIndex: 2,
          borderBottom: "1px solid #202020FF",
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
    )
  );
};

export default Navigation;
