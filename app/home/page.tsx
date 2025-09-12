import classNames from "classnames";
import ImageBlock from "./components/ImageBlock";
import Introduction from "./components/Introduction";
import ThreeImage from "./components/ThreeImage";

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
