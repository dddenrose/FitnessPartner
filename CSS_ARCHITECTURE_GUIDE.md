# CSS 架構指南

## 使用原則

### 1. CSS Modules 為主體

- 複雜樣式使用 CSS Modules (`.module.css`)
- 組件特定樣式獨立管理
- 響應式設計在 CSS Modules 中處理

### 2. Ant Design + CSS Modules 混用

- Ant Design 組件保持原生 API
- 自定義樣式使用 `className={styles.xxx}` 覆蓋
- 主題配置在 `layout.tsx` 的 ConfigProvider 中統一設定

### 3. Tailwind 輔助使用

- 簡單佈局使用 utility classes (flex, grid 等)
- 避免複雜的 Tailwind 組合
- 複雜樣式改用 CSS Modules

## 全域變數系統

CSS Custom Properties 定義在 globals.css:

```css
/* 基礎顏色 */
--color-primary: #202020ff;
--text-white: #ffffff;

/* 字體 */
--font-size-9xl: 8rem;
--font-family-mono: monospace;

/* 間距 */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
```

## 文件結構規範

```
components/
├── ComponentName/
│   ├── index.tsx
│   ├── styles.module.css
│   └── types.ts (如需要)
```

## 實際使用範例

### 正確使用```tsx

// 組件檔案
import styles from "./styles.module.css";
import { Button } from "antd";

const MyComponent = () => (

  <div className={styles.container}>
    <Button className={styles.customButton}>點擊我</Button>
  </div>
);
```

```css
/* styles.module.css */
.container {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.customButton {
  background: var(--color-primary);
  border-radius: var(--border-radius-lg);
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

### 避免使用

```tsx
// 不建議: 過多 inline styles
<div style={{ fontSize: "8rem", fontWeight: "bold", color: "white" }}>

// 不建議: 過多 Tailwind classes
<div className="flex flex-col items-center justify-center bg-gray-900 text-white text-8xl font-bold font-mono">
```

## 主題系統

### Ant Design 主題

```tsx
// layout.tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#202020FF"
    }
  }}
>
```

### CSS Variables 主題

- 可擴展暗色/亮色主題
- 統一的顏色、字體、間距管理

## 維護建議

1. 新組件優先使用 CSS Modules
2. 樣式修改在對應的 `.module.css` 文件中修改
3. 需要新變數時更新 `globals.css`
4. 響應式在組件的 CSS Module 中統一處理

## 重構成果

| 組件          | 重構前                    | 重構後                 |
| ------------- | ------------------------- | ---------------------- |
| UnifiedTimer  | Inline Styles             | CSS Modules + 全域變數 |
| ControlPanel  | Inline + Media Query Hook | CSS Modules 響應式     |
| Exercise Page | Flex + Style Props        | CSS Modules 佈局       |
| Metronome     | 基礎 CSS Modules          | 統一變數系統           |

架構優勢:

- 統一的樣式管理方式
- CSS 作用域隔離
- 易於維護和擴展
- 統一的響應式斷點管理
