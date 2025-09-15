// app/create-workout-plan/components/SimpleModeSelector/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  WorkoutModeType,
  setWorkoutType,
  setBpm,
  setMode,
} from "@/lib/features/exercise/exerciseSlice";
import { ThunderboltOutlined, RocketOutlined } from "@ant-design/icons";
import {
  Tabs,
  Typography,
  Slider,
  InputNumber,
  Row,
  Col,
  Card,
  Space,
  Alert,
  Button,
} from "antd";
import type { TabsProps } from "antd";
import PlanForm from "../PlanForm";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const SimpleModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.exercise.workoutType);
  const currentBpm = useAppSelector((state) => state.exercise.bpm) || 180;

  const workoutType = useAppSelector((state) => state.exercise.workoutType);
  const router = useRouter();

  const handleSlowRunStart = () => {
    dispatch(setMode("exercise"));
    router.push("/exercise");
  };
  const [bpm, setBpmState] = useState<number>(currentBpm);

  const handleModeChange = (activeKey: string) => {
    const newMode = activeKey as WorkoutModeType;
    dispatch(setWorkoutType(newMode));
  };

  const handleBpmChange = (newValue: number | null) => {
    if (newValue !== null) {
      setBpmState(newValue);
      dispatch(setBpm(newValue));
    }
  };

  // 當運動模式改變時，如果是超慢跑，確保 BPM 已設定
  useEffect(() => {
    if (currentMode === "slowrun" && !currentBpm) {
      dispatch(setBpm(180)); // 默認值
    }
  }, [currentMode, currentBpm, dispatch]);

  // 超慢跑設定內容
  const slowRunContent = (
    <>
      <Row align="middle">
        <Col span={5}>
          <Text>BPM (步頻):</Text>
        </Col>
        <Col span={15}>
          <Slider
            min={160}
            max={200}
            step={2}
            value={bpm}
            onChange={handleBpmChange}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={160}
            max={200}
            style={{ marginLeft: "16px" }}
            value={bpm}
            onChange={handleBpmChange}
          />
        </Col>
      </Row>
      <Text type="secondary">建議步頻: 180 BPM（每分鐘步數）</Text>
      <Button
        type="primary"
        onClick={handleSlowRunStart}
        size="large"
        style={{ marginTop: "15px" }}
      >
        開始超慢跑訓練
      </Button>
    </>
  );

  const items: TabsProps["items"] = [
    {
      key: "slowrun",
      label: "超慢跑訓練",
      children: slowRunContent,
    },
    {
      key: "hiit",
      label: "HIIT 訓練",
      children: <PlanForm />,
    },
  ];

  return (
    <div style={{ marginBottom: "20px", width: "100%", maxWidth: 600 }}>
      <Tabs
        activeKey={currentMode}
        items={items}
        onChange={handleModeChange}
        style={{ marginTop: "15px" }}
        size="large"
      />
    </div>
  );
};

export default SimpleModeSelector;
