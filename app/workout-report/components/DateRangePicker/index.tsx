"use client";
import React from "react";
import { Col, DatePicker, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface DateRangePickerProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onChange: (dates: any, dateStrings: [string, string]) => void;
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({
  dateRange,
  onChange,
}) => {
  return (
    <Col xs={24} lg={8}>
      <div className="flex items-center">
        <CalendarOutlined className="mr-2" />
        <Text>選擇日期範圍：</Text>
      </div>
      <RangePicker
        className="w-full mt-2"
        value={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]}
        onChange={onChange}
        allowClear={false}
      />
    </Col>
  );
};

export default DateRangePickerComponent;
