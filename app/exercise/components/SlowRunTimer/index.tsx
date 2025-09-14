// app/exercise/components/SlowRunTimer/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import { Card, Row, Col, Progress, Typography, Button, Statistic } from "antd";
import {
  PauseOutlined,
  CaretRightOutlined,
  StopOutlined,
  FieldTimeOutlined,
  DashboardOutlined,
  HeartOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { setStatus } from "@/lib/features/exercise/exerciseSlice";

const { Title, Text } = Typography;

const SlowRunTimer: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);
  const isPaused = status === "paused";

  // 運動數據狀態
  const [elapsedTime, setElapsedTime] = useState(0); // 秒
  const [distance, setDistance] = useState(0); // 公里
  const [pace, setPace] = useState(0); // 分鐘/公里
  const [heartRate, setHeartRate] = useState({ current: 0, avg: 0, max: 0 });
  const [calories, setCalories] = useState(0);

  // 模擬數據更新 (實際應用中應從健身設備或手機傳感器獲取)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "active") {
      timer = setInterval(() => {
        // 更新運行時間
        setElapsedTime((prev) => prev + 1);

        // 模擬距離增加 (平均配速6分鐘/公里)
        const newDistance = elapsedTime / 360; // 每6分鐘1公里
        setDistance(parseFloat(newDistance.toFixed(2)));

        // 計算配速 (分鐘/公里)
        const newPace = elapsedTime > 0 ? elapsedTime / 60 / newDistance : 0;
        if (!isNaN(newPace) && isFinite(newPace)) {
          setPace(parseFloat(newPace.toFixed(2)));
        }

        // 模擬心率 (在120-140之間隨機變化)
        const newHeartRate = Math.floor(120 + Math.random() * 20);
        setHeartRate((prev) => ({
          current: newHeartRate,
          avg:
            prev.avg > 0 ? prev.avg * 0.95 + newHeartRate * 0.05 : newHeartRate,
          max: Math.max(prev.max, newHeartRate),
        }));

        // 模擬卡路里消耗 (每分鐘約10卡路里)
        setCalories(Math.floor((elapsedTime / 60) * 10));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, elapsedTime]);

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs > 0 ? `${hrs}:` : ""}${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 格式化配速顯示
  const formatPace = (pace: number): string => {
    if (pace === 0 || !isFinite(pace)) return "--:--";
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePauseResume = () => {
    dispatch(setStatus(isPaused ? "active" : "paused"));
  };

  const handleStop = () => {
    dispatch(setStatus("finished"));
  };

  return (
    <div className="slow-run-timer">
      <Card bordered={false} className="main-timer-card">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title
              level={3}
              style={{ textAlign: "center", margin: "0 0 20px" }}
            >
              超慢跑訓練
            </Title>
          </Col>

          {/* 主計時器 */}
          <Col span={24} style={{ textAlign: "center" }}>
            <div
              className="time-display"
              style={{ fontSize: "3rem", fontWeight: "bold" }}
            >
              {formatTime(elapsedTime)}
            </div>
          </Col>

          {/* 控制按鈕 */}
          <Col span={24} style={{ textAlign: "center", margin: "20px 0" }}>
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
              onClick={handlePauseResume}
              style={{ marginRight: 16 }}
            />
            <Button
              danger
              size="large"
              shape="circle"
              icon={<StopOutlined />}
              onClick={handleStop}
            />
          </Col>

          {/* 統計數據 */}
          <Col xs={12} sm={12} md={8}>
            <Statistic
              title="距離"
              value={distance}
              precision={2}
              suffix="公里"
              prefix={<AimOutlined />}
            />
          </Col>

          <Col xs={12} sm={12} md={8}>
            <Statistic
              title="配速"
              value={formatPace(pace)}
              valueStyle={{ fontFamily: "monospace" }}
              prefix={<FieldTimeOutlined />}
              suffix="分鐘/公里"
            />
          </Col>

          <Col xs={12} sm={12} md={8}>
            <Statistic
              title="卡路里"
              value={calories}
              suffix="kcal"
              valueStyle={{ color: "#cf1322" }}
            />
          </Col>

          <Col xs={24} style={{ margin: "20px 0 10px" }}>
            <Title level={5}>
              <HeartOutlined style={{ color: "red", marginRight: 8 }} />
              心率
            </Title>
            <Row gutter={[16, 0]}>
              <Col span={8}>
                <Text type="secondary">目前</Text>
                <div>{heartRate.current} BPM</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">平均</Text>
                <div>{Math.round(heartRate.avg)} BPM</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">最高</Text>
                <div>{heartRate.max} BPM</div>
              </Col>
            </Row>
            <Progress
              percent={(heartRate.current / 200) * 100}
              showInfo={false}
              strokeColor={{
                "0%": "#87d068",
                "50%": "#faad14",
                "100%": "#ff4d4f",
              }}
              style={{ marginTop: 10 }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SlowRunTimer;
