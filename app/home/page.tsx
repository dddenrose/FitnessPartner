import React from "react";
import image1 from "@/app/static/106.jpg";
import image2 from "@/app/static/107.jpg";
import Image from "next/image";
import classNames from "classnames";
import BorderImage from "../components/BorderImage/BorderImage";
import ThreeImage from "./components/ThreeImage/page";
import OurStory from "./components/OurStory/page";
import Introduction from "./components/Introduction/page";
import Footer from "./components/Footer/Footer";

const Home = () => {
  return (
    <div className={classNames("flex", "flex-col", "align-middle")}>
      {/* Image */}
      <div style={{ position: "relative", width: "100vw", height: "840px" }}>
        <Image
          src={image1}
          alt="Full Screen Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Neo Introduction */}
      <Introduction />

      {/* Three Image */}
      <ThreeImage />

      {/* Our story */}
      <OurStory />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
