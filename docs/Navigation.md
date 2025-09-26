# 导航模块

位置：`src/navigation/`

导航模块负责整个应用的路由管理、状态监听和系统级导航控制，包含动态初始路由、登录状态监听、网络状态监控等功能。

## 模块结构

```
src/navigation/
├── AppNavigation.tsx          # 导航栈定义与配置
├── navigationRef.ts           # 导航容器引用
├── SystemWatcher.tsx          # 系统状态监听器
├── stores/
│   ├── index.ts              # 导出文件
│   └── navigationStore.ts    # 导航状态管理（Zustand）
└── types/
    └── index.ts              # 路由参数类型定义
```

## 核心组件

### AppNavigation.tsx（导航根组件）
- **职责**：定义整个应用的导航栈结构
- **技术栈**：`@react-navigation/native` + `createNativeStackNavigator`
- **特点**：
  - 动态初始路由：通过 `useNavigationStore.getState().initialRouteName` 获取
  - 全局配置：所有屏幕隐藏默认头部（`headerShown: false`）
  - 模块化路由：认证、主应用、笔记、个人中心、关于等模块
- **路由结构**：
  - 认证流程：`OneTapLogin`、`VerificationLogin`、`VerificationCode`、`PasswordLogin`
  - 主应用：`AppMain`
  - 笔记模块：`NoteLibrary`、`NoteReader`、`AddNoteCover`、`AddNoteContent`、`CreateNoteTag`、`EditNote`
  - 个人中心：`PersonCenter`、`BackgroundSettings`
  - 关于模块：`UserAgreement`、`PrivacyPolicy`、`AppPermissions`、`OpenSourceLicense`、`AboutRTalky`
  - 测试页面：`TestPage`

### SystemWatcher.tsx（系统状态监听器）
- **职责**：监听登录状态和网络状态变化，执行相应的导航重置与主题管理
- **监听内容**：
  - 登录状态变化（`useAuthStore.isLoggedIn`）
  - 网络状态变化（`@react-native-community/netinfo`）
- **核心功能**：
  - **离线策略**：网络断开30秒后自动重置路由
  - **主题管理**：负责登录状态变更引起的主题设置变更
    - 登出时：调用 `resetThemeToDefault()`（浅色主题，不跟随系统）
    - 登录时：根据用户 `theme` 偏好设置主题（`DARK`/`LIGHT`/`SYSTEM`）
  - **Toast 通知**：网络状态变化时显示相应提示
  - **幂等保护**：使用 `hasRedirectedRef` 防止重复跳转
- **网络状态处理**：
  - 网络断开：显示离线提示，启动30秒计时器
  - 网络恢复：清除计时器，显示恢复提示
  - 状态记忆：使用 `prevIsOnlineRef` 准确判断状态变化
- **设计原则**：
  - 应用初始化、登录、登出等操作只修改登录状态
  - 登录状态变更引起的主题设置变更由 `SystemWatcher` 在导航重置时处理
  - 避免 Store 与 Context 之间的相互依赖

### navigationStore.ts（导航状态管理）
- **技术栈**：Zustand
- **状态**：
  - `initialRouteName`：初始路由名称
- **方法**：
  - `setInitialRouteName(routeName)`：设置初始路由
  - `resetInitialRouteName()`：重置为默认路由
- **默认值**：`'VerificationLogin'`

### navigationRef.ts（导航引用）
- **职责**：提供导航容器的引用，用于外部控制导航
- **用途**：在 `SystemWatcher` 中执行 `CommonActions.reset` 重置路由

### types/index.ts（类型定义）
- **RootStackParamList**：定义所有路由的参数类型
- **类型安全**：完整的 TypeScript 支持，确保路由参数类型正确

## 设计特点

### 1. 状态驱动
- 通过 Zustand store 管理导航状态
- 动态初始路由支持登录后切换

### 2. 系统感知
- 同时监听登录和网络状态
- 自动处理异常情况（网络断开、登录失效）

### 3. 容错机制
- 网络断开时的超时重置策略
- 幂等性保护防止重复操作

### 4. 类型安全
- 完整的 TypeScript 类型定义
- 路由参数类型检查

### 5. 模块化设计
- 清晰的职责分离
- 可扩展的路由结构

## 使用方式

### 设置初始路由
```typescript
import { useNavigationStore } from '@navigation/stores';

// 设置初始路由
useNavigationStore.getState().setInitialRouteName('AppMain');

// 重置为默认路由
useNavigationStore.getState().resetInitialRouteName();
```

### 外部导航控制
```typescript
import { navigationRef } from '@navigation/navigationRef';
import { CommonActions } from '@react-navigation/native';

// 重置导航栈
navigationRef.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'VerificationLogin' }],
  })
);
```

## 注意事项

1. **模块注释**：部分功能模块（题目相关、回收站）在导航栈中被注释，但类型定义仍保留
2. **BootSplash**：启动页相关代码被注释，需要时可按启动流程接回
3. **类型定义**：`types/index.ts` 中的 `MessageType` 可考虑迁移到 toast 模块，保持类型定义的领域纯净性
4. **初始路由**：`AppStackNavigator` 使用 `getState()` 获取初始路由，运行时切换不会自动更新已挂载的 Navigator

## 扩展建议

1. **路由守卫**：可考虑添加路由权限控制
2. **深度链接**：支持 URL 路由和参数传递
3. **导航动画**：自定义页面切换动画
4. **路由缓存**：优化页面加载性能

