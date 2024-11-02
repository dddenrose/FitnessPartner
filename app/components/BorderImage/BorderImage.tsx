"use client";
import classNames from "classnames";
import Image from "next/image";
import React from "react";
import image3 from "@/app/static/109.jpg";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const BorderImage = () => {
  return (
    <div className={classNames("w-60", "h-80", "relative", "group")}>
      <div
        className={classNames(
          "absolute",
          "text-sm",
          "bg-red-400/70",
          "w-full",
          "h-full",
          "rounded-3xl",
          "border-gray-500",
          "border-2",
          "opacity-0",
          "group-hover:opacity-100",
          "transition-opacity",
          "duration-300"
        )}
      >
        {lorem}
      </div>
      <Image
        alt="running image"
        src={image3}
        className={classNames("rounded-3xl", "border-gray-500", "border-2")}
        style={{
          objectFit: "cover",
          aspectRatio: "1 / 1",
          display: "block",
          height: "100%",
        }}
      />
    </div>
  );
};

export default BorderImage;
