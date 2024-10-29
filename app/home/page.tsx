import React from "react";
import image1 from "@/app/static/105.jpg";
import Image from "next/image";

const Home = () => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Image
        src={image1}
        alt="Full Screen Background"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default Home;
