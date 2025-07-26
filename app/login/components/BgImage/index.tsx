"use client";
import React from "react";
import image1 from "@/app/static/106.jpg";
import Image from "next/image";

const BgImage: React.FC = () => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        src={image1}
        alt="Full Screen Background"
        fill
        priority
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
};

export default BgImage;
