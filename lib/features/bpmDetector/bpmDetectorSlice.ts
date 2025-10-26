import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

/**
 * BPM 檢測器狀態管理
 * 專門管理 BPM 檢測器的開關狀態，與其他邏輯分離
 */
export interface BpmDetectorState {
  // BPM 檢測器是否啟用
  enabled: boolean;
}

const initialState: BpmDetectorState = {
  enabled: false,
};

export const bpmDetectorSlice = createSlice({
  name: "bpmDetector",
  initialState,
  reducers: {
    // 切換 BPM 檢測器開關
    toggleBpmDetector: (state) => {
      state.enabled = !state.enabled;
    },

    // 設置 BPM 檢測器開關
    setBpmDetectorEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },

    // 重置檢測器狀態
    resetBpmDetector: (state) => {
      state.enabled = false;
    },
  },
});

// 導出 actions
export const { toggleBpmDetector, setBpmDetectorEnabled, resetBpmDetector } =
  bpmDetectorSlice.actions;

// Selectors
export const selectBpmDetectorEnabled = (state: RootState) =>
  state.bpmDetector.enabled;

// 導出 reducer
export default bpmDetectorSlice.reducer;
