# 认证（Auth）模块

位置：`src/auth/`

本模块当前启用“短信验证码登录”（Verification Login）。历史上预留了密码登录与一键登录形态，`services/` 与 `stores/` 为三者共享，UI 仅对 `verificationLogin` 生效。

## 目录结构（相关）
```
src/auth/
├── verificationLogin/          # 短信验证登录 UI
│   ├── screens/
│   │   ├── VerificationLogin.tsx     # 输入手机号并发送短信
│   │   └── VerificationCode.tsx      # 输入验证码登录
│   ├── components/                    # 手机号输入、验证码输入、区号选择等复用组件
│   ├── stores/                        # 验证登录局部 store（表单/弹窗访问）
│   └── utils/                         # 设备信息、国家区号等工具
├── services/                   # 共享服务
│   ├── smsService.ts           # 发送短信验证码
│   ├── loginService.ts         # 登录（携带设备信息，支持多种登录方式）
│   ├── sessionService.ts       # 会话校验/退出
│   └── userInfoService.ts      # 用户信息获取/更新
└── stores/
    └── auth.store.ts           # 认证全局状态（Zustand）
```

## 用户流（短信验证码登录）
1) 进入 `VerificationLogin`：输入手机号，勾选协议 → 发送验证码（`SmsService.sendSmsCode`）。
2) 跳转 `VerificationCode`：输入验证码 → 触发登录（调用封装在 zustand 的方法，内部从 store 读取最新表单状态）。
3) 登录成功后：
   - 拉取用户信息（`UserInfoService.getUserInfo`）并写入 AuthStore：`userId`、`nickname`、`avatar`（本地化路径由上层处理）、`bio`、`theme`。
   - 更新登录态 `isLoggedIn = true`（触发导航观察者）。

> 注：主题应用不在登录回调内直接处理，由系统观察者（`SystemWatcher`）在“登录状态变化/重置路由”阶段统一决定：退出登录 → 重置为默认主题；登录成功 → 可按用户 `theme` 应用（或沿用现有策略）。

## UI 层要点
- `VerificationLogin.tsx`
  - `PhoneInput`：手机号输入 + 国家区号选择弹窗（`CountryCodeDialog`）。
  - `AgreementCheckbox`：协议勾选状态参与发送短信/登录的请求体。
  - `VerifyLoginButton`：触发发送短信。
- `VerificationCode.tsx`
  - `VerificationCodeInput`：验证码输入框（封装 `react-native-confirmation-code-field`）。
  - `ResendTimer`：重发倒计时。
  - `NoVerificationCodeHelper`：帮助面板（通过 `BottomActionSheet` 展示）。

## 关键组件与工具
- **国家区号选择**：`CountryCodeDialog` 及其组件树（详见 [CountryCodeDialog.md](./CountryCodeDialog.md)）
  - 包含分组列表、字母导航、悬浮提示等完整交互
  - 数据来源：`CountryManager`（详见 [CountryManager.md](./CountryManager.md)）
- **验证码输入**：`VerificationCodeInput`（详见 [VerificationCodeInput.md](./VerificationCodeInput.md)）
  - 封装第三方库，提供统一的样式与行为配置
- **设备信息收集**：`DeviceInfoManager` + `DeviceInfoUtils`（详见 [DeviceInfo.md](./DeviceInfo.md)）
  - 收集设备指纹用于风控与追踪
- **头像缓存管理**：`ImageCache`（详见 [ImageCache.md](./ImageCache.md)）
  - 处理用户头像的本地缓存与清理

## 服务层（Services）
- `SmsService.sendSmsCode(phoneNumber, agreedToTerms)`
  - 接口：`POST /auth/sms-code`
  - 载荷：手机号、设备信息（`DeviceInfoManager` + `DeviceInfoUtils`）、协议勾选状态。
- `LoginService.smsLogin(phoneNumber, smsCode, agreedToTerms)`
  - 接口：`POST /auth/sms-login`
  - 载荷：手机号、验证码、设备信息、协议勾选。
  - 响应：`LoginData`（包含 `userId`、`sessionToken`、`userProfile` 等，其中 `userProfile.theme` 为 `DARK | LIGHT | SYSTEM`）。
- `SessionService.validateSession()` / `logoutSession()`
  - 会话校验与登出。校验成功后由上层初始化流程决定初始路由与用户资料恢复。
- `UserInfoService.getUserInfo()` / `updateUserInfo()`
  - 用户资料的读取与更新（昵称、简介、头像、主题）。

> Axios 拦截器（`src/services/fetch/axios.ts`）统一注入 token；401 时取消请求、清理认证、重置初始路由。

## 状态层（Stores）
### 全局认证状态（AuthStore）
- 位置：`src/auth/stores/auth.store.ts`
- 类型：
  - `UserTheme = 'DARK' | 'LIGHT' | 'SYSTEM'`
  - `UserProfile = { nickname; avatar; bio; theme: UserTheme | null }`
- 状态字段：`isLoggedIn`、`userId`、`nickname`、`avatar`、`bio`、`theme: UserTheme | null`
- 方法：
  - `setIsLoggedIn`、`setUserId`、`setNickname`、`setAvatar`、`setBio`、`setTheme`
  - `setUserProfile(profile)`：批量写入昵称/头像/简介/主题
  - `handleLogin(userId, profile)`：更新 `userId` 与用户资料（`theme` 包含在内）

### 验证登录局部状态
- `verificationLoginStore.ts`：管理手机号、验证码、协议勾选等表单状态
- `countryCodeSelectorStore.ts`：管理国家区号选择器的数据与交互状态

## 主题与导航协同
- 主题不在登录回调里直接下发，避免在 Store 与 Context 之间相互依赖。
- 统一由 `SystemWatcher` 在以下时机处理：
  - 退出登录：`resetThemeToDefault()`（浅色、不跟随系统）。
  - 登录成功：可读取 `useAuthStore.getState().theme` 并据此决定是否 `setTheme('light'|'dark')` 或 `setAutoSwitch(true)`（根据产品策略）。

## 约定与注意
- **请求统一**：登录动作由 zustand 内方法发起，组件通过 store 触发，store 内部使用 `getState()` 读取最新表单/勾选状态。
- **设备信息**：发送短信与登录均附加设备指纹（用于后端风控/追踪）；请注意隐私合规。
- **头像本地化**：上层（App 初始化流程）通过 `ImageCache` 将远程头像落盘，再写回 `avatar`。
- **错误处理**：网络错误/401 由拦截器统一清理与路由重置；UI 侧通过全局 `ReactiveToast` 提示文案。

## 后续扩展
- 支持密码登录与一键登录的 UI 与流程复用（沿用并拓展当前 `services/stores`）。
- 支持主流的第三方登录方式（如微信、微博、GitHub 等），通过 `LoginService` 统一处理。
