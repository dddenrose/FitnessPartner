// app/exercise/components/WorkoutModeSelector/index.tsx
"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  WorkoutModeType,
  setWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";

import {
  ThunderboltOutlined,
  FireOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Typography } from "antd";

const { Title } = Typography;

interface ModeTileProps {
  mode: WorkoutModeType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const ModeTile: React.FC<ModeTileProps> = ({
  mode,
  title,
  description,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <Card
      hoverable
      className={`workout-mode-card ${isSelected ? "selected-mode" : ""}`}
      onClick={onClick}
      style={{
        margin: "10px",
        border: isSelected ? "2px solid #1890ff" : "1px solid #f0f0f0",
        backgroundColor: isSelected ? "#e6f7ff" : "white",
      }}
    >
      <div style={{ textAlign: "center", padding: "10px" }}>
        <div
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
            color: isSelected ? "#1890ff" : "#595959",
          }}
        >
          {icon}
        </div>
        <Title
          level={4}
          style={{
            margin: "0 0 10px 0",
            color: isSelected ? "#1890ff" : "inherit",
          }}
        >
          {title}
        </Title>
        <p style={{ color: "#8c8c8c" }}>{description}</p>
      </div>
    </Card>
  );
};

const WorkoutModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.exercise.workoutType);

  const handleModeSelection = (mode: WorkoutModeType) => {
    dispatch(setWorkoutType(mode));
  };

  const workoutModes = [
    {
      mode: "standard" as WorkoutModeType,
      title: "標準模式",
      description: "傳統健身訓練，按照設定的時間和休息間隔進行",
      icon: <FireOutlined />,
    },
    {
      mode: "slowrun" as WorkoutModeType,
      title: "超慢跑模式",
      description: "輕鬆慢跑訓練，專注於持久力和穩定節奏",
      icon: <RocketOutlined />,
    },
    {
      mode: "hiit" as WorkoutModeType,
      title: "HIIT模式",
      description: "高強度間歇訓練，快速提升心肺能力和燃燒脂肪",
      icon: <ThunderboltOutlined />,
    },
    {
      mode: "custom" as WorkoutModeType,
      title: "自定義模式",
      description: "根據個人需求自由配置訓練方式和參數",
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div className="workout-mode-selector">
      <Title level={3} style={{ margin: "20px 0", textAlign: "center" }}>
        選擇運動模式
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {workoutModes.map((modeData) => (
          <Col xs={24} sm={12} md={12} lg={6} key={modeData.mode}>
            <ModeTile
              mode={modeData.mode}
              title={modeData.title}
              description={modeData.description}
              icon={modeData.icon}
              isSelected={currentMode === modeData.mode}
              onClick={() => handleModeSelection(modeData.mode)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WorkoutModeSelector;
