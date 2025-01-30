import {
  MutedOutlined,
  QuestionCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { setIsGlobalPlaying, stopAudio } from "@/lib/features/audio/audioSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/hooks";

const FloatFunctions: React.FC = () => {
  const dispatch = useDispatch();
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );

  const handleAudio = () => {
    dispatch(setIsGlobalPlaying(!isGlobalPlaying));
  };

  return (
    <FloatButton.Group shape="square" style={{ insetInlineEnd: 24 }}>
      <FloatButton
        icon={isGlobalPlaying ? <SoundOutlined /> : <MutedOutlined />}
        onClick={() => handleAudio()}
      />
      <FloatButton.BackTop visibilityHeight={0} />
    </FloatButton.Group>
  );
};

export default FloatFunctions;
