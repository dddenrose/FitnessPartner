import {
  MutedOutlined,
  QuestionCircleOutlined,
  RollbackOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { FloatButton, Modal } from "antd";
import { setIsGlobalPlaying, stopAudio } from "@/lib/features/audio/audioSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/hooks/index";
import { setTime, setPause } from "@/lib/features/exercise/exerciseSlice";
import { useRouter } from "next/navigation";

const FloatFunctions: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );
  const initialTime = useAppSelector((state) => state.exercise.initialTime);
  const [modalApi, context] = Modal.useModal();

  const handleAudio = () => {
    dispatch(setIsGlobalPlaying(!isGlobalPlaying));
    console.log("try some random commit...");
  };

  return (
    <>
      {context}
      <FloatButton.Group shape="square" style={{ insetInlineEnd: 24 }}>
        <FloatButton
          icon={isGlobalPlaying ? <SoundOutlined /> : <MutedOutlined />}
          onClick={() => handleAudio()}
        />
        <FloatButton
          icon={<RollbackOutlined />}
          onClick={() => {
            modalApi.confirm({
              title: "Are you sure you want to go back?",
              content: "All your progress will be lost",
              onOk: () => {
                dispatch(setTime(initialTime));
                dispatch(setPause(false));
                router.push("/create-workout-plan");
              },
            });
          }}
          type="primary"
        />
      </FloatButton.Group>
    </>
  );
};

export default FloatFunctions;
