# Design Tokens 文件

本文件定義了 FitnessPartner 應用的所有 design tokens（設計標記），作為視覺設計的單一來源。

## 概述

Design Tokens 儲存在 `app/styles/tokens.css` 中，透過 CSS Variables 實作，支援深淺色主題動態切換。

## 使用原則

1. **永遠使用 tokens，不要 hardcode 值**

   ```tsx
   // ❌ 錯誤
   <div style={{ color: '#ffffff', background: '#000000' }}>

   // ✅ 正確
   <div style={{ color: 'var(--text-primary)', background: 'var(--bg-primary)' }}>
   // 或使用 Tailwind
   <div className="text-primary bg-primary">
   ```

2. **優先使用 semantic tokens 而非 color palette**

   ```css
   /* ❌ 避免 */
   color: var(--color-primary-500);

   /* ✅ 推薦 */
   color: var(--text-primary);
   background: var(--bg-elevated);
   ```

## Color Palette

### Primary (Blue)

主要品牌色，用於 CTA 按鈕、重要連結、強調元素。

| Token                 | Hex     | 用途        |
| --------------------- | ------- | ----------- |
| `--color-primary-50`  | #e3f2fd | 最淺背景    |
| `--color-primary-100` | #bbdefb | 淺背景      |
| `--color-primary-200` | #90caf9 |             |
| `--color-primary-300` | #64b5f6 |             |
| `--color-primary-400` | #42a5f5 |             |
| `--color-primary-500` | #0066aa | **主色**    |
| `--color-primary-600` | #005599 | Hover 狀態  |
| `--color-primary-700` | #004488 | Active 狀態 |
| `--color-primary-800` | #003377 |             |
| `--color-primary-900` | #001529 | 最深色      |

**Tailwind 用法**: `bg-primary-500`, `text-primary-600`, `border-primary-400`

### Secondary (Gray)

中性色，用於文字、邊框、背景。

| Token                   | Hex     | 用途     |
| ----------------------- | ------- | -------- |
| `--color-secondary-50`  | #fafafa | 最淺背景 |
| `--color-secondary-500` | #9e9e9e | 中性灰   |
| `--color-secondary-900` | #212121 | 最深色   |

### Semantic Colors

#### Success (Green)

成功狀態、確認訊息。

| Token                 | Value   | 用途     |
| --------------------- | ------- | -------- |
| `--color-success-500` | #38a169 | 主成功色 |
| `--color-success-600` | #2f855a | Hover    |

#### Warning (Orange)

警告訊息、需注意事項。

| Token                 | Value   | 用途     |
| --------------------- | ------- | -------- |
| `--color-warning-500` | #faad14 | 主警告色 |
| `--color-warning-600` | #d97706 | Hover    |

#### Error (Red)

錯誤訊息、刪除操作。

| Token               | Value   | 用途     |
| ------------------- | ------- | -------- |
| `--color-error-500` | #ef4444 | 主錯誤色 |
| `--color-error-600` | #dc2626 | Hover    |

#### Info (Blue)

資訊提示、輔助說明。

| Token              | Value   | 用途     |
| ------------------ | ------- | -------- |
| `--color-info-500` | #3b82f6 | 主資訊色 |
| `--color-info-600` | #2563eb | Hover    |

## Semantic Tokens

這些 tokens 會根據主題（深色/淺色）自動切換值。

### Backgrounds

| Token            | Dark Mode       | Light Mode      | 用途        |
| ---------------- | --------------- | --------------- | ----------- |
| `--bg-primary`   | #000000         | #ffffff         | 主要背景    |
| `--bg-secondary` | #0a0a0a         | #f8f9fa         | 次要背景    |
| `--bg-tertiary`  | #1a1a1a         | #e9ecef         | 第三層背景  |
| `--bg-elevated`  | #1f1f1f         | #ffffff         | 卡片、Modal |
| `--bg-overlay`   | rgba(0,0,0,0.7) | rgba(0,0,0,0.5) | 遮罩層      |

**使用範例**:

```tsx
<div className="bg-[var(--bg-primary)]">主要區域</div>
<Card style={{ background: 'var(--bg-elevated)' }}>卡片內容</Card>
```

### Text

