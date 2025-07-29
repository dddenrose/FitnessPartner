"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  generateWorkoutReport,
  setSelectedTimeRange,
  selectWorkoutReport,
  selectWorkoutReportLoading,
  selectSelectedTimeRange,
} from "@/lib/features/workoutReport/workoutReportSlice";
import ContentWrapper from "../components/ContentWrapper";
import FilterPanel from "./components/FilterPanel";
import ReportContent from "./components/ReportContent";
import { getDefaultDateRange } from "./utils";

const { Title } = Typography;

const WorkoutReportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const report = useAppSelector(selectWorkoutReport);
  const loading = useAppSelector(selectWorkoutReportLoading);
  const selectedTimeRange = useAppSelector(selectSelectedTimeRange);

  // 初始化状态
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(generateWorkoutReport(dateRange)).unwrap();
        setError(null);
      } catch (err: any) {
        console.error("獲取運動報表失敗:", err);
        setError(err.message || "獲取運動報表時發生錯誤");
      }
    };

    fetchData();
  }, [dispatch, dateRange]);

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setDateRange({
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    }
  };

  // 处理时间范围变化
  const handleTimeRangeChange = (key: string) => {
    dispatch(
      setSelectedTimeRange(key as "daily" | "weekly" | "monthly" | "yearly")
    );
  };

  return (
    <ContentWrapper>
      <div className="container mx-auto p-4">
        <Title level={1}>運動報表</Title>

        {/* 过滤面板组件 */}
        <FilterPanel
          dateRange={dateRange}
          selectedTimeRange={selectedTimeRange}
          onDateRangeChange={handleDateRangeChange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* 报表内容组件 */}
        <ReportContent
          loading={loading}
          error={error}
          report={report}
          selectedTimeRange={selectedTimeRange}
          dateRange={dateRange}
          dispatch={dispatch}
        />
      </div>
    </ContentWrapper>
  );
};

export default WorkoutReportPage;
