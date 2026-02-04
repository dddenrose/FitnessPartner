# 技術設計文件

## Context

FitnessPartner 是一個基於 Next.js 14 (App Router) 的健身應用，目前使用：

- **框架**: Next.js 14, React 18, TypeScript
- **樣式**: Tailwind CSS + CSS Modules + Ant Design
- **狀態管理**: Redux Toolkit + Redux Persist
- **UI 庫**: Ant Design 5.x, Material-UI (部分)
- **其他**: TensorFlow.js (姿態偵測), Firebase (認證)

**現狀痛點**:

1. 樣式策略混亂：三種樣式方案並存，無明確使用時機
2. 主題系統半成品：有 Redux state 但組件支援不完整
3. RWD 不一致：各組件自訂 breakpoints（768px, 480px 不統一）
4. 視覺老舊：缺乏現代設計語言（design tokens, elevation, motion）
5. UX 不足：無載入狀態、錯誤處理粗糙、無障礙支援弱

**專案限制**:

- 不能大規模重寫（需保持功能穩定）
- 需要向下相容（避免破壞現有使用者體驗）
- 團隊熟悉度：Tailwind + Ant Design 為主

## Goals / Non-Goals

### Goals

1. **建立統一的 Design System**：單一來源的 design tokens，支援主題切換
2. **完善深淺色主題**：所有組件正確響應主題，無遺漏
3. **統一 RWD 策略**：標準 breakpoints，mobile-first 設計
4. **提升視覺現代感**：現代排版、間距、陰影、動畫系統
5. **優化使用者體驗**：載入狀態、錯誤處理、微互動、無障礙

### Non-Goals

- ❌ 完全重寫 UI（漸進式改進）
- ❌ 更換 UI 庫（繼續使用 Ant Design）
- ❌ 引入新框架（如 Chakra UI, Mantine）
- ❌ 建立獨立的組件庫專案（在專案內實作即可）
- ❌ 完全移除 CSS Modules（保留用於組件專屬樣式）

## Decisions

### Decision 1: CSS 策略分層

**選擇**: 採用三層架構，明確使用時機

```
Layer 1: Design Tokens (CSS Variables in globals.css)
  ↓ 用於定義顏色、字型、間距等基礎值

Layer 2: Tailwind Utilities (Utility-first for layout/spacing)
  ↓ 用於佈局、間距、響應式、狀態變化

Layer 3: CSS Modules (Component-specific complex styles)
  ↓ 用於組件專屬的複雜樣式、動畫、CSS Grid

Layer 4: Ant Design (UI component library)
  ↓ 用於表單、表格、Modal 等複雜 UI 組件
```

**使用規則**:

- **Tailwind 優先**: 能用 utility class 就不寫 CSS
- **CSS Modules 補充**: 複雜動畫、Grid layout、偽元素等
- **Ant Design 覆寫**: 只在 DynamicAntdTheme 中統一覆寫
- **避免 inline styles**: 除非動態計算必要

**替代方案考慮**:

- ❌ **完全移除 CSS Modules**: 會增加 globals.css 複雜度，難以維護
- ❌ **只用 Tailwind**: 複雜動畫、Grid 會讓 className 過長
- ❌ **CSS-in-JS (Emotion/Styled)**: 與 Tailwind 衝突，且已有 Ant Design 使用

### Decision 2: Design Tokens 實作方式

**選擇**: CSS Variables + Tailwind Theme Extension

```css
/* globals.css */
:root {
  --color-primary-50: #e3f2fd;
  --color-primary-500: #0066aa;
  --color-primary-900: #001529;
  /* ... */
}

[data-theme="light"] {
  --bg-primary: var(--color-gray-50);
  --text-primary: var(--color-gray-900);
}
```

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--color-primary-50)",
          500: "var(--color-primary-500)",
          // ...
        },
        bg: {
          primary: "var(--bg-primary)",
        },
      },
    },
  },
};
```

**理由**:

- ✅ CSS Variables 支援執行時切換（主題動態切換）
- ✅ Tailwind 可直接使用這些 tokens（`bg-primary-500`）
- ✅ Ant Design ConfigProvider 也可讀取 CSS Variables
- ✅ 維護單一來源（globals.css），避免重複定義

**替代方案**:

- ❌ **只用 Tailwind config**: 無法執行時動態切換主題
- ❌ **只用 CSS Variables**: 失去 Tailwind 的 IntelliSense
- ❌ **Design tokens in JSON**: 需要 build-time 處理，過於複雜

### Decision 3: 主題切換實作

**選擇**: Document Attribute + CSS Variables + React Context

```typescript
// 1. Redux state 管理主題模式
themeSlice: { mode: 'dark' | 'light' | 'auto' }

