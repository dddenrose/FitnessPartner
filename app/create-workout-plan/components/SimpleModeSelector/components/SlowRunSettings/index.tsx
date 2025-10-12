"use client";

import { Button, Col, InputNumber, Row, Slider, Typography, Space } from "antd";
import React from "react";
import { MIN_BPM, MAX_BPM, BPM_STEP, DEFAULT_BPM } from "../../const";
import { useMediaQuery } from "@/lib/hooks/index";

const { Text } = Typography;

interface SlowRunSettingsProps {
  bpm: number;
  onBpmChange: (bpm: number | null) => void;
  onStart: () => void;
}

const SlowRunSettings: React.FC<SlowRunSettingsProps> = ({
  bpm,
  onBpmChange,
  onStart,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {isMobile ? (
        // 手機版：垂直排列，避免寬度不足
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text>BPM (步頻):</Text>
          <Slider
            min={MIN_BPM}
            max={MAX_BPM}
            step={BPM_STEP}
            value={bpm}
            onChange={onBpmChange}
            style={{ width: "100%" }}
          />
          <InputNumber
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={onBpmChange}
            size="large"
            style={{ width: "120px" }}
          />
        </Space>
      ) : (
        // 桌面版：水平排列
        <Row align="middle" gutter={[16, 0]}>
          <Col span={5}>
            <Text>BPM (步頻):</Text>
          </Col>
          <Col span={15}>
            <Slider
              min={MIN_BPM}
              max={MAX_BPM}
              step={BPM_STEP}
              value={bpm}
              onChange={onBpmChange}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              onChange={onBpmChange}
            />
          </Col>
        </Row>
      )}

      <Text type="secondary">建議步頻: {DEFAULT_BPM} BPM（每分鐘步數）</Text>

      <Button
        type="primary"
        onClick={onStart}
        size="large"
        style={{
          marginTop: "15px",
          width: isMobile ? "100%" : "auto",
        }}
      >
        開始超慢跑訓練
      </Button>
    </Space>
  );
};

export default SlowRunSettings;
