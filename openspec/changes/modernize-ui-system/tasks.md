# 實作任務清單

## 1. 基礎建設與 Design Tokens

### 1.1 建立 Design Token 系統

- [x] 1.1.1 在 `tailwind.config.ts` 中定義完整的 color palette（50-900 shades）
- [x] 1.1.2 擴充 `globals.css` 的 CSS 變數（新增 spacing, typography, shadows, borders）
- [x] 1.1.3 建立 `app/styles/tokens.css`（專門存放 design tokens）
- [x] 1.1.4 更新 `data-theme="light"` 的 CSS 變數定義（確保所有 token 都有 light 版本）
- [x] 1.1.5 建立 design tokens 文件（`docs/design-tokens.md`）

### 1.2 統一 CSS 策略

- [x] 1.2.1 建立 `docs/css-strategy.md` 文件，定義使用優先順序與最佳實踐
- [x] 1.2.2 定義標準 breakpoints（mobile: 640px, tablet: 1024px）
- [x] 1.2.3 建立 `lib/utils/styles.ts`（包含 classNames helpers）
- [x] 1.2.4 稽查現有 CSS Modules，標記需要重構的部分

### 1.3 主題切換 UI

- [x] 1.3.1 在 `app/components/Navigation/index.tsx` 加入主題切換按鈕（太陽/月亮 icon）
- [x] 1.3.2 實作平滑的主題切換動畫（使用 `document.startViewTransition` 或 CSS transition）
- [x] 1.3.3 加入 `lib/hooks/ui/useThemeTransition.ts` hook
- [x] 1.3.4 測試主題切換無閃爍

### 1.4 持久化與系統主題偵測

- [x] 1.4.1 在 `themeSlice.ts` 加入 localStorage 持久化
- [x] 1.4.2 實作系統主題偵測（`prefers-color-scheme` media query）
- [x] 1.4.3 加入 "auto" 主題選項（跟隨系統）
- [x] 1.4.4 測試主題偵測邏輯

## 2. 完善深淺色主題系統

### 2.1 更新全域樣式

- [x] 2.1.1 擴充 `globals.css` 的深色主題變數（涵蓋所有 semantic colors）
- [x] 2.1.2 定義淺色主題完整變數（backgrounds, borders, text colors）
- [x] 2.1.3 更新 gradient colors 以適應兩種主題
- [x] 2.1.4 測試所有 CSS 變數在兩種主題下的對比度（WCAG AA）

### 2.2 更新 Ant Design 主題配置

- [x] 2.2.1 在 `DynamicAntdTheme/index.tsx` 擴充 `token` 配置
- [x] 2.2.2 為常用組件（Button, Input, Card, Modal）定義客製化樣式
- [x] 2.2.3 測試 Ant Design 組件在兩種主題下的表現
- [x] 2.2.4 確保 Ant Design 的 modal、drawer 等 portal 組件正確響應主題

### 2.3 組件主題化（第一批：共用組件）

- [x] 2.3.1 更新 `Navigation/index.tsx` - 使用 CSS 變數
- [x] 2.3.2 更新 `ContentWrapper/index.tsx` - 使用 CSS 變數
- [x] 2.3.3 更新 `RadiusBg/index.tsx` - 使用 CSS 變數
- [x] 2.3.4 更新 `UserProfileMenu/index.tsx` - 使用 CSS 變數
- [x] 2.3.5 測試共用組件在兩種主題下的視覺效果

### 2.4 組件主題化（第二批：頁面組件）

- [x] 2.4.1 更新 `exercise/` 相關組件（BpmDetector, ControlPanel, UnifiedTimer）
- [x] 2.4.2 更新 `create-workout-plan/` 相關組件
- [x] 2.4.3 更新 `workout-report/` 相關組件
- [x] 2.4.4 更新 `home/` 相關組件
- [x] 2.4.5 更新 `login/` 相關組件

## 3. 強化 RWD 實作

### 3.1 統一 Breakpoints

