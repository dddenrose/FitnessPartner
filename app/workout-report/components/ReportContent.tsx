"use client";
import React from "react";
import { Button, Row, Spin, Empty } from "antd";
import { WorkoutReport } from "@/app/interface/WorkoutReport";
import { formatTimeKey } from "../utils";
import ReportCard from "./ReportCard";
import { AppDispatch } from "@/lib/store";
import { generateWorkoutReport } from "@/lib/features/workoutReport/workoutReportSlice";

interface ReportContentProps {
  loading: boolean;
  error: string | null;
  report: WorkoutReport | null;
  selectedTimeRange: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  dispatch: AppDispatch;
}

const ReportContent: React.FC<ReportContentProps> = ({
  loading,
  error,
  report,
  selectedTimeRange,
  dateRange,
  dispatch,
}) => {
  if (error) {
    return (
      <div className="flex justify-center items-center py-12 flex-col">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => dispatch(generateWorkoutReport(dateRange))}>
          重試
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large">
          <div
            className="p-12 rounded-md"
            style={{ minHeight: "200px", minWidth: "200px" }}
          >
            <div className="text-center mt-4">加載中...</div>
          </div>
        </Spin>
      </div>
    );
  }

  if (!report) {
    return <Empty description="沒有運動數據" />;
  }

  // 獲取基於選定時間範圍的報表數據
  const getReportData = () => {
    switch (selectedTimeRange) {
      case "daily":
        return report.daily;
      case "weekly":
        return report.weekly;
      case "monthly":
        return report.monthly;
      case "yearly":
        return report.yearly;
      default:
        return report.weekly;
    }
  };

  const reportData = getReportData();
  const reportEntries = Object.entries(reportData).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  if (reportEntries.length === 0) {
    return <Empty description="沒有運動數據" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {reportEntries.map(([timeKey, summary]) => (
        <ReportCard
          key={timeKey}
          timeKey={timeKey}
          summary={summary}
          formattedTitle={formatTimeKey(timeKey, selectedTimeRange)}
        />
      ))}
    </Row>
  );
};

export default ReportContent;
