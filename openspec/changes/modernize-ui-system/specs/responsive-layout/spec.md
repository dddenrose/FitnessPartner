# Responsive Layout Capability

## ADDED Requirements

### Requirement: 統一的 Breakpoints

系統 SHALL 在所有樣式實作中使用統一的 breakpoints。

#### Scenario: Tailwind breakpoints

- **WHEN** 使用 Tailwind responsive utilities
- **THEN** 使用標準 breakpoints（`sm:`, `md:`, `lg:`, `xl:`, `2xl:`）
- **AND** breakpoint 值為 `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`

#### Scenario: CSS Modules media queries

- **WHEN** 在 CSS Modules 中寫 media queries
- **THEN** 使用與 Tailwind 相同的數值（如 `@media (min-width: 640px)`）
- **AND** 不可使用舊的非標準值（`480px`, `768px` for max-width）

#### Scenario: JavaScript media query hooks

- **WHEN** 在組件中需要判斷螢幕尺寸
- **THEN** 使用 `useMediaQuery(MEDIA_QUERIES.mobile)` 等預定義常數
- **AND** 常數定義在 `lib/constants/breakpoints.ts`

### Requirement: Mobile-First 設計策略

系統 SHALL 採用 mobile-first 設計，預設樣式為行動裝置最佳化。

#### Scenario: 預設樣式為 mobile

- **WHEN** 撰寫組件樣式
- **THEN** 基礎樣式（無 breakpoint prefix）適用於 mobile
- **AND** 使用 `sm:`, `md:`, `lg:` 等 prefix 逐步增強 desktop 體驗

#### Scenario: 內容優先級

- **WHEN** 設計頁面佈局
- **THEN** mobile 版本顯示核心內容，desktop 版本增加輔助資訊
- **AND** 避免在 mobile 隱藏重要功能（除非提供替代入口）

#### Scenario: 觸控友善設計

- **WHEN** 設計互動元素（按鈕、連結、輸入框）
- **THEN** 最小點擊區域為 44x44px（iOS guideline）
- **AND** 間距充足，避免誤觸

### Requirement: 響應式佈局模式

系統 SHALL 為常見佈局提供響應式模式。

#### Scenario: Navigation 響應式

- **WHEN** 螢幕寬度 < 640px（mobile）
- **THEN** Navigation 使用 hamburger menu（Ant Design Drawer）
- **AND** menu icon 點擊區域 >= 44x44px

#### Scenario: Card grid 響應式

- **WHEN** 顯示卡片列表（如 workout-report）
- **THEN** mobile 為單欄（`grid-cols-1`），tablet 為雙欄（`md:grid-cols-2`），desktop 為三欄（`lg:grid-cols-3`）
- **AND** 卡片間距使用統一的 gap（`gap-4` 或 `gap-6`）

#### Scenario: Form 響應式

- **WHEN** 顯示表單（如 create-workout-plan）
- **THEN** mobile 為單欄佈局，desktop 可考慮雙欄（label 與 input 分離）
- **AND** 表單欄位寬度在 mobile 為 100%，desktop 有合理最大寬度

#### Scenario: Table 響應式

- **WHEN** 顯示表格（如 workout-report）
- **THEN** mobile 使用卡片式佈局（每筆資料為一張卡片）或橫向滾動
- **AND** desktop 顯示完整表格
- **AND** 提供「欄位顯示/隱藏」功能（Ant Design Table 的 responsive prop）

### Requirement: 圖片與媒體響應式

系統 SHALL 優化圖片在不同裝置上的載入與顯示。

#### Scenario: 使用 Next.js Image 組件

- **WHEN** 顯示圖片
- **THEN** 優先使用 `next/image` 的 `<Image>` 組件
- **AND** 設定適當的 `sizes` prop（如 `"(max-width: 640px) 100vw, 50vw"`）

#### Scenario: 圖片 lazy loading

- **WHEN** 頁面包含多張圖片（如 home page）
- **THEN** 使用 `loading="lazy"` 或 Next.js Image 的預設行為
- **AND** 首屏圖片使用 `priority` prop

#### Scenario: 背景圖片響應式

- **WHEN** 使用背景圖片（如 login page 的 BgImage）
- **THEN** 使用 `background-size: cover` 或 `contain`
- **AND** 提供不同解析度的圖片（使用 `image-set` 或 Next.js 自動優化）

### Requirement: 字型與排版響應式

系統 SHALL 確保文字在不同裝置上的可讀性。

#### Scenario: 標題字型大小

- **WHEN** 顯示標題（h1, h2, h3）
- **THEN** mobile 使用較小字型（如 `text-2xl`），desktop 使用較大字型（如 `md:text-4xl`）
- **AND** 確保 line-height 適當（1.2-1.5 for headings）

#### Scenario: 本文字型大小

- **WHEN** 顯示段落文字
- **THEN** 最小字型大小為 14px（mobile），16px（desktop）
- **AND** line-height >= 1.5（提升可讀性）

#### Scenario: 最大行寬

- **WHEN** 顯示長段落文字
- **THEN** 設定最大寬度（`max-w-prose` 或 `max-w-2xl`）
- **AND** 避免單行過長（理想 50-75 字元）

### Requirement: 測試與驗證

系統 SHALL 確保所有頁面在三種裝置尺寸下正確顯示。

#### Scenario: Chrome DevTools 測試

- **WHEN** 開發新頁面或組件
- **THEN** 在 DevTools 的 Device Mode 測試 mobile (375px), tablet (768px), desktop (1440px)
- **AND** 檢查是否有橫向滾動條（應避免）

#### Scenario: 實體裝置測試

- **WHEN** 重大 UI 更新完成
- **THEN** 在實體手機上測試主要流程（login, exercise, create-workout-plan）
- **AND** 測試橫向模式（landscape）是否正常

#### Scenario: 觸控體驗測試

- **WHEN** 在手機上測試
- **THEN** 確認所有按鈕、連結可輕易點擊
- **AND** 確認表單輸入體驗流暢（鍵盤不遮擋輸入框）

### Requirement: 效能考量

系統 SHALL 確保響應式設計不影響效能。

#### Scenario: 避免 layout shift

- **WHEN** 頁面載入或視窗調整大小
- **THEN** 元素不應大幅移動（Cumulative Layout Shift < 0.1）
- **AND** 為圖片、廣告位等預留空間（使用 `aspect-ratio` 或固定高度）

#### Scenario: 避免過度 re-render

- **WHEN** 使用 `useMediaQuery` hook
- **THEN** 使用 `useMemo` 或 `useCallback` 優化
- **AND** 避免在每次 resize 時觸發昂貴的計算

#### Scenario: CSS media queries 優先

- **WHEN** 可用 CSS media queries 實現的響應式
- **THEN** 優先使用 CSS（Tailwind responsive utilities 或 `@media`）
- **AND** 避免不必要的 JavaScript 判斷（減少 bundle size）

## MODIFIED Requirements

無（這是新增的 capability）

## REMOVED Requirements

無

## RENAMED Requirements

無