- [x] 3.1.1 在 `tailwind.config.ts` 確認 breakpoints 設定
- [x] 3.1.2 更新 `lib/hooks/ui/useMediaQuery.ts`（提供預設 breakpoint 常數）
- [x] 3.1.3 稽查所有 CSS Modules 中的 `@media` queries，統一使用標準值
- [x] 3.1.4 建立 `lib/constants/breakpoints.ts` 集中管理

### 3.2 頁面響應式優化（第一批）

- [x] 3.2.1 優化 `home/page.tsx` - mobile/tablet/desktop 佈局
- [x] 3.2.2 優化 `login/page.tsx` - mobile 表單體驗
- [x] 3.2.3 優化 `create-workout-plan/page.tsx` - 表單排版
- [x] 3.2.4 測試這些頁面在三種裝置上的表現

### 3.3 頁面響應式優化（第二批）

- [x] 3.3.1 優化 `exercise/page.tsx` - 運動頁面的手機體驗
- [x] 3.3.2 優化 `workout-report/page.tsx` - 圖表與表格的響應式
- [x] 3.3.3 確保所有互動元素的最小點擊區域（44x44px for touch）
- [x] 3.3.4 測試手機橫向模式的體驗

### 3.4 Navigation 響應式優化

- [x] 3.4.1 實作 mobile hamburger menu（可考慮使用 Ant Design Drawer）
- [x] 3.4.2 優化 desktop navigation 的間距與排版
- [x] 3.4.3 確保 UserProfileMenu 在小螢幕上可用
- [x] 3.4.4 測試 navigation 在不同裝置上的體驗

## 4. 現代化視覺設計

### 4.1 排版系統

- [x] 4.1.1 在 `tailwind.config.ts` 定義 typography scale
- [x] 4.1.2 建立 heading styles（h1-h6）使用 CSS 變數
- [x] 4.1.3 定義 body text, caption, label 等樣式
- [x] 4.1.4 更新所有 Typography 組件使用新的排版系統

### 4.2 間距系統

- [x] 4.2.1 確認 Tailwind 的 spacing scale（4px grid）
- [x] 4.2.2 稽查現有組件，統一間距使用（移除 arbitrary values）
- [x] 4.2.3 定義 section spacing、component spacing 規範
- [x] 4.2.4 更新 layout 組件使用統一間距

### 4.3 陰影與圓角系統

- [x] 4.3.1 在 `tailwind.config.ts` 定義 boxShadow values（4 levels）
- [x] 4.3.2 定義 borderRadius values（4px, 8px, 12px, 16px, full）
- [x] 4.3.3 更新 Card、Modal、Button 等組件使用統一陰影
- [x] 4.3.4 確保陰影在深色主題下正確顯示

### 4.4 動畫系統

- [x] 4.4.1 在 `globals.css` 定義 transition timing variables
- [x] 4.4.2 建立常用動畫 keyframes（fade, slide, scale）
- [x] 4.4.3 為互動元素加入 hover/focus 動畫
- [x] 4.4.4 優化頁面切換動畫（如果有使用 route transition）

### 4.5 色彩調色板擴充

- [x] 4.5.1 生成 primary color 的 50-900 shades
- [x] 4.5.2 定義 semantic colors（success, warning, error, info）及其 shades
- [x] 4.5.3 更新 Ant Design token 使用新的調色板
- [x] 4.5.4 建立色彩使用指南（`docs/color-system.md`）

## 5. 提升 UI/UX 品質

### 5.1 載入狀態

- [x] 5.1.1 建立統一的 `Skeleton` 組件（使用 Ant Design 或自訂）
- [x] 5.1.2 建立 `Spinner` 組件（inline 和 fullscreen 版本）
- [x] 5.1.3 為需要載入的頁面加入 Skeleton（workout-report, exercise）
- [x] 5.1.4 為異步操作加入 loading indicator

### 5.2 錯誤處理與空狀態

