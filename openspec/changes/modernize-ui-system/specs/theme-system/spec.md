# Theme System Capability

## ADDED Requirements

### Requirement: 深淺色主題支援

系統 SHALL 支援完整的深淺色主題切換，所有 UI 元素正確響應。

#### Scenario: 主題模式管理

- **WHEN** 系統啟動
- **THEN** 從 localStorage 讀取使用者偏好的主題模式
- **AND** 若無偏好則預設為深色主題

#### Scenario: 主題切換

- **WHEN** 使用者點擊主題切換按鈕
- **THEN** 主題立即切換（dark ↔ light）
- **AND** 新的偏好儲存至 localStorage
- **AND** 所有組件平滑過渡（無閃爍）

#### Scenario: 系統主題偵測

- **WHEN** 使用者選擇「跟隨系統」模式
- **THEN** 系統偵測 `prefers-color-scheme` media query
- **AND** 當系統主題改變時，應用自動切換主題

#### Scenario: CSS Variables 響應主題

- **WHEN** 主題切換
- **THEN** `[data-theme="light"]` 的 CSS Variables 立即生效
- **AND** 所有引用這些變數的元素自動更新顏色

### Requirement: 主題切換 UI

系統 SHALL 提供明顯的主題切換入口，方便使用者操作。

#### Scenario: Navigation 中的主題切換按鈕

- **WHEN** 使用者檢視 Navigation
- **THEN** 可看到主題切換按鈕（太陽/月亮 icon）
- **AND** Icon 根據當前主題顯示（深色顯示太陽，淺色顯示月亮）

#### Scenario: 主題切換動畫

- **WHEN** 使用者點擊主題切換按鈕
- **THEN** 觸發平滑的視覺過渡（fade 或 View Transition API）
- **AND** 過渡時間不超過 300ms

#### Scenario: 鍵盤快捷鍵（可選）

- **WHEN** 使用者按下 `Cmd/Ctrl + Shift + T`
- **THEN** 快速切換主題
- **AND** 顯示 toast 提示當前主題

### Requirement: Ant Design 主題整合

系統 SHALL 確保 Ant Design 組件正確響應主題切換。

#### Scenario: Ant Design token 配置

- **WHEN** 主題切換
- **THEN** `DynamicAntdTheme` 的 ConfigProvider 更新 algorithm（`darkAlgorithm` ↔ `defaultAlgorithm`）
- **AND** 更新 token 值（`colorBgBase`, `colorTextBase`, `colorPrimary`）

#### Scenario: Ant Design 組件視覺測試

- **WHEN** 使用以下 Ant Design 組件：Button, Input, Select, Modal, Drawer, Table, Card
- **THEN** 在深色主題下，背景為深色、文字為淺色、對比度符合 WCAG AA
- **AND** 在淺色主題下，背景為淺色、文字為深色、對比度符合 WCAG AA

#### Scenario: Ant Design portal 組件

- **WHEN** 開啟 Modal, Drawer, Dropdown 等 portal 組件
- **THEN** 這些組件的主題與頁面主體一致
- **AND** 不會出現「主體是深色但 Modal 是淺色」的情況

### Requirement: 組件主題化

系統 SHALL 確保所有自訂組件正確響應主題。

#### Scenario: 移除 hardcoded 顏色

- **WHEN** 審查組件程式碼
- **THEN** 不可出現 hardcoded 色碼（如 `color: '#ffffff'`, `backgroundColor: '#000000'`）
- **AND** 必須改為 CSS Variables 或 Tailwind utilities（`text-primary`, `bg-secondary`）

#### Scenario: 背景與文字對比

- **WHEN** 在兩種主題下測試組件
- **THEN** 所有文字與背景的對比度 >= 4.5:1（WCAG AA）
- **AND** 重要文字（標題、按鈕文字）>= 7:1（WCAG AAA，可選）

#### Scenario: 互動狀態響應主題

- **WHEN** 組件有 hover, focus, active 狀態
- **THEN** 這些狀態的顏色也使用 CSS Variables
- **AND** 在兩種主題下視覺回饋清晰可見

### Requirement: 主題持久化

系統 SHALL 記住使用者的主題偏好，跨 session 保持。

#### Scenario: 使用 Redux Persist

- **WHEN** 使用者切換主題
- **THEN** `themeSlice.mode` 的值自動儲存至 localStorage
- **AND** 下次訪問時自動載入

#### Scenario: 避免主題閃爍（FOUC）

- **WHEN** 頁面首次載入
- **THEN** 在 hydration 之前設定正確的 `data-theme` attribute
- **AND** 使用者不會看到「先顯示預設主題，再切換到儲存的主題」的閃爍

### Requirement: 特殊組件主題處理

系統 SHALL 處理複雜組件（如 Canvas, SVG）的主題切換。

#### Scenario: Canvas 元素主題

- **WHEN** 組件使用 `<canvas>`（如 BpmDetector 的骨架繪製）
- **THEN** 骨架顏色根據主題切換（深色主題用 `aqua`，淺色主題用 `blue`）
- **AND** 背景透明或使用主題背景色

#### Scenario: ReactSpringBg 漸層主題

- **WHEN** 使用 ReactSpringBg 組件
- **THEN** 漸層顏色根據主題切換（已實作，需確保正確）
- **AND** 過渡平滑（使用 `react-spring` 的 config）

#### Scenario: 圖片與 icon 主題適配

- **WHEN** 頁面包含圖片或 icon
- **THEN** 若 icon 為單色，使用 CSS filter 或 SVG currentColor 響應主題
- **AND** 若圖片不適合主題，考慮提供兩版本或加上半透明遮罩

## MODIFIED Requirements

無（這是新增的 capability）

## REMOVED Requirements

無

## RENAMED Requirements

無
