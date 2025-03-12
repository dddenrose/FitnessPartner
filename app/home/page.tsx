import classNames from "classnames";
import Footer from "./components/Footer/Footer";
import ImageBlock from "./components/ImageBlock";
import Introduction from "./components/Introduction/page";
import OurStory from "./components/OurStory/page";
import ThreeImage from "./components/ThreeImage/page";

const Home = () => {
  return (
    <div className={classNames("flex", "flex-col", "align-middle")}>
      {/* Image */}
      <ImageBlock />

      {/* Neo Introduction */}
      <Introduction />

      {/* Three Image */}
      <ThreeImage />

      {/* Our story */}
      {/* <OurStory /> */}

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