// 2. ThemeProvider 監聽 state，設定 document attribute
useEffect(() => {
  const resolvedTheme = mode === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : mode;

  if (resolvedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}, [mode]);

// 3. CSS 根據 attribute 切換變數
[data-theme="light"] { --bg-primary: white; }
:root { --bg-primary: black; } /* dark as default */
```

**切換動畫**（避免閃爍）:

```typescript
// useThemeTransition.ts
const toggleTheme = () => {
  if (!document.startViewTransition) {
    dispatch(toggleTheme());
    return;
  }

  document.startViewTransition(() => {
    dispatch(toggleTheme());
  });
};
```

**理由**:

- ✅ `data-theme` attribute 語意清晰
- ✅ CSS Variables 自動 cascade 到子元素
- ✅ View Transition API 提供原生動畫（Chrome 111+）
- ✅ Redux 持久化主題偏好（配合 redux-persist）

**替代方案**:

- ❌ **Class toggle (`.dark`)**: 與 Tailwind dark mode 衝突
- ❌ **完全重新渲染**: 會造成閃爍與 state 重置
- ❌ **雙份 CSS bundle**: 增加載入體積

### Decision 4: Breakpoints 標準化

**選擇**: 使用 Tailwind 預設值，全專案統一

```typescript
// lib/constants/breakpoints.ts
export const BREAKPOINTS = {
  sm: 640, // Small devices (large phones)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
  "2xl": 1536,
} as const;

// useMediaQuery hook 提供預設 queries
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${
    BREAKPOINTS.lg - 1
  }px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
} as const;
```

**CSS Modules 中統一使用**:

```css
/* 統一改為 */
@media (max-width: 639px) {
  /* sm - 1 */
}
@media (min-width: 1024px) {
  /* lg */
}

