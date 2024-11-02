import React from "react";
import Image from "next/image";
import image1 from "@/app/static/110.jpg";
import classNames from "classnames";

const Story = () => {
  return (
    <div className={classNames("w-1/2", "h-80")}>
      <Image
        alt="image"
        src={image1}
        className={classNames(
          "object-cover",
          "aspect-square",
          "block",
          "h-full"
        )}
      />
    </div>
  );
};

const OurStory = () => {
  return (
    <div className="mt-8 flex flex-col gap-4 items-center">
      <div className="text-3xl font-bold">Our Story</div>
      <Story />
    </div>
  );
};

export default OurStory;
