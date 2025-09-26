# 网络请求服务

位置：`src/services/`

网络请求服务模块提供统一的 HTTP 请求封装，包含自动认证、错误处理、请求取消等功能，基于 Axios 实现。

## 模块结构

```
src/services/
└── fetch/
    ├── axios.ts           # Axios 实例配置和拦截器
    ├── request.ts         # 请求方法封装
    └── types/
        └── axios.d.ts     # Axios 类型扩展
```

## 核心组件

### axios.ts（Axios 实例配置）
- **职责**：配置 Axios 实例，处理请求/响应拦截器
- **基础配置**：
  - 使用 `react-native-config` 获取 `API_URL`
  - 设置 10 秒超时时间
  - 自动添加 Authorization Bearer Token

- **请求拦截器**：
  - 自动从 `UserAuthManager` 获取当前用户 Token
  - 为每个请求生成唯一 ID 和取消令牌
  - 存储进行中的请求到 `pendingRequests` Map
  - 输出请求信息日志

- **响应拦截器**：
  - **成功响应**：清理请求 ID 和取消令牌
  - **401 错误处理**：
    - 幂等性保护（`isHandling401` 锁机制）
    - 取消所有进行中的请求
    - 清理认证信息（`UserAuthManager.deleteCurrentUserComplete()`）
    - 重置导航状态（`resetInitialRouteName()`）
    - 清理认证状态（`setIsLoggedIn(false)`、`setUserId('')`）

### request.ts（请求方法封装）
- **职责**：封装 HTTP 请求方法，提供统一的错误处理
- **支持方法**：
  - `get<T>(url, config?)` - GET 请求
  - `post<T>(url, data?, config?)` - POST 请求
  - `put<T>(url, data?, config?)` - PUT 请求
  - `del<T>(url, config?)` - DELETE 请求

- **类型安全**：支持泛型 `<T>` 返回类型
- **统一错误处理**：`handleApiError` 函数处理不同类型的错误
- **错误分类**：
  - **服务器错误**（4xx, 5xx）：返回状态码和错误信息
  - **网络错误**：无响应时返回 503 状态码
  - **请求配置错误**：返回 400 状态码

### types/axios.d.ts（类型扩展）
- **职责**：扩展 Axios 类型定义
- **扩展内容**：为 `InternalAxiosRequestConfig` 添加 `requestId` 属性

## 设计特点

### 1. 自动认证
- 请求拦截器自动从 `UserAuthManager` 获取 Token
- 自动添加 `Authorization: Bearer <token>` 头部

### 2. 请求取消机制
- 为每个请求生成唯一 ID 和取消令牌
- 支持取消所有进行中的请求
- 401 错误时自动取消所有请求

### 3. 401 处理策略
- 幂等性保护：使用 `isHandling401` 锁防止重复处理
- 完整清理：删除认证信息、重置导航、清理状态
- 自动重定向：重置初始路由为 `VerificationLogin`

### 4. 类型安全
- 完整的 TypeScript 支持
- 泛型返回类型
- 扩展 Axios 类型定义

### 5. 统一错误处理
- 标准化的错误响应格式
- 分类处理不同类型的错误
- 详细的错误信息

## 使用方式

### 基本请求
```typescript
import { get, post, put, del } from '@/services/fetch/request';

// GET 请求
const userData = await get<UserData>('/api/user/profile');

// POST 请求
const result = await post<CreateResult>('/api/notes', { 
  title: 'New Note',
  content: 'Note content' 
});

// PUT 请求
const updated = await put<UpdateResult>('/api/notes/123', { 
  title: 'Updated Note' 
});

// DELETE 请求
await del('/api/notes/123');
```

### 错误处理
```typescript
try {
  const data = await get<UserData>('/api/user/profile');
  console.log('用户数据:', data);
} catch (error) {
  // error 是 ApiResponse<never> 格式
  console.log('请求失败:', error.success); // false
  console.log('错误信息:', error.message);  // 具体错误信息
  console.log('错误码:', error.code);       // HTTP 状态码
}
```

### 带配置的请求
```typescript
// 带自定义配置的请求
const data = await get<UserData>('/api/user/profile', {
  timeout: 5000,
  headers: {
    'Custom-Header': 'value'
  }
});
```

## 错误响应格式

```typescript
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  code?: number;
};
```

### 错误类型示例
- **服务器错误**：`{ success: false, message: "服务器错误: 500", code: 500 }`
- **网络错误**：`{ success: false, message: "网络错误: 服务器无响应", code: 503 }`
- **请求错误**：`{ success: false, message: "请求错误: 配置错误", code: 400 }`

## 配置说明

### 环境变量
- `API_URL`：API 基础地址（通过 `react-native-config` 获取）

### 超时设置
- 默认超时：10 秒
- 可在请求配置中覆盖

### 认证机制
- 自动从 `UserAuthManager` 获取 Token
- 401 错误时自动清理认证状态

## 注意事项

1. **Token 管理**：依赖 `UserAuthManager` 进行 Token 存储和获取
2. **状态清理**：401 错误时会清理认证状态和导航状态
3. **请求取消**：组件卸载时建议取消进行中的请求
4. **错误处理**：建议在业务层统一处理错误响应
5. **日志输出**：开发环境下会输出详细的请求/响应日志

## 扩展建议

1. **重试机制**：可添加网络错误时的自动重试
2. **缓存策略**：可添加请求结果缓存
3. **离线支持**：可添加离线请求队列
4. **请求去重**：可添加相同请求的去重机制
5. **性能监控**：可添加请求性能统计

