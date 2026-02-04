# 組件庫指南

## 簡介

本文檔提供所有通用 UI 組件的使用指南。這些組件遵循設計系統規範，確保整個應用的一致性和可維護性。

## 導入組件

```tsx
import {
  Skeleton,
  Spinner,
  ErrorState,
  EmptyState,
} from "@/app/components/UIComponents";
```

## 骨架屏組件 (Skeleton)

用於載入狀態下的佔位符顯示。

### 基本使用

```tsx
import Skeleton from "@/app/components/Skeleton";

// 文字骨架
<Skeleton type="text" count={3} active />

// 頭像骨架
<Skeleton type="avatar" />

// 圖片骨架
<Skeleton type="image" />

// 按鈕骨架
<Skeleton type="button" />

// 卡片骨架
<Skeleton type="card" />

// 輸入框骨架
<Skeleton type="input" />
```

### Props

| 屬性      | 類型                                                           | 預設值 | 描述                       |
| --------- | -------------------------------------------------------------- | ------ | -------------------------- |
| type      | 'text' \| 'avatar' \| 'image' \| 'button' \| 'card' \| 'input' | 'text' | 骨架類型                   |
| count     | number                                                         | 1      | 顯示數量（僅對 text 有效） |
| active    | boolean                                                        | true   | 是否顯示動畫               |
| className | string                                                         | -      | 自訂 className             |

## 加載指示器 (Spinner)

用於表示正在載入或處理中。

### 基本使用

```tsx
import Spinner from "@/app/components/Spinner";

// Inline 版本
<Spinner size="default" tip="載入中..." />

// Fullscreen 版本
<Spinner fullscreen size="large" tip="正在處理..." />

// 小型指示器
<Spinner size="small" />
```

### Props

| 屬性       | 類型                            | 預設值      | 描述           |
| ---------- | ------------------------------- | ----------- | -------------- |
| size       | 'small' \| 'default' \| 'large' | 'default'   | 大小           |
| fullscreen | boolean                         | false       | 是否全屏顯示   |
| tip        | string                          | '載入中...' | 提示文字       |
| className  | string                          | -           | 自訂 className |
| style      | CSSProperties                   | -           | 自訂樣式       |

### 使用場景

```tsx
// 頁面載入
const [loading, setLoading] = useState(false);

return (
  <>
    {loading && <Spinner fullscreen tip="正在載入資料..." />}
    <ContentComponent />
  </>
);
```

## 空狀態組件 (EmptyState)

用於顯示沒有資料或無結果的情況。

### 基本使用

```tsx
import EmptyState from "@/app/components/EmptyState";

// 基本空狀態
<EmptyState
  title="沒有訓練記錄"
  description="開始您的第一次訓練吧！"
/>

// 帶操作按鈕
<EmptyState
  title="沒有資料"
  description="還沒有任何資料"
  action={{
    label: "建立新項目",
    onClick: () => router.push("/create"),
  }}
/>

// 多個操作按鈕
<EmptyState
  title="沒有結果"
  description="搜尋無結果"
  action={[
    { label: "清除篩選", onClick: handleClear },
    { label: "返回首頁", onClick: handleHome },
  ]}
/>
```

### Props

| 屬性        | 類型               | 預設值                 | 描述           |
| ----------- | ------------------ | ---------------------- | -------------- |
| title       | string             | '沒有資料'             | 標題           |
| description | string             | '目前沒有可顯示的內容' | 描述文字       |
| icon        | ReactNode          | -                      | 自訂圖示       |
| action      | Action \| Action[] | -                      | 操作按鈕       |
| className   | string             | -                      | 自訂 className |

## 錯誤狀態組件 (ErrorState)

用於顯示友善的錯誤訊息。

### 基本使用

```tsx
import ErrorState from "@/app/components/ErrorState";

// 基本錯誤
<ErrorState message="無法載入資料" />

// 帶重試按鈕
<ErrorState
  title="載入失敗"
  message="無法連接到伺服器"
  onRetry={handleRetry}
/>

// 詳細錯誤
<ErrorState
  title="錯誤"
  message="操作失敗"
  details={errorStack}
  type="error"
  onClose={handleClose}
/>

// 警告
<ErrorState
  type="warning"
  message="此操作無法撤銷"
/>

// 訊息
<ErrorState
  type="info"
  message="系統正在維護中"
/>
```

### Props

| 屬性      | 類型                           | 預設值     | 描述             |
| --------- | ------------------------------ | ---------- | ---------------- |
| title     | string                         | '出現錯誤' | 標題             |
| message   | string                         | -          | 錯誤訊息（必須） |
| type      | 'error' \| 'warning' \| 'info' | 'error'    | 錯誤類型         |
| details   | string                         | -          | 詳細錯誤信息     |
| onRetry   | () => void                     | -          | 重試回調         |
| onClose   | () => void                     | -          | 關閉回調         |
| className | string                         | -          | 自訂 className   |

## 整合示例

### 表單載入到成功流程

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  setError(null);
  try {
    await submitForm(data);
    setSuccess(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {loading && <Spinner tip="正在提交..." />}
    {error && (
      <ErrorState
        message={error}
        onRetry={() => handleSubmit(data)}
        onClose={() => setError(null)}
      />
    )}
    {success && (
      <div className="text-center text-green-600">
        <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
        <p>提交成功！</p>
      </div>
    )}
    <Form onSubmit={handleSubmit} />
  </>
);
```

### 列表載入流程

```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.fetchList();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

return (
  <>
    {loading && <Skeleton type="card" count={3} />}
    {error && <ErrorState message="載入失敗" onRetry={fetchData} />}
    {!loading && data.length === 0 && <EmptyState title="沒有項目" />}
    {data.map((item) => (
      <Card key={item.id}>{item.name}</Card>
    ))}
  </>
);
```

## 主題適配

所有組件自動適配深色/亮色主題，無需額外配置：

```tsx
// 自動使用主題色彩
<ErrorState message="錯誤訊息會自動使用合適的顏色" />

// 在深色模式下
// - 背景：暗色背景
// - 文字：淡色文字
// - 邊框：淺色邊框

// 在亮色模式下
// - 背景：淺色背景
// - 文字：深色文字
// - 邊框：深色邊框
```

## 響應式支援

所有組件都支援響應式設計，在各種螢幕尺寸上都能正常顯示。

## 最佳實踐

1. **適當選擇狀態組件**

   - 加載中 → 使用 `Skeleton` 或 `Spinner`
   - 無資料 → 使用 `EmptyState`
   - 操作失敗 → 使用 `ErrorState`

2. **提供有用的訊息**

   - 不要只顯示錯誤代碼
   - 提供可採取的行動（重試、返回等）
   - 必要時提供詳細信息

3. **保持一致性**
   - 使用統一的組件樣式
   - 遵循設計系統規範
   - 不要過度自訂樣式

## 進階用法

### 自訂骨架屏

```tsx
<div className="space-y-4">
  <Skeleton type="avatar" />
  <Skeleton type="text" count={2} />
  <Skeleton type="button" />
</div>
```

### 條件渲染

```tsx
{
  loading ? (
    <Spinner />
  ) : error ? (
    <ErrorState message={error} onRetry={refetch} />
  ) : data.length === 0 ? (
    <EmptyState action={{ label: "建立", onClick: create }} />
  ) : (
    <DataList data={data} />
  );
}
```
