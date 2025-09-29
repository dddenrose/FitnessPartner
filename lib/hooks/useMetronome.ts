import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";

// 不再需要選項接口，因為我們移除了音效功能
export const useMetronome = () => {
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector((state) => state.exercise.workoutType);
  const bpm = useAppSelector((state) => state.exercise.bpm);
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );

  const [flashOn, setFlashOn] = useState(false);

  // 移除音效相關代碼  // 根據 BPM 計算閃爍間隔（毫秒）
  const flashInterval = 60000 / bpm;

  // 僅保留閃爍功能
  useEffect(() => {
    if (workoutType === "slowrun" && metronomeActive && status === "active") {
      const timer = setInterval(() => {
        setFlashOn((prev) => !prev);
      }, flashInterval);

      return () => clearInterval(timer);
    }

    return () => {};
  }, [workoutType, metronomeActive, status, flashInterval]);

  return {
    flashOn,
    bpm,
    metronomeActive,
    flashInterval,
  };
};

export default useMetronome;
