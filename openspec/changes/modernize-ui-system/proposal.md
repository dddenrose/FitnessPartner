# 變更：現代化 UI 系統

## Why

目前系統的 UI 實作存在以下挑戰：

1. **樣式策略分散**：混合使用 Tailwind、CSS Modules、Ant Design、inline styles，缺乏統一規範
2. **主題系統不完整**：雖有 dark/light 模式基礎，但許多組件未正確響應主題切換，且缺乏主題切換 UI
3. **RWD 實作不一致**：各組件使用不同的 breakpoint 值（768px、480px），缺乏統一的響應式設計策略
4. **現代感不足**：視覺設計較為基礎，缺乏流暢的動畫、現代的排版與間距系統
5. **使用者體驗待優化**：缺乏載入狀態、錯誤處理視覺回饋、無障礙支援等

這些問題導致：

- 開發效率低下（需要在多種樣式方案間切換）
- 維護成本高（樣式分散在多處，難以統一修改）
- 使用者體驗不佳（主題切換不完整、響應式設計不連貫）
- 品牌識別度低（缺乏一致的視覺語言）

## What Changes

### 1. 統一 CSS 架構

- 建立 **Design Token 系統**（顏色、字型、間距、圓角、陰影等）
- 定義 **CSS 策略優先順序**：Tailwind (utility-first) > CSS Modules (組件專屬) > Ant Design (UI 庫)
- 移除重複的 CSS 變數定義，建立單一來源的 design tokens
- 標準化 breakpoints：mobile (< 640px), tablet (640-1024px), desktop (> 1024px)

### 2. 完善深淺色主題系統

- 擴充 `globals.css` 的 CSS 變數，涵蓋所有 UI 元素
- 更新所有組件以使用 CSS 變數而非 hardcoded 顏色
- 實作主題切換 UI（在 Navigation 或 UserProfileMenu 中）
- 優化主題切換動畫（避免閃爍、smooth transition）
- 確保 Ant Design 組件正確響應主題

### 3. 現代化視覺設計

- **排版系統**：建立層次分明的字型大小與行高系統
- **間距系統**：統一使用 4px/8px grid system
- **圓角與邊框**：定義統一的 border-radius 值（4px, 8px, 12px, 16px）
- **陰影系統**：建立 elevation system（4 levels: sm, md, lg, xl）
- **動畫**：定義統一的 transition timing（fast: 150ms, base: 300ms, slow: 500ms）
- **色彩調色板**：擴充 primary/secondary/accent 系列（50-900 shades）

### 4. 強化 RWD 實作

- 統一所有 breakpoints 使用 Tailwind 的預設值
- 建立 `useMediaQuery` hook 的標準用法
- 所有頁面/組件必須在三種尺寸下測試（mobile, tablet, desktop）
- 實作 mobile-first 設計策略
- 優化觸控體驗（增大點擊區域、支援手勢）

### 5. 提升 UI/UX 品質

- **載入狀態**：統一的 Skeleton、Spinner 組件
- **錯誤處理**：友善的錯誤訊息與空狀態設計
- **微互動**：hover、focus、active 狀態的視覺回饋
- **無障礙**：語意化 HTML、ARIA 標籤、鍵盤導航
- **效能**：lazy loading、code splitting、圖片最佳化

## Impact

### 影響的 Capabilities（新建）

- `design-system` - Design token 與樣式系統
- `theme-system` - 完整的深淺色主題切換
- `responsive-layout` - 統一的響應式佈局策略
- `ui-components` - 現代化的 UI 組件庫
- `accessibility` - 無障礙與使用者體驗

### 影響的程式碼範圍

- **全域樣式**：
  - `app/globals.css` - 擴充 CSS 變數系統
  - `tailwind.config.ts` - 自訂 theme tokens
- **主題相關**：
  - `app/components/ThemeProvider/index.tsx` - 優化主題切換邏輯
  - `app/components/DynamicAntdTheme/index.tsx` - 完善 Ant Design 主題
  - `lib/features/theme/themeSlice.ts` - 可能新增持久化、系統主題偵測
- **所有組件**（約 20+ 個）：
  - 將 hardcoded styles 改為使用 CSS 變數
  - 統一 breakpoints
  - 加入主題響應
- **佈局組件**：
  - `app/components/Navigation/index.tsx` - 加入主題切換按鈕
  - `app/components/ContentWrapper/index.tsx` - 優化響應式邏輯
- **頁面**：
  - `app/home/page.tsx`
  - `app/exercise/page.tsx`
  - `app/create-workout-plan/page.tsx`
  - `app/workout-report/page.tsx`
  - `app/login/page.tsx`

### 破壞性變更

- **無破壞性變更** - 這是漸進式優化，不影響現有功能
- 但建議配合 UI 更新進行視覺 QA 測試

### 預期效益

- **開發體驗**：樣式開發時間減少 40%（統一規範）
- **維護成本**：主題/樣式調整時間減少 60%（單一來源）
- **使用者滿意度**：預計提升 UI 評分 2-3 分（滿分 10）
- **品牌一致性**：視覺識別度提升，專業度增加

### 風險與緩解

- **風險**：大規模樣式重構可能引入視覺 regression
  - **緩解**：採用分階段推進策略，每個 capability 獨立測試
- **風險**：主題切換可能造成效能問題（大量 CSS 變數）
  - **緩解**：使用 CSS 變數 + 硬體加速的 transition
- **風險**：Ant Design 與自訂主題可能衝突
  - **緩解**：使用 ConfigProvider 正確覆寫 token

## 實作順序建議

1. **階段一：基礎建設（Week 1）**

   - 建立 design tokens 系統
   - 統一 CSS 策略文件
   - 實作主題切換 UI

2. **階段二：主題完善（Week 1-2）**

   - 更新所有組件使用 CSS 變數
   - 測試深淺色主題完整性

3. **階段三：RWD 優化（Week 2）**

   - 統一 breakpoints
   - 各頁面響應式測試

4. **階段四：視覺優化（Week 2-3）**

   - 實作新的排版/間距/陰影系統
   - 加入動畫與微互動

5. **階段五：UX 強化（Week 3）**
   - 載入狀態、錯誤處理
   - 無障礙優化

## 參考資料

- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/utility-first)
- [Material Design 3 Design Tokens](https://m3.material.io/foundations/design-tokens)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ant Design ConfigProvider](https://ant.design/components/config-provider)
