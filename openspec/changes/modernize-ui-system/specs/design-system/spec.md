# Design System Capability

## ADDED Requirements

### Requirement: Design Token 系統

系統 SHALL 提供集中管理的 design tokens，作為所有視覺樣式的單一來源。

#### Scenario: 定義顏色 tokens

- **WHEN** 開發者需要使用顏色
- **THEN** 必須從 CSS Variables 中選擇（如 `var(--color-primary-500)`）
- **AND** 不可在組件中 hardcode 顏色值（如 `#0066aa`）

#### Scenario: 定義間距 tokens

- **WHEN** 開發者需要設定間距
- **THEN** 必須使用 Tailwind 的 spacing scale（4px grid: `p-2`, `m-4`）
- **AND** 避免使用 arbitrary values（如 `p-[13px]`）

#### Scenario: 定義字型 tokens

- **WHEN** 開發者需要設定字型大小
- **THEN** 必須從預定義的 typography scale 中選擇（`text-sm`, `text-lg`, `text-2xl`）
- **AND** 必須配合適當的 line-height（透過 CSS 變數 `--font-size-*` 與 `--line-height-*`）

#### Scenario: 支援主題切換

- **WHEN** 使用者切換主題（dark/light）
- **THEN** 所有使用 design tokens 的組件自動響應
- **AND** 不需要重新載入頁面

### Requirement: CSS 策略分層

系統 SHALL 明確定義 CSS 使用策略，避免樣式混亂。

#### Scenario: Tailwind 優先用於佈局與間距

- **WHEN** 開發者需要設定 flexbox/grid 佈局或 margin/padding
- **THEN** 必須優先使用 Tailwind utility classes（`flex`, `grid`, `p-4`, `gap-2`）
- **AND** 不可在 CSS Modules 或 inline styles 中重複實作

#### Scenario: CSS Modules 用於複雜樣式

- **WHEN** 組件需要複雜的動畫、偽元素、或 CSS Grid 細節
- **THEN** 可以使用 CSS Modules（`.module.css`）
- **AND** 必須在 module 中引用 CSS Variables 而非 hardcode 值

#### Scenario: Ant Design 統一配置

- **WHEN** 使用 Ant Design 組件
- **THEN** 必須透過 `DynamicAntdTheme` 的 ConfigProvider 統一覆寫樣式
- **AND** 不可在個別組件中使用 `styles` prop 覆寫主題色

#### Scenario: 避免 inline styles

- **WHEN** 組件需要樣式
- **THEN** 必須優先考慮 Tailwind → CSS Modules → Ant Design
- **AND** 僅在「必須動態計算」時使用 inline styles（如 `style={{ width: \`${progress}%\` }}`）

### Requirement: Tailwind 主題擴充

系統 SHALL 在 `tailwind.config.ts` 中擴充預設主題，與 CSS Variables 整合。

#### Scenario: 自訂顏色與 CSS Variables 整合

- **WHEN** 在 Tailwind config 中定義顏色
- **THEN** 必須指向 CSS Variables（如 `primary: { 500: 'var(--color-primary-500)' }`）
- **AND** 讓 Tailwind utilities（`bg-primary-500`）可直接使用

#### Scenario: 自訂 spacing/fontSize/shadows

- **WHEN** 需要擴充 Tailwind 的預設 scale
- **THEN** 在 `theme.extend` 中定義
- **AND** 確保命名遵循 Tailwind 慣例（數字或語意化名稱）

### Requirement: 標準 Breakpoints

系統 SHALL 使用統一的 breakpoints，全專案一致。

#### Scenario: 使用 Tailwind 預設 breakpoints

- **WHEN** 開發者需要實作響應式設計
- **THEN** 必須使用 Tailwind 的標準 breakpoints（`sm: 640px`, `md: 768px`, `lg: 1024px`）
- **AND** 在 CSS Modules 中的 media queries 也必須使用相同數值

#### Scenario: 移除舊的非標準 breakpoints

- **WHEN** 重構現有組件
- **THEN** 必須將 `@media (max-width: 480px)` 等非標準值改為標準值
- **AND** 確保視覺效果與重構前一致

#### Scenario: 提供標準 media query hooks

- **WHEN** 需要在 JavaScript 中判斷裝置尺寸
- **THEN** 使用 `useMediaQuery(MEDIA_QUERIES.mobile)` 等預定義常數
- **AND** 不可直接寫 magic numbers

### Requirement: 設計文件

系統 SHALL 提供完整的設計系統文件，降低學習成本。

#### Scenario: 色彩系統文件

- **WHEN** 開發者需要選擇顏色
- **THEN** 可查閱 `docs/color-system.md` 了解所有可用顏色與使用情境
- **AND** 文件包含色彩對比度資訊（WCAG AA/AAA）

#### Scenario: CSS 策略文件

- **WHEN** 開發者不確定該用哪種樣式方案
- **THEN** 可查閱 `docs/css-strategy.md` 的決策樹與範例
- **AND** 文件包含常見錯誤與最佳實踐

#### Scenario: Design tokens 文件

- **WHEN** 開發者需要查看所有可用 tokens
- **THEN** 可查閱 `docs/design-tokens.md` 的完整列表
- **AND** 文件包含 token 命名規範與擴充方式

## MODIFIED Requirements

無（這是新增的 capability）

## REMOVED Requirements

無

## RENAMED Requirements

無
