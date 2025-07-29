"use client";
import React from "react";
import { Col, Tabs } from "antd";

interface TimeRangeTabsProps {
  activeKey: string;
  onChange: (key: string) => void;
}

const TimeRangeTabs: React.FC<TimeRangeTabsProps> = ({
  activeKey,
  onChange,
}) => {
  const tabItems = [
    { key: "daily", label: "每日" },
    { key: "weekly", label: "每週" },
    { key: "monthly", label: "每月" },
    { key: "yearly", label: "每年" },
  ];

  return (
    <Col xs={24} lg={16}>
      <Tabs activeKey={activeKey} onChange={onChange} items={tabItems} />
    </Col>
  );
};

export default TimeRangeTabs;
