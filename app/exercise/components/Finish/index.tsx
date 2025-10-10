"use client";
import { SmileFilled, LoadingOutlined } from "@ant-design/icons";
import { Button, Flex, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/index";
import { addWorkoutSession } from "@/lib/features/workoutReport/workoutReportSlice";
import { auth } from "@/app/firebase";

const Finish: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 從 Redux 獲取運動數據
  const initialWorkoutPlan = useAppSelector(
    (state) => state.exercise.initialWorkoutPlan
  );
  const completedExercises = useAppSelector(
    (state) => state.exercise.completedExercises
  );
  const sessionInfo = useAppSelector((state) => state.exercise.sessionInfo);
  const workoutType = useAppSelector((state) => state.exercise.workoutType);

  // Calculate the total duration of the workout (in minutes)
  const calculateTotalDuration = () => {
    // 優先使用新數據結構中的會話時間
    if (sessionInfo.totalDuration > 0) {
      return Math.round(sessionInfo.totalDuration / 60);
    }

    // 從完成的運動項目計算總時間
    if (initialWorkoutPlan.length > 0) {
      let totalSeconds = 0;

      initialWorkoutPlan.forEach((item) => {
        totalSeconds += item.time + (item.rest || 0);
      });

      return Math.round(totalSeconds / 60);
    }

    // 如果沒有有效數據
    return 0;
  };

  // 創建儲存運動數據的函數
  const saveWorkoutData = useCallback(async () => {
    if (saved) return true;

    try {
      setSaving(true);

      // 檢查用戶是否已登入
      const user = auth.currentUser;
      if (!user) {
        message.warning("未偵測到登入，僅記錄本地運動數據");
        // 可以在這裡儲存到 localStorage 等替代方案
        setSaved(true);
        return true;
      }

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

      // Create workout session data
      // 根據運動模式處理數據
      const workoutData = {
        date: today,
        duration: calculateTotalDuration(),
        workoutType,
        completedExercises: completedExercises.length,
        notes:
          workoutType === "slowrun"
            ? `超慢跑訓練，總時長 ${calculateTotalDuration()} 分鐘`
            : `完成 ${
                completedExercises.length
              } 組運動，總時長 ${calculateTotalDuration()} 分鐘`,
      };

      console.log("正在保存運動數據:", workoutData);

      // Dispatch action to save to Firebase
      const result = await dispatch(addWorkoutSession(workoutData)).unwrap();
      console.log("保存結果:", result);
      message.success("運動記錄已保存！");
      setSaved(true);
      return true;
    } catch (error: any) {
      console.error("保存運動記錄失敗:", error);

      // 依據錯誤類型顯示不同訊息
      if (error.message && error.message.includes("權限被拒絕")) {
        message.error(
          "權限錯誤：無法儲存資料到 Firebase。請聯絡管理員確認資料庫權限設定。"
        );
      } else if (error.message && error.message.includes("用戶未登入")) {
        message.warning("您尚未登入，無法儲存運動數據到雲端。");
      } else if (error.message && error.message.includes("數據庫連接錯誤")) {
        message.error("無法連接到資料庫，請檢查網路連接後重試。");
      } else {
        message.error(`保存運動記錄失敗：${error.message || "未知錯誤"}`);
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [
    saved,
    dispatch,
    calculateTotalDuration,
    workoutType,
    completedExercises,
  ]);

  // 使用 ref 來追蹤是否已經嘗試保存
  const attemptedSaveRef = React.useRef(false);

  // 在組件載入時嘗試保存一次且僅一次並自動導航至報表頁面
  useEffect(() => {
    // 只在首次渲染時嘗試保存一次
    if (!saved && !saving && !attemptedSaveRef.current) {
      attemptedSaveRef.current = true; // 標記已嘗試保存
      console.log("自動保存運動記錄...");

      saveWorkoutData()
        .then((success) => {
          if (success) {
            // 成功保存後自動導航到報表頁面
            setTimeout(() => {
              router.push("/workout-report");
            }, 1000); // 延遲一秒跳轉，讓用戶看到完成提示
          }
        })
        .catch((error) => {
          console.error("儲存過程中出現錯誤:", error);
          setSaving(false);
          message.error("儲存運動記錄失敗，請確認您是否已登入。");
        });
    }
  }, [saved, saving, saveWorkoutData, router]);

  // 處理完成按鈕點擊
  const handleFinish = async () => {
    // 如果已經保存了，直接導航到報表頁面
    if (saved) {
      router.push("/workout-report");
      return;
    }

    // 如果還在保存中，先提示用戶等待
    if (saving) {
      message.info("正在保存運動記錄，請稍候...");
      return;
    }

    // 如果還沒保存，先保存再導航到報表頁面
    const saveSuccess = await saveWorkoutData();
    if (saveSuccess) {
      router.push("/workout-report");
    }
  };

  return (
    <Flex vertical align="center" gap={16}>
      <SmileFilled style={{ color: "white", fontSize: 64 }} />
      <Typography.Title
        level={1}
        style={{ color: "white", textAlign: "center" }}
      >
        Well done! <br />
        You have finished today&apos;s exercise! coool
      </Typography.Title>

      {saving ? (
        <Flex align="center" gap={8}>
          <LoadingOutlined style={{ color: "white", fontSize: 20 }} />
          <Typography.Text style={{ color: "white" }}>
            Saving workout data...
          </Typography.Text>
        </Flex>
      ) : (
        saved && (
          <Typography.Text style={{ color: "white" }}>
            Workout data has been saved!
          </Typography.Text>
        )
      )}

      <Button type="primary" onClick={handleFinish} loading={saving}>
        {saved ? "查看報表" : "完成並查看報表"}
      </Button>
    </Flex>
  );
};

export default Finish;
