import Image from "next/image";
import React from "react";
import image1 from "@/app/static/106.jpg";

const BORDER_RADIUS = 8;

const ImageBlock = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 200,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <Image
        src={image1}
        alt="Full Screen Background"
        fill
        style={{ objectFit: "cover", borderRadius: BORDER_RADIUS }}
      />
    </div>
  );
};

export default ImageBlock;
