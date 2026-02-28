# CSS Modules 稽查報告

稽查日期：2025-01-XX
稽查範圍：`app/exercise/` 目錄下所有 CSS Modules

## 檔案清單

找到 6 個 CSS Modules：

1. `app/exercise/components/Metronome/styles.module.css`
2. `app/exercise/components/ControlPanel/styles.module.css`
3. `app/exercise/components/WorkoutModeSelector/styles.module.css`
4. `app/exercise/components/UnifiedTimer/styles.module.css`
5. `app/exercise/components/BpmDetector/styles.module.css`
6. `app/exercise/styles.module.css`

## 發現的問題

### 1. Breakpoints 不統一

❌ **當前狀態**：

- `Metronome`: 768px, 480px
- `ControlPanel`: 768px, 480px
- `BpmDetector`: 可能使用不同值

✅ **應改為**：

- Mobile: `(max-width: 639px)`
- Tablet: `(min-width: 640px) and (max-width: 1023px)`
- Desktop: `(min-width: 1024px)`

**影響檔案**：

- `Metronome/styles.module.css`
- `ControlPanel/styles.module.css`
- 其他待確認

### 2. Hardcoded 顏色值

❌ **發現的問題**：

```css
/* ControlPanel/styles.module.css */
background: rgba(0, 102, 170, 0.1) !important; /* 應使用 CSS Variables */
border: 2px solid var(--border-color) !important; /* --border-color 未定義 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 應使用 --shadow-* */
```

```css
/* BpmDetector/styles.module.css */
border: 2px solid rgba(255, 255, 255, 0.2); /* 應使用 --border-primary */
background-color: rgba(0, 0, 0, 0.7); /* 應使用 --bg-overlay */
```

✅ **應改為**：

```css
background: var(--bg-primary);
border: 1px solid var(--border-primary);
box-shadow: var(--shadow-md);
```

### 3. 過度使用 !important

❌ **ControlPanel/styles.module.css** 大量使用 `!important`：

```css
width: 100px !important;
height: 100px !important;
min-width: 100px !important;
/* ...等 10+ 處 */
```

**原因分析**：可能是為了覆蓋 Ant Design 的預設樣式。

✅ **建議解決方案**：

1. 使用更高的 CSS 特異性（specificity）
2. 使用 Ant Design 的 `ConfigProvider` 或 `styles` prop
3. 僅在絕對必要時使用 `!important`

### 4. 缺少 CSS Variables 使用

部分組件仍使用 hardcoded 值：

```css
/* Metronome */
width: 80px; /* 應使用 --spacing-* 或定義專用 token */
border-radius: var(--border-radius-full); /* ✅ 這個正確 */

/* ControlPanel */
font-size: 2rem; /* 應使用 --font-size-* */
gap: var(--spacing-md); /* ✅ 這個正確 */
```

### 5. 陰影系統不一致

❌ **當前狀態**：

```css
/* ControlPanel */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
box-shadow: 0 0 20px rgba(0, 102, 170, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4);

/* BpmDetector */
box-shadow: none;
```

✅ **應統一使用 design tokens**：

```css
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-lg);
```

### 6. 註解不足

部分複雜樣式缺少說明：

```css
backdrop-filter: blur(10px); /* 為什麼需要模糊？ */
transform: scale(1.1); /* hover 時放大，應加註解 */
```

## 重構優先級

### 🔴 高優先級（立即修正）

1. **統一 breakpoints**

   - 將所有 `768px` 改為 `639px` (mobile)
   - 將所有 `480px` 改為標準斷點
   - 影響檔案：Metronome, ControlPanel

2. **移除 hardcoded 顏色**
   - ControlPanel 的 `rgba(0, 102, 170, 0.1)` 等
   - BpmDetector 的 `rgba(255, 255, 255, 0.2)` 等
   - 改用 `var(--bg-primary)`, `var(--border-primary)` 等

### 🟡 中優先級（後續優化）

3. **減少 !important 使用**

   - 調查 ControlPanel 為何需要大量 !important
   - 使用 Ant Design 的正確覆寫方式

4. **統一陰影系統**

   - 所有 `box-shadow` 改用 `var(--shadow-*)`
   - 定義 hover 時的 shadow 變化規則

5. **統一尺寸系統**
   - 將 hardcoded px 值改用 spacing scale
   - 例：`80px` → `var(--spacing-20)` (如果定義了)

### 🟢 低優先級（長期維護）

6. **增加註解**

   - 為複雜動畫加上說明
   - 為特殊 hack 加上原因說明

7. **提取共用樣式**
   - 多個組件共用的樣式（如 flashLight）可提取到全域

## 重構範例

### Before (ControlPanel/styles.module.css)

```css
.controlButton {
  width: 100px !important;
  height: 100px !important;
  background: rgba(0, 102, 170, 0.1) !important;
  border: 2px solid var(--border-color) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .controlButton {
    width: 70px !important;
    height: 70px !important;
  }
}
```

### After

```css
.controlButton {
  /* 尺寸：使用標準 spacing 或定義專用 token */
  width: var(--button-size-lg, 100px);
  height: var(--button-size-lg, 100px);

  /* 顏色：使用 semantic tokens */
  background: var(--bg-primary);
  border: 1px solid var(--border-accent);

  /* 陰影：使用標準 elevation */
  box-shadow: var(--shadow-md);

  /* 動畫：使用標準 timing */
  transition: transform var(--transition-fast) var(--ease-out), box-shadow var(
        --transition-fast
      ) var(--ease-out);
}

.controlButton:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

/* Mobile-first 響應式 */
@media (max-width: 639px) {
  .controlButton {
    width: var(--button-size-md, 70px);
    height: var(--button-size-md, 70px);
  }
}
```

## 預估工作量

| 任務                | 檔案數 | 預估時間    |
| ------------------- | ------ | ----------- |
| 統一 breakpoints    | 6      | 30 分鐘     |
| 移除 hardcoded 顏色 | 6      | 1.5 小時    |
| 減少 !important     | 2      | 1 小時      |
| 統一陰影系統        | 6      | 45 分鐘     |
| 加入註解            | 6      | 30 分鐘     |
| **總計**            | **6**  | **~4 小時** |

## 建議的實作順序

1. **Week 1**：統一 breakpoints + 移除 hardcoded 顏色
2. **Week 2**：減少 !important + 統一陰影系統
3. **Week 3**：增加註解 + 最終測試

## 測試檢查清單

重構後需檢查：

- [ ] 所有組件在 mobile (< 640px) 下正常顯示
- [ ] 所有組件在 tablet (640-1024px) 下正常顯示
- [ ] 所有組件在 desktop (> 1024px) 下正常顯示
- [ ] 深色/淺色主題切換無閃爍
- [ ] 所有顏色符合 WCAG AA 對比度標準
- [ ] Hover/active 狀態動畫流暢（無延遲）
- [ ] 無 console 警告/錯誤

## 相關文件

- [CSS Strategy Guide](./css-strategy.md)
- [Design Tokens](./design-tokens.md)
- [Breakpoints Constants](/lib/constants/breakpoints.ts)
