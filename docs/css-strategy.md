# CSS 策略指南

本文件定義 FitnessPartner 專案中 CSS 的使用優先順序與最佳實踐。

## 三層 CSS 策略

我們採用 **Tailwind CSS + CSS Modules + Ant Design** 的混合策略，各司其職：

### 1. Tailwind CSS（第一優先）

**用於**：佈局、間距、響應式、通用工具類。

✅ **推薦使用場景**：

```tsx
// 佈局與 Flexbox/Grid
<div className="flex items-center justify-between gap-4">

// 響應式
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 間距
<div className="p-6 mb-4">

// 簡單樣式組合
<button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
```

❌ **避免使用**：

- 複雜動畫（用 CSS Modules）
- 組件內部細節樣式（用 CSS Modules）
- 需要 `:before`, `:after` 偽元素（用 CSS Modules）

### 2. CSS Modules（第二優先）

**用於**：組件特定樣式、複雜動畫、偽元素。

✅ **推薦使用場景**：

```tsx
// styles.module.css
.card {
  background: var(--bg-elevated);
  transition: transform var(--transition-base) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
}

.card::before {
  content: '';
  position: absolute;
  /* 複雜裝飾效果 */
}

// Component.tsx
import styles from './styles.module.css';

<div className={styles.card}>
```

❌ **避免使用**：

- 重複的佈局邏輯（用 Tailwind）
- hardcoded 顏色/尺寸（用 CSS Variables）

### 3. Ant Design（第三優先）

**用於**：表單元件、複雜互動組件（Modal, Drawer, Table 等）。

✅ **推薦使用場景**：

```tsx
// 表單
<Form layout="vertical">
  <Form.Item label="姓名" name="name">
    <Input />
  </Form.Item>
</Form>

// 複雜元件
<Modal title="確認刪除">...</Modal>
<Table dataSource={data} columns={columns} />
```

❌ **避免使用**：

- 簡單 button（自行實作或用 Tailwind）
- 佈局組件（用 Tailwind 的 flex/grid）

## 決策流程圖

```
需要新增樣式？
  ├─ 是佈局/間距/響應式？ → 使用 Tailwind
  ├─ 是表單/Table/Modal？ → 使用 Ant Design
  ├─ 是複雜動畫/偽元素？ → 使用 CSS Modules
  └─ 是簡單樣式組合（< 5 個 class）？ → 使用 Tailwind
  └─ 是複雜樣式組合（> 5 個 class）？ → 使用 CSS Modules
```

## 標準 Breakpoints

統一使用以下 breakpoints，與 Tailwind 預設值一致：

```typescript
// lib/constants/breakpoints.ts
export const BREAKPOINTS = {
  mobile: 640, // < 640px
  tablet: 1024, // 640px - 1024px
  desktop: 1024, // > 1024px
} as const;

export const MEDIA_QUERIES = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const;
```

**Tailwind 用法**：

```tsx
// Mobile-first（預設 mobile，往上覆寫）
<div className="text-sm md:text-base lg:text-lg">
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**React Hook 用法**：

```tsx
import { useMediaQuery } from "@/lib/hooks";

const isMobile = useMediaQuery("(max-width: 639px)");
const isDesktop = useMediaQuery("(min-width: 1024px)");
```

## classNames 工具函數

使用 `clsx` 與 `tailwind-merge` 組合工具類：

```typescript
// lib/utils/styles.ts
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**使用範例**：

```tsx
import { cn } from '@/lib/utils/styles';

<div className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-primary-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

## Design Tokens 使用規範

### 顏色

✅ **永遠使用 CSS Variables**：

```tsx
// CSS Modules
.card {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

// Tailwind（需先在 tailwind.config.ts 註冊）
<div className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">
```

❌ **禁止 hardcode**：

```tsx
// ❌ 錯誤
<div style={{ background: '#ffffff', color: '#000000' }}>

// ✅ 正確
<div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
```

### 間距

✅ **優先使用 Tailwind spacing scale**：

```tsx
<div className="p-4 mb-6 gap-2">
```

✅ **CSS Modules 中使用 CSS Variables**：

```css
.container {
  padding: var(--spacing-6);
  gap: var(--spacing-4);
}
```

### Typography

✅ **優先使用 Tailwind utilities**：

```tsx
<h1 className="text-3xl font-bold leading-tight">
<p className="text-base font-normal leading-relaxed">
```

✅ **CSS Modules 中使用 CSS Variables**：

```css
.heading {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}
```

## 組件樣式檔案結構

```
components/
  MyComponent/
    index.tsx          # 主要組件
    styles.module.css  # CSS Modules（如需要）
    types.ts           # TypeScript 類型
    utils.ts           # 輔助函數
```

## 實作範例

### 範例 1：簡單卡片組件（Tailwind 為主）

```tsx
// components/Card/index.tsx
export function Card({ children, elevated = false }: CardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg",
        "bg-[var(--bg-elevated)]",
        "border border-[var(--border-primary)]",
        elevated && "shadow-lg hover:shadow-xl",
        "transition-shadow duration-300"
      )}
    >
      {children}
    </div>
  );
}
```

### 範例 2：複雜動畫組件（CSS Modules 為主）

```tsx
// components/AnimatedCard/index.tsx
import styles from "./styles.module.css";