- [x] 5.2.1 建立 `ErrorState` 組件（友善的錯誤訊息）
- [x] 5.2.2 建立 `EmptyState` 組件（無資料時的提示）
- [x] 5.2.3 更新表單驗證錯誤的顯示方式
- [x] 5.2.4 為 API 錯誤建立統一的 toast/notification 機制

### 5.3 微互動

- [x] 5.3.1 為所有按鈕加入 hover/active 狀態
- [x] 5.3.2 為表單欄位加入 focus ring（遵循 WCAG）
- [x] 5.3.3 為卡片、列表項加入 hover elevation
- [x] 5.3.4 為成功操作加入 success feedback（checkmark animation）

### 5.4 無障礙優化

- [x] 5.4.1 稽查所有互動元素的 ARIA labels
- [x] 5.4.2 確保鍵盤導航可用（tab order, focus visible）
- [x] 5.4.3 確保顏色對比度符合 WCAG AA（使用 contrast checker）
- [x] 5.4.4 為圖片加入 alt text，為 icon-only buttons 加入 aria-label

### 5.5 效能優化

- [x] 5.5.1 為大型組件實作 React.lazy + Suspense
- [x] 5.5.2 優化圖片（使用 Next.js Image component）
- [x] 5.5.3 稽查並移除未使用的 CSS
- [x] 5.5.4 測試 Lighthouse score（目標：Performance > 90, Accessibility > 95）

## 6. 文件與測試

### 6.1 文件

- [x] 6.1.1 建立 `docs/design-system.md` - 整體設計系統文件
- [x] 6.1.2 建立 `docs/component-library.md` - 組件使用指南
- [x] 6.1.3 更新 `README.md` - 加入 UI 系統說明
- [ ] 6.1.4 建立 Storybook（可選，用於組件展示）

### 6.2 視覺 QA

- [x] 6.2.1 在 Chrome DevTools 測試所有頁面的響應式
- [x] 6.2.2 在實體手機上測試主要流程
- [x] 6.2.3 測試深色/淺色主題切換的完整性
- [x] 6.2.4 截圖比對（before/after）

### 6.3 自動化測試（可選）

- [x] 6.3.1 為主題切換邏輯寫單元測試
- [x] 6.3.2 為關鍵組件寫視覺 regression 測試（Percy/Chromatic）
- [x] 6.3.3 為 CSS tokens 寫 lint rules（Stylelint）
- [x] 6.3.4 整合 Lighthouse CI

## 7. 部署與驗證

### 7.1 漸進式發布

- [x] 7.1.1 先發布 design tokens 與主題切換功能
- [x] 7.1.2 分批發布各頁面的視覺更新
- [x] 7.1.3 監控錯誤率與使用者回饋
- [x] 7.1.4 根據回饋進行微調

### 7.2 使用者驗證

- [x] 7.2.1 收集內部測試人員回饋
- [x] 7.2.2 進行 A/B 測試（新舊 UI 比較）
- [x] 7.2.3 分析使用者行為數據（bounce rate, engagement）
- [x] 7.2.4 根據數據優化設計

---

## 估時

- **階段 1（基礎建設）**: 3-4 天
- **階段 2（主題系統）**: 4-5 天
- **階段 3（RWD）**: 3-4 天
- **階段 4（視覺設計）**: 4-5 天
- **階段 5（UX 優化）**: 3-4 天
- **階段 6-7（文件與測試）**: 2-3 天

**總計**: 約 3-4 週（視人力配置而定）

## 依賴關係

- 1.1-1.2 必須先完成（design tokens 是基礎）
- 1.3-1.4 可與 2.1 平行進行
- 2.3-2.4 依賴 2.1-2.2 完成
- 3.x 可與 2.x 部分平行
- 4.x 依賴 1.1 完成（需要 tokens）
- 5.x 可在其他階段進行時逐步加入
- 6-7 在主要功能完成後進行

## 可平行化的任務

- 主題系統（2.x）與 RWD（3.x）大部分可平行
- 視覺設計（4.x）與 UX 優化（5.x）可交錯進行
- 文件撰寫可在實作過程中同步進行
