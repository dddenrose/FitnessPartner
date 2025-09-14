"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Statistic,
  Space,
  Progress,
  Switch,
} from "antd";
import {
  PauseOutlined,
  CaretRightOutlined,
  StopOutlined,
  SoundOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import {
  setStatus,
  toggleMetronome,
} from "@/lib/features/exercise/exerciseSlice";
import styles from "./styles.module.css";

const { Title, Text } = Typography;

interface UnifiedTimerProps {
  exerciseName?: string;
}

const UnifiedTimer: React.FC<UnifiedTimerProps> = ({ exerciseName }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector((state) => state.exercise.workoutType);
  const bpm = useAppSelector((state) => state.exercise.bpm);
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );
  const isPaused = status === "paused";

  const [elapsedTime, setElapsedTime] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 根據 BPM 計算閃爍間隔（毫秒）
  const flashInterval = 60000 / bpm;

  // 建立閃爍節奏
  useEffect(() => {
    if (workoutType === "slowrun" && metronomeActive && status === "active") {
      const timer = setInterval(() => {
        setFlashOn((prev) => !prev);

        // 播放節拍聲音
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => console.log("播放聲音失敗:", e));
        }
      }, flashInterval);

      return () => clearInterval(timer);
    }

    return () => {};
  }, [workoutType, metronomeActive, status, flashInterval]);

  // 更新經過的時間
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "active") {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePauseResume = () => {
    dispatch(setStatus(isPaused ? "active" : "paused"));
  };

  const handleStop = () => {
    dispatch(setStatus("finished"));
  };

  const handleToggleMetronome = (checked: boolean) => {
    dispatch(toggleMetronome(checked));
  };

  return (
    <Card bordered={false} className={styles.timerCard}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3} style={{ textAlign: "center", margin: "0 0 20px" }}>
            {exerciseName ||
              (workoutType === "slowrun" ? "超慢跑訓練" : "HIIT 訓練")}
          </Title>
        </Col>

        {/* 步頻閃爍燈 (僅適用於超慢跑模式) */}
        {workoutType === "slowrun" && (
          <Col span={24} style={{ textAlign: "center", margin: "0 0 20px" }}>
            <div
              className={styles.flashLight}
              style={{
                backgroundColor: flashOn ? "#ff4d4f" : "#d9d9d9",
                boxShadow: flashOn
                  ? "0 0 20px 5px rgba(255, 77, 79, 0.6)"
                  : "none",
              }}
            />
            <div style={{ marginTop: 10 }}>
              <Space>
                <Text>節拍器:</Text>
                <Switch
                  checked={metronomeActive}
                  onChange={handleToggleMetronome}
                  checkedChildren={<SoundOutlined />}
                  unCheckedChildren={<SoundOutlined />}
                />
                <Text>{bpm} BPM</Text>
              </Space>
            </div>
          </Col>
        )}

        {/* 主計時器 */}
        <Col span={24} style={{ textAlign: "center" }}>
          <div className={styles.timeDisplay}>{formatTime(elapsedTime)}</div>
        </Col>

        {/* 控制按鈕 */}
        <Col span={24} style={{ textAlign: "center", margin: "20px 0" }}>
          <Space>
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
              onClick={handlePauseResume}
            />
            <Button
              danger
              size="large"
              shape="circle"
              icon={<StopOutlined />}
              onClick={handleStop}
            />
          </Space>
        </Col>

        {/* 基本運動數據 */}
        <Col span={24}>
          <Card size="small">
            <Statistic
              title="運動時間"
              value={formatTime(elapsedTime)}
              prefix={<FieldTimeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 節拍器音效 */}
    </Card>
  );
};

export default UnifiedTimer;
