"use client";
import React from "react";
import { Card, Row } from "antd";
import DateRangePicker from "../DateRangePicker";
import TimeRangeTabs from "../TimeRangeTabs";

interface FilterPanelProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedTimeRange: string;
  onDateRangeChange: (dates: any, dateStrings: [string, string]) => void;
  onTimeRangeChange: (key: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  dateRange,
  selectedTimeRange,
  onDateRangeChange,
  onTimeRangeChange,
}) => {
  return (
    <Card className="mb-6">
      <Row gutter={[16, 16]} align="middle">
        <DateRangePicker dateRange={dateRange} onChange={onDateRangeChange} />
        <TimeRangeTabs
          activeKey={selectedTimeRange}
          onChange={onTimeRangeChange}
        />
      </Row>
    </Card>
  );
};

export default FilterPanel;