export function AnimatedCard({ children }: Props) {
  return (
    <div className={cn("p-6", styles.card)}>
      <div className={styles.glow} />
      {children}
    </div>
  );
}
```

```css
/* components/AnimatedCard/styles.module.css */
.card {
  position: relative;
  background: var(--bg-elevated);
  overflow: hidden;
  transition: transform var(--transition-base) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    var(--color-primary-500),
    transparent 50%
  );
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.card:hover .glow {
  opacity: 0.1;
}
```

### 範例 3：Ant Design 客製化

```tsx
// components/CustomModal/index.tsx
import { Modal } from "antd";

export function CustomModal({ children, ...props }: Props) {
  return (
    <Modal
      {...props}
      className="rounded-2xl"
      styles={{
        content: {
          background: "var(--bg-elevated)",
          padding: "var(--spacing-6)",
        },
        header: {
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-primary)",
        },
      }}
    >
      {children}
    </Modal>
  );
}
```

## 響應式設計原則

### Mobile-First 策略

✅ **預設 mobile，往上覆寫**：

```tsx
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
```

❌ **避免 desktop-first**：

```tsx
// ❌ 錯誤
<div className="text-lg md:text-base sm:text-sm">
```

### 觸控友善設計

- **最小點擊區域**：44px × 44px（iOS 建議）
- **間距**：至少 8px 以避免誤觸

```tsx
// ✅ 正確
<button className="min-h-[44px] px-6 py-3 rounded-lg">

// ❌ 錯誤（太小）
<button className="px-2 py-1 text-xs">
```

## 效能最佳化

### 1. 避免過度使用 arbitrary values

```tsx
// ❌ 避免（無法被 PurgeCSS 最佳化）
<div className="text-[#ff5733] p-[13px]">

// ✅ 推薦（使用 design tokens）
<div className="text-[var(--color-error-500)] p-4">
```

### 2. 使用 CSS Modules 隔離複雜樣式

複雜樣式放在 CSS Modules 中，避免 className 過長：

```tsx
// ❌ 避免
<div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 opacity-50 blur-xl animate-pulse">

// ✅ 推薦
<div className={styles.complexBackground}>
```

### 3. 條件樣式最佳化

```tsx
// ✅ 使用 cn() 工具
<div className={cn(
  'base-styles',
  condition && 'conditional-styles'
)}>

// ❌ 避免字串模板（難以最佳化）
<div className={`base-styles ${condition ? 'conditional-styles' : ''}`}>
```

## 稽查檢查清單

在提交 PR 前，確認：

- [ ] 沒有 hardcoded 顏色（使用 CSS Variables）
- [ ] 響應式 breakpoints 統一（640px, 1024px）
- [ ] Tailwind class 不超過 8 個（複雜樣式用 CSS Modules）
- [ ] CSS Modules 使用 camelCase 命名
- [ ] 所有 design tokens 都已定義在 `tokens.css`
- [ ] 新組件的最小點擊區域 >= 44px
- [ ] 動畫使用 design tokens 的 transition timing

## 遷移現有程式碼

### 步驟 1：找出 hardcoded 樣式

```bash
# 搜尋 hardcoded 顏色
grep -r "#[0-9a-fA-F]\{6\}" app/

# 搜尋 inline styles
grep -r "style={{" app/
```

### 步驟 2：替換為 CSS Variables

```tsx
// Before
<div style={{ background: '#ffffff', color: '#000000' }}>

// After
<div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
```

### 步驟 3：統一 breakpoints

```tsx
// Before
const isMobile = useMediaQuery("(max-width: 768px)");

// After
const isMobile = useMediaQuery("(max-width: 639px)");
```

## 參考資料

- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Ant Design Customization](https://ant.design/docs/react/customize-theme)
- 內部文件：[docs/design-tokens.md](./design-tokens.md)
