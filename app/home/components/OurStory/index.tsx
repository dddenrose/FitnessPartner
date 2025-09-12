import React from "react";
import Image from "next/image";
import image1 from "@/app/static/110.jpg";
import image2 from "@/app/static/104.jpg";
import image3 from "@/app/static/101.jpg";
import classNames from "classnames";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const Story = ({ imageSrc }: { imageSrc: any }) => (
  <div className="flex w-4/5 gap-4">
    <div className={classNames("w-1/2", "h-80", "flex-1")}>
      <Image
        alt="image"
        src={imageSrc}
        className={classNames(
          "object-cover",
          "aspect-square",
          "block",
          "h-full"
        )}
      />
    </div>
    <div className="flex-1 flex flex-col">
      <div>Dell</div>
      <div>{lorem}</div>
    </div>
  </div>
);

const OurStory = () => {
  return (
    <div className="mt-8 flex flex-col gap-8 items-center">
      <div className="text-3xl font-bold">Our Story</div>
      <Story imageSrc={image1} />
      <Story imageSrc={image2} />
      <Story imageSrc={image3} />
    </div>
  );
};

export default OurStory;
