# 設計系統文件

## 概述

Neo Fitness Partner 的設計系統基於現代化的 UI/UX 原則，包含色彩系統、排版、間距、陰影、動畫等完整的設計規範。

## 核心設計原則

### 1. 主題支援

- **深色模式**：最適合低光環境，減少眼睛疲勞
- **亮色模式**：高對比度，適合明亮環境
- **自動切換**：跟隨系統主題偏好設置

### 2. 響應式設計

- **Mobile**：< 640px - 優化觸控體驗
- **Tablet**：640px - 1023px - 平衡布局
- **Desktop**：≥ 1024px - 充分利用螢幕空間

### 3. 可訪問性

- 符合 WCAG AA 標準
- 充分的色彩對比度
- 清晰的鍵盤導航
- 適當的 ARIA 標籤

## 色彩系統

### 主色調 (Primary)

```css
--color-primary-50: #f0f7ff
--color-primary-500: #0066aa
--color-primary-900: #003d66
```

### 語義色 (Semantic)

- **Success**：用於成功、完成、確認的狀態
- **Warning**：用於警告、注意的狀態
- **Error**：用於錯誤、失敗的狀態
- **Info**：用於信息、提示的狀態

### 中性色

- **Text Primary**：主要文字
- **Text Secondary**：次要文字
- **Background**：背景色
- **Border**：邊框色

## 排版系統

### 字體大小 (Font Size)

```
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
...
```

### 行高規範

- 緊湊：1
- 標準：1.5rem
- 寬鬆：1.75rem

## 間距系統

使用 4px 網格系統：

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
base: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
```

## 圓角系統

```css
--radius-sm: 4px
--radius-base: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
--radius-2xl: 24px
```

## 陰影系統

### 4 個等級

- **sm**：輕微陰影，用於小型組件
- **base**：標準陰影，用於卡片
- **md**：中等陰影，用於浮層
- **lg**：重陰影，用於模態框

## 動畫與過渡

### 過渡時間

- **fast**：150ms - 快速反饋
- **base**：300ms - 標準過渡
- **slow**：500ms - 緩慢進入

### 動畫類型

- **Fade**：淡入/淡出
- **Slide**：滑動進入
- **Scale**：縮放變換
- **Pulse**：脈衝效果

## 組件規範

### 按鈕

- 最小高度：44px（易於點擊）
- 最小寬度：適應內容，最少 60px
- 狀態：default, hover, active, disabled, loading

### 表單欄位

- 最小高度：40px
- Focus ring：2px 實線，偏移 2px
- 標籤位置：上方或左側

### 卡片

- 內邊距：16px - 24px
- 邊框寬度：1px 或無邊框
- 陰影等級：base

## 無障礙檢查清單

- [ ] 色彩對比度 ≥ 4.5:1（WCAG AA）
- [ ] 所有互動元素可通過鍵盤訪問
- [ ] 聚焦狀態清晰可見
- [ ] 圖片和圖標有 alt/aria-label
- [ ] 表單欄位有關聯的標籤
- [ ] 頁面可用螢幕閱讀器訪問

## 最佳實踐

### 色彩使用

```tsx
// ✅ Good - 使用 CSS 變數
style={{ color: "var(--text-primary)" }}

// ❌ Bad - 硬編碼顏色
style={{ color: "#000000" }}
```

### 響應式設計

```tsx
// ✅ Good - 使用標準 breakpoints
className = "text-base md:text-lg lg:text-xl";

// ❌ Bad - 任意值
className = "text-[13px]";
```

### 動畫

```tsx
// ✅ Good - 使用預定義動畫
className="animate-fade-in"

// ❌ Bad - 自訂不規範的過渡
style={{ transition: "all 0.123s cubic-bezier(...)" }}
```

## 進一步閱讀

- [Tailwind CSS 配置](../tailwind.config.ts)
- [CSS 變數定義](../app/styles/tokens.css)
- [全局樣式](../app/globals.css)
- [CSS 策略](./css-strategy.md)
- [Design Tokens](./design-tokens.md)
