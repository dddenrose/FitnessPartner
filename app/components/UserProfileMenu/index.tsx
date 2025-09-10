"use client";
import React from "react";
import { Avatar, Dropdown, Space, Button, message } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import {
  selectFirebaseUser,
  selectIsAuthenticated,
} from "@/lib/features/userInfo/userInfoSlice";
import Link from "next/link";

const UserProfileMenu: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectFirebaseUser);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      message.success("You have been logged out");
    } catch (error: any) {
      console.error("Logout error:", error);
      message.error(`Logout failed: ${error.message}`);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login">
        <Button type="text">Login</Button>
      </Link>
    );
  }

  // Get display name or first part of email for users without display names
  const displayName =
    user.displayName || (user.email ? user.email.split("@")[0] : "User");
  // Get first letter as avatar text when no photo URL is available
  const avatarText = displayName.charAt(0).toUpperCase();

  const menuItems = [
    {
      key: "1",
      label: (
        <a onClick={() => message.info("Profile page - Coming soon")}>
          <Space>
            <UserOutlined />
            Profile
          </Space>
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a onClick={() => message.info("Settings - Coming soon")}>
          <Space>
            <SettingOutlined />
            Settings
          </Space>
        </a>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "3",
      label: (
        <a onClick={handleSignOut}>
          <Space>
            <LogoutOutlined />
            Sign out
          </Space>
        </a>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Space className="cursor-pointer">
        <Avatar src={user.photoURL || undefined} alt={displayName}>
          {!user.photoURL && avatarText}
        </Avatar>
        <span className="hidden md:inline">{displayName}</span>
      </Space>
    </Dropdown>
  );
};

export default UserProfileMenu;