/* 移除舊的 */
@media (max-width: 768px) {
} /* ❌ 不再使用 */
@media (max-width: 480px) {
} /* ❌ 不再使用 */
```

**理由**:

- ✅ 與 Tailwind 保持一致（`sm:`, `md:`, `lg:` utilities）
- ✅ Mobile-first 設計（預設寫 mobile，再用 `sm:` 擴充）
- ✅ 易於維護（單一來源定義）

### Decision 5: 組件更新策略

**選擇**: 漸進式重構，由內而外

**優先順序**:

1. **Global tokens** (globals.css, tailwind.config.ts)
2. **Theme infrastructure** (ThemeProvider, DynamicAntdTheme)
3. **Layout components** (Navigation, ContentWrapper)
4. **Shared UI components** (RadiusBg, UserProfileMenu)
5. **Page-specific components** (BpmDetector, ControlPanel...)
6. **Pages** (home, exercise, workout-report...)

**重構原則**:

- 每次只改一個組件，確保測試通過再改下一個
- 優先改「被多個地方使用」的組件（減少重複工作）
- 保持向下相容（不改變 props interface）
- 加入新的 className，舊的先保留，確認無問題再移除

**測試策略**:

- Visual QA: 在 Chrome DevTools 測試響應式
- Manual testing: 實體手機測試主要流程
- Contrast checking: 確保 WCAG AA 對比度
- Lighthouse: 確保 Performance/Accessibility 分數不下降

## Risks / Trade-offs

### Risk 1: 大規模樣式重構可能引入視覺 regression

**影響**: 可能導致某些頁面排版錯亂、顏色對比不足

**緩解措施**:

- 採用分階段推進，每個階段獨立測試
- 使用 Git branch 保護主分支
- 截圖比對工具（Percy/Chromatic）- 可選
- 充分的 manual QA

**接受度**: 中等風險，可透過充分測試降低

### Risk 2: 主題切換可能造成效能問題

**影響**: 大量 CSS Variables 可能導致主題切換卡頓

**緩解措施**:

- 使用 CSS `transition` 而非 JavaScript 動畫
- 啟用硬體加速 (`will-change`, `transform`)
- 限制同時 transition 的屬性數量
- 使用 `document.startViewTransition` (modern browsers)

**接受度**: 低風險，現代瀏覽器效能足夠

### Risk 3: Ant Design 與自訂主題可能衝突

**影響**: Ant Design 組件可能不完全響應自訂主題

**緩解措施**:

- 在 `DynamicAntdTheme` 中正確覆寫所有需要的 tokens
- 測試所有使用到的 Ant Design 組件
- 必要時使用 CSS Variables 覆寫（透過 `styles` prop 或 CSS Modules）

**接受度**: 低風險，Ant Design 5.x 主題系統已相當完善

### Risk 4: 團隊學習曲線

**影響**: 團隊成員需要理解新的 design system 與使用規範

**緩解措施**:

- 詳細的文件（`docs/css-strategy.md`, `docs/design-system.md`）
- Code review 時檢查是否遵循規範
- 提供範例程式碼與 templates

**接受度**: 中等風險，需投入時間學習

## Trade-offs

### Trade-off 1: 統一性 vs. 彈性

**選擇**: 優先統一性，犧牲部分彈性

- ✅ 所有組件必須使用 design tokens，不可 hardcode 顏色
- ❌ 無法為單一組件客製化完全不同的顏色系統

**理由**: 統一性帶來的長期維護效益大於短期彈性需求

### Trade-off 2: 現代瀏覽器 API vs. 向下相容

**選擇**: 使用現代 API，提供 fallback

- 使用 `document.startViewTransition` 但提供 fallback
- 使用 CSS `container queries` 但提供 media query fallback
- 不支援 IE11（Next.js 14 本身也不支援）

**理由**: 目標使用者主要使用現代行動裝置與 Chrome/Safari

### Trade-off 3: 自動化測試 vs. 手動測試

**選擇**: 主要依賴手動 QA，自動化測試為輔

- 不強制要求 visual regression testing（成本高）
- 依賴 Lighthouse CI + manual testing
- 關鍵邏輯（主題切換）寫單元測試

**理由**: 專案規模不大，手動測試成本可接受

## Migration Plan

### Phase 1: 基礎建設（無破壞性）

1. 建立 design tokens（新增 CSS 變數，舊的保留）
2. 實作主題切換 UI（純新增功能）
3. 更新文件

**Rollback**: 移除新的 CSS 變數與主題切換 UI 即可

### Phase 2: 主題系統（漸進式）

1. 逐一更新組件使用 CSS 變數
2. 保留舊的 hardcoded styles 作為 fallback
3. 確認無問題後移除舊 styles

**Rollback**: Git revert 個別 commit

### Phase 3: RWD 優化（低風險）

1. 統一 breakpoints（只是數值調整）
2. 測試關鍵頁面響應式
3. 微調排版

**Rollback**: 調整回舊的 breakpoint 值

### Phase 4-5: 視覺與 UX（純新增）

1. 加入新的動畫、陰影、間距
2. 不移除舊的樣式，只疊加新的
3. 逐步替換

**Rollback**: 移除新加入的 classes

### 總體 Rollback 策略

- 使用 feature branch 開發
- 每個 phase 獨立 PR，易於 revert
- 保留舊程式碼一段時間再清理
- 監控 error tracking (Sentry) 與使用者回饋

## Open Questions

### Q1: 是否需要建立 Storybook？

**考量**: 可提供組件視覺化文件，但增加維護成本
**建議**: Phase 1 先不做，等 design system 穩定後再評估

### Q2: 是否需要支援 RTL (Right-to-Left)?

**考量**: 目前使用者主要為繁體中文，暫無國際化需求
**建議**: 先不支援，CSS 設計時預留彈性（避免使用 `left`/`right`，改用 `start`/`end`）

### Q3: 是否需要支援多主題（不只 dark/light）？

**考量**: 可能未來想要「夜間模式」「護眼模式」等
**建議**: Design tokens 架構支援，但先只實作 dark/light

### Q4: Material-UI 的未來？

**考量**: 專案中有少量 MUI 組件，但主要用 Ant Design
**建議**: 逐步移除 MUI，統一使用 Ant Design（減少 bundle size）

### Q5: CSS Modules vs. Tailwind 的界線在哪？

**考量**: 團隊成員可能有不同習慣
**建議**: 在 `docs/css-strategy.md` 中明確定義，Code review 時檢查

---

## 總結

這個設計選擇了「**漸進式、低風險、向下相容**」的路線：

- 不重寫，只優化
- 新舊並存，逐步替換
- 充分測試，隨時可 rollback
- 詳細文件，降低學習成本

預期能在 3-4 週內完成，且不影響現有功能穩定性。
