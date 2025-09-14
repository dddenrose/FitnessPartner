// app/create-workout-plan/components/SimpleModeSelector/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  WorkoutModeType,
  setWorkoutType,
  setBpm,
} from "@/lib/features/exercise/exerciseSlice";
import { ThunderboltOutlined, RocketOutlined } from "@ant-design/icons";
import {
  Radio,
  Space,
  Typography,
  Slider,
  InputNumber,
  Row,
  Col,
  Card,
} from "antd";

const { Title, Text } = Typography;

const SimpleModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.exercise.workoutType);
  const currentBpm = useAppSelector((state) => state.exercise.bpm) || 180;

  const [bpm, setBpmState] = useState<number>(currentBpm);

  const handleModeChange = (e: any) => {
    dispatch(setWorkoutType(e.target.value as WorkoutModeType));
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

  return (
    <div style={{ marginBottom: "20px" }}>
      <Title level={4}>選擇運動模式</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio.Group
            onChange={handleModeChange}
            value={currentMode}
            style={{ marginTop: "10px", marginBottom: "15px" }}
          >
            <Space direction="vertical">
              <Radio value="hiit">
                <Space>
                  <ThunderboltOutlined /> HIIT 訓練
                </Space>
              </Radio>
              <Radio value="slowrun">
                <Space>
                  <RocketOutlined /> 超慢跑訓練
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Col>

        {currentMode === "slowrun" && (
          <Col span={24}>
            <Card size="small" title="超慢跑設定" style={{ marginTop: "10px" }}>
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
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default SimpleModeSelector;
