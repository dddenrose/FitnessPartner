"use client";
import React from "react";
import image1 from "@/app/static/106.jpg";
import Image from "next/image";
import { Typography } from "antd";
import classNames from "classnames";
import { useRouter } from "next/navigation";

const ImageBlock = () => {
  const router = useRouter();
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Image
        src={image1}
        alt="Full Screen Background"
        fill
        style={{ objectFit: "cover" }}
      />
      <div
        className={classNames(
          "absolute",
          "top-1/2",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "text-6xl",
          "hover:text-7xl",
          "transition-all",
          "duration-500",
          "cursor-pointer",
          "align-middle",
          "text-center",
          "underline",
          "underline-offset-4",
          "text-white"
        )}
        onClick={() => {
          router.push("create-workout-plan");
        }}
      >
        Better Than
        <br />
        Yesterday.
      </div>
    </div>
  );
};

export default ImageBlock;
