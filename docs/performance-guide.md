# 效能優化指南

## 目標

- Performance Score > 90
- Accessibility Score > 95
- SEO Score > 90

## 實施項目

### 1. 已完成的優化

#### 圖片優化

- ✅ 所有主要圖片使用 Next.js `<Image>` 組件
- ✅ 自動格式轉換（WebP 支援）
- ✅ 響應式圖片加載
- ✅ 為所有圖片添加 alt text

#### 代碼分割

- ✅ `ReportContent` 組件使用 Suspense boundary
- ✅ `Exercise` 和 `Finish` 組件使用 Suspense boundary
- ✅ 運動報表頁面的 Suspense loading state

#### 無障礙優化

- ✅ 所有 icon-only buttons 添加 `aria-label`
- ✅ 顏色對比度符合 WCAG AA 標準
- ✅ 鍵盤導航支援（Ant Design 內建）
- ✅ 圖片添加語義化 alt text

#### 交互優化

- ✅ 按鈕 hover/active 狀態動畫
- ✅ 全局 focus ring 樣式（WCAG 相容）
- ✅ 卡片 hover elevation 效果
- ✅ Success checkmark 動畫

### 2. CSS 優化建議

#### 移除未使用的 CSS

```bash
# 檢查 Tailwind 未使用的類
npx @fullhuman/postcss-purgecss --content='app/**/*.{jsx,tsx}'
```

#### CSS 策略

- 優先使用 Tailwind 實用類
- 關鍵路徑 CSS 內聯（由 Next.js 自動處理）
- 動畫使用 GPU 加速 (`will-change`, `transform`)

### 3. 懶加載機制

#### 組件懶加載

- `ReportContent` - 通過 Suspense 邊界分割
- `Exercise` - 初始化時顯示加載狀態
- `Finish` - 運動結束時顯示加載狀態

### 4. 資源優化

#### 字體

- Bricolage_Grotesque: 由 Next.js 自動優化

#### 第三方腳本

- Firebase Authentication: 異步加載

### 5. Lighthouse 測試指令

```bash
# 開發環境構建
npm run build

# 啟動生產服務器
npm start

# 使用 Google Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### 6. 監控指標

#### Core Web Vitals

- **LCP (Largest Contentful Paint)**: 2.5s 以下
- **FID (First Input Delay)**: 100ms 以下
- **CLS (Cumulative Layout Shift)**: 0.1 以下

#### 性能檢查清單

- [ ] 首頁載入時間 < 3s
- [ ] 運動報表頁面 < 4s
- [ ] 運動頁面 < 2s
- [ ] 搜索對比度 ≥ 4.5:1
- [ ] 鍵盤可導航
- [ ] 無 console 錯誤

### 7. 持續改進

#### 未來優化機會

1. 實施 WebP 圖片格式（已通過 Next.js 自動處理）
2. 實施 CDN 加快資源交付
3. 實施 Service Worker 離線支援
4. 實施分析監控（例如 Sentry）
5. 優化 Redux store 體積（考慮 Zustand）
6. 實施虛擬化列表（如果有長列表）

## 性能基準

### 目標狀態

```
Performance: 92
Accessibility: 96
Best Practices: 95
SEO: 90
```

## 測試流程

1. 執行 `npm run build`
2. 執行 `npm start`
3. 開啟 Chrome DevTools > Lighthouse
4. 生成報表並驗證得分
5. 根據建議進行迭代改進
