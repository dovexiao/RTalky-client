# RTalky

一个基于 React Native 的移动应用（iOS/Android）。


## 启动与初始化流程

- 锁定竖屏 → BootSplash 显示 → 会话预检 → 并行校验会话与拉取用户信息 → 更新用户信息 → 设置登录状态 → 决定初始路由 → 隐藏 BootSplash

注记：
- 锁屏：react-native-orientation-locker
- 启动页：react-native-bootsplash
- 路由：React Navigation（初始路由受上述流程决定）
- 主题设置：由 SystemWatcher 在导航重置时统一处理，应用初始化阶段不直接设置主题


## Provider 装配结构

- UnifiedThemeProvider → ApplicationProvider(themeColors) → GlobalProvider → AppNavigator

说明：
- UnifiedThemeProvider：统一主题上下文容器（主题类型、系统跟随、颜色映射的来源，详细见“主题”章节）
- ApplicationProvider(themeColors)：UI Kitten / Eva 的主题注入点（以 themeColors 驱动组件库样式）
- GlobalProvider：全局交互容器（如全局对话框、底部操作等的上下文）
- AppNavigator：导航根出口（路由栈与初始路由）


## UI 与主题

- UI 基座：UI Kitten（@ui-kitten/components）与 Eva 设计体系（@eva-design/eva）。
- 主题来源：`UnifiedThemeContext` 合并 Eva 基础主题与自定义 special 主题，导出 `themeColors`。
- 使用方式：根组件将 `themeColors` 注入 `ApplicationProvider`，全局生效。
- 能力概览：主题切换、预览模式、跟随系统、登出重置（详见 `docs/UnifiedThemeContext.md`）。


## 全局组件与交互

- 全局容器：`GlobalContext` 提供命令式 API 的 ref（`actionDialogRef`、`bottomActionSheetRef`），并在根部挂载三个全局组件。
- 全局对话框：`ActionDialog` 居中模态框，支持自定义内容、滚动、按钮回调；Reanimated 淡入+缩放动画。
- 底部操作栏：`BottomActionSheet` 自底部滑入的操作面板，内容由调用方传入；Reanimated 位移动画。
- 全局提示：`ReactiveToastContainer` 状态驱动的提示系统，根据消息类型决定位置与自动关闭；支持 loading、offline/online、success/warning 等类型。
- 层级管理：全局组件使用绝对定位与高 `zIndex`，确保始终覆盖业务页面（详见 `docs/GlobalComponents.md` 与 `docs/ReactiveToast.md`）。


## 导航与会话

- 导航结构：`AppNavigation` 使用原生栈导航，动态初始路由通过 `useNavigationStore` 管理，默认 `VerificationLogin`。
- 系统监听：`SystemWatcher` 监听登录状态与网络状态，网络断开30秒后自动重置路由，负责登录状态变更引起的主题设置变更。
- 路由管理：完整的 TypeScript 类型定义，支持认证、主应用、笔记、个人中心等模块路由。
- 外部控制：通过 `navigationRef` 提供外部导航控制能力，支持路由重置和状态管理（详见 `docs/Navigation.md`）。


## 网络与数据

- 请求封装：基于 Axios 的统一 HTTP 请求封装，支持 GET/POST/PUT/DELETE 方法，提供类型安全的泛型支持。
- 自动认证：请求拦截器自动添加 Bearer Token，401 错误时自动清理认证状态并重置路由。
- 错误处理：统一的错误响应格式，分类处理服务器错误、网络错误、请求配置错误。
- 请求管理：支持请求取消机制，401 处理时自动取消所有进行中的请求（详见 `docs/NetworkServices.md`）。


## 认证与用户

- 启用短信验证登录。登录成功后写入用户资料与登录态；主题应用不在登录回调执行，由 `SystemWatcher` 在路由重置阶段统一处理。
- 详见：`docs/Auth.md`


## 功能模块说明

- Main（工作台）
  - 登录后的主入口；顶部头像栏 + 功能入口卡片；右滑或点头像打开个人中心侧边栏。
  - 详见：`docs/Main.md`
- Center（个人中心）
  - 个人资料（头像/昵称/简介）、背景设置（主题预览与应用）、关于/协议/权限等信息页。
  - 详见：`docs/Center.md`
- Note（笔记）
  - 列表/新增/编辑概述；阅读器是核心（横向分页 + Markdown 渲染），支持按钮/手势/倾斜翻页，含解锁门槛。
  - 详见：`docs/Note.md`（内含 `docs/TiltObserver.md` 与 `docs/ShakeUnlockButton.md` 链接）。


## 配置与约定


## 资源与媒体

- 图片与缓存策略：详见 `docs/ImageCache.md`
- Markdown 渲染与限制：基于 `MarkdownRenderer` 的样式与图片规则


## 权限与设备

- 权限统一封装：详见 `docs/usePermission.md`
- 设备信息与方向锁定：`DeviceInfoManager`、`react-native-orientation-locker`


## 可测试性与质量


## 构建与发布


## 故障排查


## 路线图与待办
