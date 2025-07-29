import dayjs from "dayjs";

// 格式化時間鍵顯示
export const formatTimeKey = (key: string, timeRange: string): string => {
  switch (timeRange) {
    case "daily":
      return dayjs(key).format("YYYY-MM-DD");
    case "weekly":
      const [year, week] = key.split("-");
      return `${year} 第 ${week} 週`;
    case "monthly":
      return dayjs(key).format("YYYY年 MM月");
    case "yearly":
      return `${key}年`;
    default:
      return key;
  }
};

// 獲取基於選定時間範圍的報表數據
export const getReportData = (report: any, selectedTimeRange: string) => {
  if (!report) return {};

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

// 獲取預設日期範圍
export const getDefaultDateRange = () => ({
  startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
});