| Token              | Dark Mode | Light Mode | 用途       |
| ------------------ | --------- | ---------- | ---------- |
| `--text-primary`   | #ffffff   | #1a1a1a    | 主要文字   |
| `--text-secondary` | #b0b0b0   | #4a4a4a    | 次要文字   |
| `--text-tertiary`  | #808080   | #6a6a6a    | 第三層文字 |
| `--text-inverse`   | #000000   | #ffffff    | 反色文字   |
| `--text-disabled`  | #4a4a4a   | #9e9e9e    | 停用狀態   |

### Borders

| Token                | Dark Mode              | Light Mode          | 用途     |
| -------------------- | ---------------------- | ------------------- | -------- |
| `--border-primary`   | rgba(255,255,255,0.1)  | rgba(0,0,0,0.1)     | 主要邊框 |
| `--border-secondary` | rgba(255,255,255,0.05) | rgba(0,0,0,0.05)    | 次要邊框 |
| `--border-accent`    | --color-primary-500    | --color-primary-500 | 強調邊框 |

### Interactive States

| Token              | Dark Mode              | Light Mode          | 用途          |
| ------------------ | ---------------------- | ------------------- | ------------- |
| `--hover-overlay`  | rgba(255,255,255,0.05) | rgba(0,0,0,0.05)    | Hover 覆蓋層  |
| `--active-overlay` | rgba(255,255,255,0.1)  | rgba(0,0,0,0.1)     | Active 覆蓋層 |
| `--focus-ring`     | --color-primary-500    | --color-primary-600 | Focus 外框    |

## Typography

### Font Sizes

| Token              | Value | Tailwind    | 用途     |
| ------------------ | ----- | ----------- | -------- |
| `--font-size-xs`   | 12px  | `text-xs`   | 小註解   |
| `--font-size-sm`   | 14px  | `text-sm`   | 次要文字 |
| `--font-size-base` | 16px  | `text-base` | 正文     |
| `--font-size-lg`   | 18px  | `text-lg`   | 大正文   |
| `--font-size-xl`   | 20px  | `text-xl`   | 小標題   |
| `--font-size-2xl`  | 24px  | `text-2xl`  | 標題     |
| `--font-size-3xl`  | 30px  | `text-3xl`  | 大標題   |
| `--font-size-4xl`  | 36px  | `text-4xl`  | 超大標題 |

### Line Heights

| Token                   | Value | Tailwind          | 用途     |
| ----------------------- | ----- | ----------------- | -------- |
| `--line-height-tight`   | 1.25  | `leading-tight`   | 標題     |
| `--line-height-normal`  | 1.5   | `leading-normal`  | 正文     |
| `--line-height-relaxed` | 1.625 | `leading-relaxed` | 舒適閱讀 |

### Font Weights

| Token                    | Value | Tailwind        | 用途     |
| ------------------------ | ----- | --------------- | -------- |
| `--font-weight-normal`   | 400   | `font-normal`   | 正文     |
| `--font-weight-medium`   | 500   | `font-medium`   | 次要強調 |
| `--font-weight-semibold` | 600   | `font-semibold` | 強調     |
| `--font-weight-bold`     | 700   | `font-bold`     | 標題     |

## Spacing (4px Grid System)

所有間距基於 4px 網格，確保視覺一致性。

| Token          | Value | Tailwind              | 用途     |
| -------------- | ----- | --------------------- | -------- |
| `--spacing-1`  | 4px   | `p-1`, `m-1`, `gap-1` | 極小間距 |
| `--spacing-2`  | 8px   | `p-2`, `m-2`, `gap-2` | 小間距   |
| `--spacing-4`  | 16px  | `p-4`, `m-4`, `gap-4` | 標準間距 |
| `--spacing-6`  | 24px  | `p-6`, `m-6`, `gap-6` | 大間距   |
| `--spacing-8`  | 32px  | `p-8`, `m-8`, `gap-8` | 超大間距 |
| `--spacing-12` | 48px  | `p-12`, `m-12`        | 區塊間距 |

**使用建議**:

- 元素內距：`p-4` ~ `p-6` (16-24px)
- 元素外距：`mb-4` ~ `mb-8` (16-32px)
- 區塊間距：`space-y-8` ~ `space-y-12` (32-48px)

## Border Radius

