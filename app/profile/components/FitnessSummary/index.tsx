"use client";
import React, { useMemo } from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectAllWorkoutSessions } from "@/lib/features/workoutReport/workoutReportSlice";

const FitnessSummary: React.FC = () => {
  const allSessions = useSelector(selectAllWorkoutSessions);

  const stats = useMemo(() => {
    const totalCount = allSessions.length;
    const totalMinutes = allSessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const thisWeekCount = allSessions.filter(
      (s) => s.date >= weekStartStr,
    ).length;

    return { totalCount, totalHours, thisWeekCount };
  }, [allSessions]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">健身統計</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="總訓練次數"
              value={stats.totalCount}
              suffix="次"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="總訓練時數"
              value={stats.totalHours}
              suffix="小時"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="本週訓練次數"
              value={stats.thisWeekCount}
              suffix="次"
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FitnessSummary;
