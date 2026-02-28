"use client";
import React from "react";
import { Card, Col, Row, Statistic, theme } from "antd";
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
  const { token } = theme.useToken();

  return (
    <Col xs={24} sm={12} lg={8} key={timeKey}>
      <Card title={formattedTitle} hoverable>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="運動次數"
              value={summary.workoutCount}
              valueStyle={{ color: token.colorSuccess }}
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
        </Row>
      </Card>
    </Col>
  );
};

export default ReportCard;
