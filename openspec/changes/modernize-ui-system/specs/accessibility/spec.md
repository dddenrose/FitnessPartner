# Accessibility Capability

## ADDED Requirements

### Requirement: 鍵盤導航

系統 SHALL 支援完整的鍵盤操作，不依賴滑鼠或觸控。

#### Scenario: Tab 順序

- **WHEN** 使用者按下 Tab 鍵
- **THEN** 焦點依邏輯順序移動（由上而下、由左而右）
- **AND** 跳過不可互動的元素（裝飾性圖片、純文字）

#### Scenario: Focus visible

- **WHEN** 元素獲得鍵盤焦點
- **THEN** 顯示清晰的 focus ring（使用 Tailwind 的 `focus:ring-2 focus:ring-primary-500`）
- **AND** focus ring 顏色與背景對比度 >= 3:1（WCAG 2.1）

#### Scenario: 跳過連結（Skip link）

- **WHEN** 頁面有 Navigation
- **THEN** 提供「跳過導航」連結（`<a href="#main-content">跳過導航</a>`）
- **AND** 連結預設隱藏，Tab 時顯示

#### Scenario: Escape 關閉 Modal/Drawer

- **WHEN** Modal 或 Drawer 開啟
- **THEN** 按下 Escape 鍵可關閉
- **AND** 焦點返回觸發元素（Ant Design 預設行為）

### Requirement: ARIA 標籤與語意

系統 SHALL 提供完整的 ARIA 資訊，協助螢幕閱讀器使用者。

#### Scenario: 語意化 HTML

- **WHEN** 撰寫頁面結構
- **THEN** 使用語意化標籤（`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`）
- **AND** 避免過度使用 `<div>` 與 `<span>`

#### Scenario: Icon-only buttons

- **WHEN** 按鈕只有 icon 無文字
- **THEN** 加上 `aria-label` 描述功能（如 `<Button aria-label="切換主題" icon={<SunIcon />} />`）
- **AND** 或使用 `<Tooltip>` 提供文字提示

#### Scenario: 圖片替代文字

- **WHEN** 頁面包含圖片
- **THEN** 裝飾性圖片使用 `alt=""`，資訊性圖片使用描述性 alt text
- **AND** 複雜圖表提供 `aria-describedby` 連結到詳細說明

#### Scenario: 表單欄位關聯

- **WHEN** 使用表單欄位
- **THEN** `<label>` 與 `<input>` 透過 `htmlFor` 關聯（Ant Design `<Form.Item>` 自動處理）
- **AND** 錯誤訊息透過 `aria-describedby` 關聯

#### Scenario: 動態內容通知

- **WHEN** 頁面內容動態更新（如 toast notification）
- **THEN** 使用 `role="alert"` 或 `aria-live="polite"` 通知螢幕閱讀器
- **AND** Ant Design 的 `message` 與 `notification` 已內建支援

### Requirement: 色彩對比

系統 SHALL 確保所有文字與背景的對比度符合 WCAG 標準。

#### Scenario: 一般文字對比度

- **WHEN** 顯示本文（14px 以上）
- **THEN** 對比度 >= 4.5:1（WCAG AA）
- **AND** 建議 >= 7:1（WCAG AAA）

#### Scenario: 大型文字對比度

- **WHEN** 顯示大型文字（18px 以上或 14px bold）
- **THEN** 對比度 >= 3:1（WCAG AA）
- **AND** 建議 >= 4.5:1（WCAG AAA）

#### Scenario: 非文字元素對比度

- **WHEN** 顯示 icon、圖形、邊框等非文字元素
- **THEN** 與相鄰顏色對比度 >= 3:1（WCAG 2.1）
- **AND** 特別注意 focus ring 與背景的對比

#### Scenario: 對比度檢查工具

- **WHEN** 設計或修改顏色
- **THEN** 使用 WebAIM Contrast Checker 或 Chrome DevTools 檢查
- **AND** 在兩種主題下都檢查

### Requirement: 觸控目標大小

系統 SHALL 確保互動元素的點擊區域足夠大。

#### Scenario: 最小點擊區域

- **WHEN** 元素可點擊或觸控
- **THEN** 點擊區域 >= 44x44px（iOS guideline）或 48x48px（Material Design）
- **AND** 元素間距 >= 8px，避免誤觸

#### Scenario: 小型 icon 的點擊區域擴充

- **WHEN** icon 本身小於 44x44px
- **THEN** 使用 padding 擴大點擊區域（如 `<button className="p-2"><Icon /></button>`）
- **AND** 或使用 `::before` 偽元素擴大點擊範圍

