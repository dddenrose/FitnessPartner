import React from "react";
import PlanForm from "./components/PlanForm";
import ContentWrapper from "../components/ContentWrapper";
import RadiusBg from "../components/RadiusBg";
import ImageBlock from "./components/ImageBlock";

const CreateWourkoutPlan = () => {
  return (
    <ContentWrapper>
      <RadiusBg>
        <ImageBlock />
        <PlanForm />
      </RadiusBg>
    </ContentWrapper>
  );
};

export default CreateWourkoutPlan;
