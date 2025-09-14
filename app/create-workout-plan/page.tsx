import React from "react";
import PlanForm from "./components/PlanForm";
import ContentWrapper from "../components/ContentWrapper";
import RadiusBg from "../components/RadiusBg";
import ImageBlock from "./components/ImageBlock";
import SimpleModeSelector from "./components/SimpleModeSelector";

const CreateWourkoutPlan = () => {
  return (
    <ContentWrapper>
      <RadiusBg>
        <ImageBlock />
        <SimpleModeSelector />
        <PlanForm />
      </RadiusBg>
    </ContentWrapper>
  );
};

export default CreateWourkoutPlan;
