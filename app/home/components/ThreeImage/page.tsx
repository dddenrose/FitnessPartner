import BorderImage from "@/app/components/BorderImage/BorderImage";
import classNames from "classnames";
import React from "react";
import image1 from "@/app/static/108.jpg";
import image2 from "@/app/static/109.jpg";
import image3 from "@/app/static/111.jpg";

const ThreeImage = () => {
  return (
    <div
      className={classNames(
        "flex",
        "w-full",
        "justify-center",
        "pt-12",
        "pb-12",
        "bg-gray-200"
      )}
    >
      <div className="flex justify-center gap-20">
        <BorderImage imageSrc={image1} />
        <BorderImage imageSrc={image2} />
        <BorderImage imageSrc={image3} />
      </div>
    </div>
  );
};

export default ThreeImage;
