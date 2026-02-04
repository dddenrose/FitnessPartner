# UI Components Capability

## ADDED Requirements

### Requirement: 現代化排版系統

系統 SHALL 提供層次分明的排版系統，提升內容可讀性。

#### Scenario: Heading 層級

- **WHEN** 使用標題元素
- **THEN** 使用語意化標籤（`<h1>` ~ `<h6>`）並配合對應的樣式 class
- **AND** h1 為頁面主標題（每頁僅一個），h2 為區塊標題，h3 為子標題

#### Scenario: 字型大小 scale

- **WHEN** 設定文字大小
- **THEN** 使用預定義的 scale（`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` ~ `text-6xl`）
- **AND** 避免使用 arbitrary values（如 `text-[17px]`）

#### Scenario: 字重與樣式

- **WHEN** 需要強調文字
- **THEN** 使用 `font-medium`, `font-semibold`, `font-bold` 而非 `<b>` 標籤
- **AND** 使用 `italic` 而非 `<i>` 標籤（除非語意需要）

### Requirement: 統一的間距系統

系統 SHALL 使用 4px/8px grid system，確保視覺節奏一致。

#### Scenario: 元素間距

- **WHEN** 設定 margin 或 padding
- **THEN** 使用 4 的倍數（`p-1` = 4px, `p-2` = 8px, `p-4` = 16px...）
- **AND** 常用間距：內距 `p-4` ~ `p-6`，外距 `mb-4` ~ `mb-8`，區塊間距 `space-y-6` ~ `space-y-12`

#### Scenario: 容器內距

- **WHEN** 設計 Card, Panel, Section 等容器
- **THEN** 內距使用 `p-4`（mobile）~ `p-6`（desktop）
- **AND** 確保內容不會貼邊（最小 16px 內距）

#### Scenario: 區塊間距

- **WHEN** 排列多個區塊（如首頁的各 section）
- **THEN** 區塊間使用較大間距（`space-y-12` 或 `space-y-16`）
- **AND** 確保視覺上有明顯區隔

### Requirement: 陰影與深度系統

系統 SHALL 提供 4 階 elevation system，表達元素層級。

#### Scenario: Elevation levels

- **WHEN** 元素需要「浮起」的視覺效果
- **THEN** 使用預定義的 shadow（`shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`）
- **AND** 根據互動程度選擇：static 元素用 `shadow-sm`，卡片用 `shadow`，hover 用 `shadow-lg`，modal 用 `shadow-xl`

#### Scenario: 深色主題陰影

- **WHEN** 在深色主題下顯示陰影
- **THEN** 陰影顏色應為更深的黑色或藍色（透過 CSS Variables 調整）
- **AND** 陰影更明顯（可能需要增加 spread 或 blur）

#### Scenario: Hover elevation

- **WHEN** 卡片或按鈕可互動
- **THEN** hover 時增加陰影（如從 `shadow` 變為 `shadow-lg`）
- **AND** 配合 `transition-shadow duration-200` 平滑過渡

### Requirement: 圓角系統

系統 SHALL 提供統一的圓角值，保持視覺一致性。

#### Scenario: 標準圓角值

- **WHEN** 設定 border-radius
- **THEN** 使用預定義值（`rounded` = 4px, `rounded-md` = 6px, `rounded-lg` = 8px, `rounded-xl` = 12px, `rounded-2xl` = 16px）
- **AND** 一般 UI 元素用 `rounded-md` ~ `rounded-lg`，大型容器用 `rounded-xl`

#### Scenario: 圓形元素

- **WHEN** 製作頭像、badge 等圓形元素
- **THEN** 使用 `rounded-full`
- **AND** 確保元素為正方形（`aspect-ratio: 1`）

#### Scenario: 圓角一致性

- **WHEN** 同一組件內有多個元素
- **THEN** 使用相同的圓角值（如 Card 與內部的 Image 都用 `rounded-lg`）
- **AND** 嵌套元素的圓角略小於外層（如外層 `rounded-lg`，內層 `rounded-md`）

### Requirement: 色彩調色板

系統 SHALL 提供完整的色彩系統，支援語意化與層次化使用。

#### Scenario: Primary/Secondary colors

- **WHEN** 使用品牌色
- **THEN** primary 用於主要 CTA（`bg-primary-500`, `text-primary-600`）
- **AND** secondary 用於次要元素（`bg-secondary-500`）

#### Scenario: Semantic colors

- **WHEN** 顯示狀態訊息
- **THEN** 使用 semantic colors（success = green, warning = yellow, error = red, info = blue）
- **AND** 配合適當的 icon 與文字

