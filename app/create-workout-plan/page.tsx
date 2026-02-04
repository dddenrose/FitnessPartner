"use client";
import { Divider, Typography } from "antd";
import ContentWrapper from "../components/ContentWrapper";
import RadiusBg from "../components/RadiusBg";
import ImageBlock from "./components/ImageBlock";
import SimpleModeSelector from "./components/SimpleModeSelector";
import { useMediaQuery } from "@/lib/hooks/index";

const CreateWorkoutPlan = () => {
  const isMobile = useMediaQuery("mobile");

  const content = (
    <RadiusBg style={{ borderRadius: isMobile ? 0 : 8 }}>
      <ImageBlock />
      <SimpleModeSelector />
    </RadiusBg>
  );

  // 在手機模式下不使用 ContentWrapper，避免內容過於擁擠
  return isMobile ? content : <ContentWrapper>{content}</ContentWrapper>;
};

export default CreateWorkoutPlan;
