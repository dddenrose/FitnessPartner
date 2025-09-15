"use client";
import { Divider, Typography } from "antd";
import ContentWrapper from "../components/ContentWrapper";
import RadiusBg from "../components/RadiusBg";
import ImageBlock from "./components/ImageBlock";
import SimpleModeSelector from "./components/SimpleModeSelector";

const CreateWorkoutPlan = () => {
  return (
    <ContentWrapper>
      <RadiusBg>
        <ImageBlock />
        <SimpleModeSelector />
      </RadiusBg>
    </ContentWrapper>
  );
};

export default CreateWorkoutPlan;