#### Scenario: Neutral colors

- **WHEN** 使用背景、邊框、文字等非品牌色
- **THEN** 使用 gray scale（`bg-gray-50` ~ `bg-gray-900`, `text-gray-600`, `border-gray-200`）
- **AND** 確保對比度符合 WCAG AA

#### Scenario: Color shades

- **WHEN** 需要同色系的不同深淺
- **THEN** 使用 50-900 的 shade system（50 最淺，900 最深）
- **AND** 通常 500 為基準色，300-400 為淺色，600-700 為深色

### Requirement: 動畫與過渡

系統 SHALL 提供平滑的動畫，提升互動體驗。

#### Scenario: Transition timing

- **WHEN** 元素需要過渡效果
- **THEN** 使用預定義的 duration（`duration-150` = fast, `duration-300` = base, `duration-500` = slow）
- **AND** 使用適當的 easing（`ease-in`, `ease-out`, `ease-in-out`）

#### Scenario: Hover/Focus transitions

- **WHEN** 互動元素需要 hover/focus 效果
- **THEN** 加入 `transition-colors duration-200` 或 `transition-all duration-200`
- **AND** 確保過渡平滑，不會閃爍

#### Scenario: 載入動畫

- **WHEN** 顯示載入狀態
- **THEN** 使用 Ant Design 的 `<Spin>` 或自訂 Skeleton
- **AND** 動畫流暢，幀率 >= 30fps

#### Scenario: 頁面切換動畫

- **WHEN** Next.js 路由切換（可選）
- **THEN** 使用 fade 或 slide 過渡
- **AND** 過渡時間 200-300ms，不阻塞導航

### Requirement: 按鈕與互動元素

系統 SHALL 提供一致的按鈕樣式與互動回饋。

#### Scenario: 按鈕變體

- **WHEN** 使用按鈕
- **THEN** 優先使用 Ant Design `<Button>` 組件
- **AND** 使用適當的 type（`primary`, `default`, `dashed`, `text`, `link`）

#### Scenario: 按鈕狀態

- **WHEN** 按鈕可互動
- **THEN** 提供 hover, focus, active, disabled 狀態的視覺回饋
- **AND** disabled 狀態降低 opacity 並加上 `cursor-not-allowed`

#### Scenario: 按鈕大小

- **WHEN** 設定按鈕大小
- **THEN** 使用 `size` prop（`small`, `middle`, `large`）
- **AND** mobile 上使用 `middle` 或 `large`（確保 44x44px 點擊區域）

### Requirement: 表單元素

系統 SHALL 提供友善的表單輸入體驗。

#### Scenario: 輸入框樣式

- **WHEN** 使用輸入框
- **THEN** 優先使用 Ant Design `<Input>`, `<Select>` 等組件
- **AND** 確保 focus ring 清晰可見（WCAG 要求）

#### Scenario: 表單驗證回饋

- **WHEN** 表單欄位驗證失敗
- **THEN** 顯示紅色邊框與錯誤訊息
- **AND** 錯誤訊息使用 `<Form.Item>` 的 `help` 與 `validateStatus`

#### Scenario: 表單標籤

- **WHEN** 顯示表單欄位
- **THEN** 每個欄位必須有清楚的 `<label>` 或 `<Form.Item label>`
- **AND** 必填欄位標示 `*`（透過 Ant Design 的 `required` prop）

### Requirement: 卡片與容器

系統 SHALL 提供一致的卡片樣式，用於內容分組。

#### Scenario: Card 基本樣式

- **WHEN** 使用 Card 組件
- **THEN** 包含適當的內距（`p-4` ~ `p-6`）、圓角（`rounded-lg`）、陰影（`shadow`）
- **AND** 背景色使用 `bg-white`（light）或 `bg-gray-800`（dark）

#### Scenario: Card hover 效果

- **WHEN** Card 可點擊
- **THEN** hover 時增加陰影（`hover:shadow-lg`）或微微上移（`hover:-translate-y-1`）
- **AND** 加上 `cursor-pointer` 與 `transition-all duration-200`

#### Scenario: Card 內容排版

- **WHEN** Card 內有標題、內容、footer
- **THEN** 使用適當的間距區隔（如 `space-y-2` 或 `space-y-4`）
- **AND** 標題使用較大字型（`text-lg font-semibold`）

## MODIFIED Requirements

無（這是新增的 capability）

## REMOVED Requirements

無

## RENAMED Requirements

無
