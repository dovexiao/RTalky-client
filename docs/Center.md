# Center 模块

位置：`src/center/`

Center 模块聚合“个人中心”“背景设置（主题预览与应用）”与“关于/协议/权限”等信息页面，作为工作台（Main）侧边栏弹出的主要功能集合。

## 模块结构

```
src/center/
├── personCenter/           # 个人中心（侧边栏内容）
│   ├── components/         # 资料、设置、关于等分区
│   └── screens/PersonCenter.tsx
├── backgroundSettings/     # 背景与主题设置（含预览模式）
│   ├── components/
│   └── screens/BackgroundSettings.tsx
└── about/                  # 关于/协议/许可/权限
    ├── components/
    └── screens/ (AboutRTalky, PrivacyPolicy, UserAgreement, AppPermissions, OpenSourceLicense)
```

## PersonCenter（个人中心）
- 入口：在 Main 的侧边栏中展示（`SwipeSidebar` 内部渲染）
- 屏幕：`personCenter/screens/PersonCenter.tsx`
- 组成：
  - `ProfileSection`：头像/昵称/简介展示与头像操作弹窗（`AvatarActionsModal`）
  - `GeneralSettingsSection`：通用设置入口（如主题设置）
  - `AboutRTalkySection`：关于页面入口
  - `OtherSection`：其他条目
- 动效：
  - 顶部资料区随纵向滚动透明度渐隐；滚动一定距离后显现置顶 TopNavigation（Reanimated）
- 主题：遵循全局主题（`UnifiedThemeContext`）

## BackgroundSettings（背景与主题设置）
- 屏幕：`backgroundSettings/screens/BackgroundSettings.tsx`
- 预览模式：
  - 进入页面：`setPreviewMode(true)`，展示 `ThemePreview`（light/dark）
  - 离开/取消：`cancelPreviewTheme()` 恢复原主题
- 应用主题：
  - 确认时：
    - 推送至后端：`UserInfoService.updateUserInfo({ theme: 'LIGHT'|'DARK'|'SYSTEM' })`
    - 本地应用：`applyPreviewTheme()`，并导航返回
  - 文案反馈：通过全局消息（ReactiveToast）提示成功/失败
- 说明：登录状态改变引起的主题统一由 `SystemWatcher` 在导航重置时处理；本页仅负责用户主动的主题配置与预览

## About 与协议/权限
- 屏幕：`about/screens/*`
- `AboutRTalky`：应用信息、开源地址、联系邮箱（使用 `Linking` 打开 URL/Email）
- `PrivacyPolicy`/`UserAgreement`/`OpenSourceLicense`/`AppPermissions`：文本信息展示页
- 主题：遵循全局主题映射

## 与其他模块的关系
- Main：作为 `SwipeSidebar` 的内容出现（点击头像或右滑开启）
- Auth：`BackgroundSettings` 提交主题偏好至用户资料，登录状态变更后的实际主题应用交由 `SystemWatcher` 处理
- Global：头像操作弹窗等命令式 UI 通过 `GlobalContext` 管理

## 扩展建议
- 资料编辑页面细化（昵称/简介独立屏）
- 主题预览扩展（更多色板、自定义强调色）
- 关于页加入更新日志/检查更新
