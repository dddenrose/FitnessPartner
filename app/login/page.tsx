"use client";
import React from "react";
import { BgImage, LoginButton } from "./components";
import { Card, Typography } from "antd";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/lib/features/userInfo/userInfoSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title } = Typography;

const Login: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative w-full h-screen">
      {/* Background image positioned absolutely at the bottom layer */}
      <div className="absolute inset-0 z-0">
        <BgImage />
      </div>

      {/* Login form positioned absolutely on top with higher z-index */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Card
          className="w-full max-w-md mx-4 shadow-xl bg-white/95"
          bordered={false}
        >
          <Title level={2} className="text-center mb-6">
            Fitness Partner
          </Title>
          <LoginButton />
        </Card>
      </div>
    </div>
  );
};

export default Login;
