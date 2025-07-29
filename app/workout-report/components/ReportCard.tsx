"use client";
import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import { WorkoutSummary } from "@/app/interface/WorkoutReport";

interface ReportCardProps {
  timeKey: string;
  summary: WorkoutSummary;
  formattedTitle: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  timeKey,
  summary,
  formattedTitle,
}) => {
  return (
    <Col xs={24} sm={12} lg={8} key={timeKey}>
      <Card title={formattedTitle} hoverable>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="運動次數"
              value={summary.workoutCount}
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="總時長 (分鐘)"
              value={summary.totalDuration}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="平均時長 (分鐘)"
              value={Math.round(summary.averageDuration)}
              precision={0}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="卡路里"
              value={summary.totalCalories || 0}
              prefix={<FireOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default ReportCard;
