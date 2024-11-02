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
        "flex-col",
        "w-full",
        "justify-center",
        "items-center",
        "pt-12",
        "pb-12",
        "gap-10",
        "bg-gray-200"
      )}
    >
      {/* Three Images */}
      <div className="flex justify-between w-3/5">
        <BorderImage imageSrc={image1} />
        <BorderImage imageSrc={image2} />
        <BorderImage imageSrc={image3} />
      </div>

      {/* Brand Story */}
      <div className="flex w-3/5">
        <div className="text-3xl font-bold flex-1">Sportage Exercise Elite</div>
        <div className="flex-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </div>
  );
};

export default ThreeImage;