| Token           | Value  | Tailwind       | 用途         |
| --------------- | ------ | -------------- | ------------ |
| `--radius-sm`   | 4px    | `rounded-sm`   | 小元素       |
| `--radius-base` | 6px    | `rounded`      | 預設         |
| `--radius-md`   | 8px    | `rounded-md`   | 按鈕、輸入框 |
| `--radius-lg`   | 12px   | `rounded-lg`   | 卡片         |
| `--radius-xl`   | 16px   | `rounded-xl`   | 大型容器     |
| `--radius-2xl`  | 24px   | `rounded-2xl`  | Modal        |
| `--radius-full` | 9999px | `rounded-full` | 圓形         |

## Shadows (Elevation System)

4 階 elevation 系統，表達 UI 層級關係。

| Token           | Tailwind    | 用途       | 範例            |
| --------------- | ----------- | ---------- | --------------- |
| `--shadow-sm`   | `shadow-sm` | 微妙邊界   | Input focus     |
| `--shadow-base` | `shadow`    | 標準卡片   | Card            |
| `--shadow-md`   | `shadow-md` | Hover 卡片 | Card hover      |
| `--shadow-lg`   | `shadow-lg` | Dropdown   | Select dropdown |
| `--shadow-xl`   | `shadow-xl` | Modal      | Modal, Drawer   |

**使用範例**:

```tsx
<Card className="shadow hover:shadow-lg transition-shadow">
```

## Transitions

| Token                | Value | 用途                     |
| -------------------- | ----- | ------------------------ |
| `--transition-fast`  | 150ms | 快速互動（hover, click） |
| `--transition-base`  | 300ms | 一般動畫（展開/收合）    |
| `--transition-slow`  | 500ms | 慢動畫（頁面切換）       |
| `--transition-theme` | 300ms | 主題切換                 |

**Easing Functions**:

- `--ease-in`: 加速
- `--ease-out`: 減速（推薦用於 UI 動畫）
- `--ease-in-out`: 先加速後減速
- `--ease-bounce`: 彈跳效果

**使用範例**:

```css
.button {
  transition: background-color var(--transition-fast) var(--ease-out);
}
```

## Z-Index Scale

預定義的 z-index 層級，避免層級衝突。

| Token                | Value | 用途            |
| -------------------- | ----- | --------------- |
| `--z-dropdown`       | 1000  | Dropdown menu   |
| `--z-sticky`         | 1020  | Sticky elements |
| `--z-fixed`          | 1030  | Fixed elements  |
| `--z-modal-backdrop` | 1040  | Modal backdrop  |
| `--z-modal`          | 1050  | Modal           |
| `--z-popover`        | 1060  | Popover         |
| `--z-tooltip`        | 1070  | Tooltip         |

## 擴充 Tokens

### 如何新增 Token

1. **在 `tokens.css` 中定義**:

   ```css
   :root {
     --my-new-token: value;
   }

   [data-theme="light"] {
     --my-new-token: light-value;
   }
   ```

2. **（可選）在 `tailwind.config.ts` 中註冊**:

   ```typescript
   theme: {
     extend: {
       colors: {
         custom: "var(--my-new-token)";
       }
     }
   }
   ```

3. **在組件中使用**:
   ```tsx
   <div className="bg-[var(--my-new-token)]">
   // 或如果在 Tailwind 中註冊了
   <div className="bg-custom">
   ```

### 命名規範

- **顏色**: `--color-{category}-{shade}`
  - 例: `--color-primary-500`, `--color-success-600`
- **語意化**: `--{property}-{variant}`
  - 例: `--bg-primary`, `--text-secondary`, `--border-accent`
- **尺寸**: `--{type}-{size}`
  - 例: `--font-size-lg`, `--spacing-4`, `--radius-md`
- **功能性**: `--{function}-{variant}`
  - 例: `--transition-fast`, `--shadow-lg`, `--z-modal`

## 對比度檢查

所有文字與背景組合都符合 **WCAG AA** 標準（對比度 >= 4.5:1）。

### 安全組合

| 背景             | 文字               | 對比度 | 等級 |
| ---------------- | ------------------ | ------ | ---- |
| `--bg-primary`   | `--text-primary`   | 21:1   | AAA  |
| `--bg-secondary` | `--text-primary`   | 18:1   | AAA  |
| `--bg-elevated`  | `--text-secondary` | 8:1    | AAA  |

使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 驗證新組合。

## 參考資料

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Material Design Color System](https://m3.material.io/styles/color/system/overview)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
