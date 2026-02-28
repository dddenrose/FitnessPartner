"use client";
import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import React from "react";
import image3 from "@/app/static/109.jpg";

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

interface BorderImageProps {
  information?: { title: string; content: string };
  imageSrc?: StaticImageData;
}

const BorderImage = (props: BorderImageProps) => {
  const { information, imageSrc = image3 } = props;

  return (
    <div
      className={classNames(
        "w-48",
        "md:w-60",
        "h-60",
        "md:h-80",
        "relative",
        "group"
      )}
    >
      <div
        className={classNames(
          "absolute",
          "text-sm",
          "bg-gray-700/60",
          "w-full",
          "h-full",
          "rounded-3xl",
          "border-gray-500",
          "border-2",
          "opacity-0",
          "group-hover:opacity-100",
          "transition-opacity",
          "duration-300",
          "p-4"
        )}
      >
        {/* Title */}
        <div
          className={classNames("text-2xl", "font-bold", "mb-4", "text-white")}
        >
          {information?.title}
        </div>

        {/* Content */}
        <div className={classNames("text-white")}>{information?.content}</div>
      </div>

      {/* Image */}
      <Image
        alt={information?.title || "特色圖片"}
        src={imageSrc}
        className={classNames(
          "rounded-3xl",
          "border-gray-500",
          "border-2",
          "object-cover",
          "aspect-square",
          "block",
          "h-full"
        )}
      />
    </div>
  );
};

export default BorderImage;
