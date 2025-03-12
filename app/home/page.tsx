import classNames from "classnames";
import Footer from "./components/Footer/Footer";
import ImageBlock from "./components/ImageBlock";
import Introduction from "./components/Introduction/page";
import OurStory from "./components/OurStory/page";
import ThreeImage from "./components/ThreeImage/page";

const Home = () => {
  return (
    <div className={classNames("flex", "flex-col", "align-middle")}>
      <ImageBlock />
      <Introduction />
      <ThreeImage />
    </div>
  );
};

export default Home;
