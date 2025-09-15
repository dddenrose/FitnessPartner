"use client";

import { Button, Col, InputNumber, Row, Slider, Typography } from "antd";
import React from "react";
import { MIN_BPM, MAX_BPM, BPM_STEP, DEFAULT_BPM } from "../../const";

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
}) => (
  <>
    <Row align="middle">
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
          style={{ marginLeft: "16px" }}
          value={bpm}
          onChange={onBpmChange}
        />
      </Col>
    </Row>
    <Text type="secondary">建議步頻: {DEFAULT_BPM} BPM（每分鐘步數）</Text>
    <Button
      type="primary"
      onClick={onStart}
      size="large"
      style={{ marginTop: "15px" }}
    >
      開始超慢跑訓練
    </Button>
  </>
);

export default SlowRunSettings;
