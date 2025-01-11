import Image from "next/image";
import React from "react";
import image1 from "@/app/static/106.jpg";

const ImageBlock = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 200,
        borderRadius: 8,
      }}
    >
      <Image
        src={image1}
        alt="Full Screen Background"
        fill
        style={{ objectFit: "cover", borderRadius: 8 }}
      />
    </div>
  );
};

export default ImageBlock;
