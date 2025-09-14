import React from "react";
import {
  DoubleRightOutlined,
  MutedOutlined,
  PauseOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  RollbackOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { setIsGlobalPlaying } from "@/lib/features/audio/audioSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/hooks/index";
import { setTime, setPause } from "@/lib/features/exercise/exerciseSlice";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/index";

/**
 * 統一的控制面板組件，整合所有控制按鈕
 */
const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalApi, context] = Modal.useModal();

  // 狀態獲取
  const pause = useAppSelector((state) => state.exercise.pause);
  const time = useAppSelector((state) => state.exercise.times);
  const initialTime = useAppSelector((state) => state.exercise.initialTime);
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );

  // 是否為手機版面
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 按鈕處理函數
  const handlePause = () => {
    dispatch(setPause(!pause));
  };

  const handleSkip = () => {
    if (time.length < 2) return;
    dispatch(setTime(time.slice(1)));
  };

  const handleAudio = () => {
    dispatch(setIsGlobalPlaying(!isGlobalPlaying));
  };

  const handleBack = () => {
    modalApi.confirm({
      title: "確定要返回嗎？",
      content: "所有進度將會遺失",
      onOk: () => {
        dispatch(setTime(initialTime));
        dispatch(setPause(false));
        router.push("/create-workout-plan");
      },
    });
  };

  // 按鈕樣式
  const buttonStyle = {
    width: isMobile ? 70 : 100,
    height: isMobile ? 70 : 100,
    fontSize: isMobile ? 24 : 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {context}
      <Flex gap={16} wrap="wrap" justify="center">
        <Button
          onClick={handlePause}
          style={buttonStyle}
          type="default"
          shape="circle"
          size="large"
        >
          {pause ? <RightOutlined /> : <PauseOutlined />}
        </Button>

        <Button
          onClick={handleSkip}
          style={buttonStyle}
          type="default"
          shape="circle"
          size="large"
        >
          <DoubleRightOutlined />
        </Button>

        <Button
          onClick={handleAudio}
          style={buttonStyle}
          type="default"
          shape="circle"
          size="large"
        >
          {isGlobalPlaying ? <SoundOutlined /> : <MutedOutlined />}
        </Button>

        <Button
          onClick={handleBack}
          style={buttonStyle}
          type="primary"
          danger
          shape="circle"
          size="large"
        >
          <RollbackOutlined />
        </Button>
      </Flex>
    </>
  );
};

export default ControlPanel;