#### Scenario: 連結間距

- **WHEN** 多個連結相鄰（如 Navigation）
- **THEN** 連結間使用適當間距（`gap-2` 或 `gap-4`）
- **AND** 避免連結過於擁擠

### Requirement: 錯誤處理與回饋

系統 SHALL 提供清晰的錯誤訊息與操作回饋。

#### Scenario: 表單驗證錯誤

- **WHEN** 表單驗證失敗
- **THEN** 顯示具體的錯誤訊息（如「密碼長度至少 8 位」而非「格式錯誤」）
- **AND** 焦點自動移至第一個錯誤欄位

#### Scenario: API 錯誤處理

- **WHEN** API 請求失敗
- **THEN** 顯示友善的錯誤訊息（避免技術細節，如「網路連線異常，請稍後再試」）
- **AND** 提供重試按鈕或返回按鈕

#### Scenario: 空狀態

- **WHEN** 列表或表格無資料
- **THEN** 顯示友善的空狀態訊息與引導（如「目前無運動紀錄，點此開始運動」）
- **AND** 提供相關的 CTA 按鈕

#### Scenario: 載入狀態

- **WHEN** 正在載入資料
- **THEN** 顯示 Skeleton 或 Spinner
- **AND** 加上 `aria-busy="true"` 與視覺提示

#### Scenario: 成功回饋

- **WHEN** 操作成功（如儲存成功）
- **THEN** 顯示 toast notification 或 success message
- **AND** 視覺上使用綠色 checkmark icon

### Requirement: 語言與區域

系統 SHALL 提供適當的語言標記與格式化。

#### Scenario: HTML lang 屬性

- **WHEN** 渲染頁面
- **THEN** `<html>` 標籤包含 `lang="zh-TW"` 屬性
- **AND** 若部分內容為其他語言，使用 `<span lang="en">...</span>` 標記

#### Scenario: 日期與時間格式

- **WHEN** 顯示日期或時間
- **THEN** 使用本地化格式（台灣習慣為 YYYY/MM/DD 或 YYYY-MM-DD）
- **AND** 使用 `Intl.DateTimeFormat` 或 date-fns 處理

#### Scenario: 數字與貨幣格式

- **WHEN** 顯示數字
- **THEN** 使用千分位（如 `1,000`）
- **AND** 使用 `Intl.NumberFormat` 處理

### Requirement: 減少動畫（尊重使用者偏好）

系統 SHALL 尊重使用者的 `prefers-reduced-motion` 設定。

#### Scenario: 偵測 prefers-reduced-motion

- **WHEN** 使用者系統設定為「減少動畫」
- **THEN** 偵測 `@media (prefers-reduced-motion: reduce)` media query
- **AND** 停用非必要的動畫（transition duration 改為 0 或使用簡化版本）

#### Scenario: 保留必要動畫

- **WHEN** 動畫用於傳達重要資訊（如載入進度、狀態變化）
- **THEN** 即使在 reduced motion 下也保留
- **AND** 但簡化動畫幅度（如從 slide 改為 fade）

#### Scenario: 實作方式

- **WHEN** 在 globals.css 實作
- **THEN** 加入 `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
- **AND** 或在 Tailwind config 中啟用 `motion-safe:` 與 `motion-reduce:` variants

### Requirement: 測試與驗證

系統 SHALL 定期進行無障礙測試，確保符合標準。

#### Scenario: 自動化檢測工具

- **WHEN** 開發新功能
- **THEN** 使用 Lighthouse Accessibility audit（目標分數 >= 95）
- **AND** 使用 axe DevTools 或 WAVE 檢查常見問題

#### Scenario: 鍵盤測試

- **WHEN** 完成新頁面
- **THEN** 手動使用 Tab/Shift+Tab 測試所有互動元素
- **AND** 確保無「鍵盤陷阱」（無法用 Tab 離開的區域）

#### Scenario: 螢幕閱讀器測試（建議）

- **WHEN** 重大 UI 更新
- **THEN** 使用 NVDA（Windows）或 VoiceOver（Mac）測試主要流程
- **AND** 確認資訊傳達正確、無混淆

#### Scenario: 色盲模擬測試

- **WHEN** 使用顏色傳達資訊（如圖表、狀態）
- **THEN** 使用 Chrome DevTools 的「Emulate vision deficiencies」測試
- **AND** 確保不只依賴顏色（配合 icon、文字、圖案）

## MODIFIED Requirements

無（這是新增的 capability）

## REMOVED Requirements

無

## RENAMED Requirements

無
