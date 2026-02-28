"use client";
import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectFirebaseUser } from "@/lib/features/userInfo/userInfoSlice";

const AvatarUpload: React.FC = () => {
  const user = useSelector(selectFirebaseUser);
  const photoURL = user?.photoURL || undefined;
  const displayName = user?.displayName || "User";
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar
        size={96}
        src={photoURL}
        icon={!photoURL ? <UserOutlined /> : undefined}
        alt={displayName}
      >
        {!photoURL && avatarText}
      </Avatar>
      <span className="text-base font-semibold">{displayName}</span>
    </div>
  );
};

export default AvatarUpload;
