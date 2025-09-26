# UnifiedThemeContext（主题模块）

本模块统一管理应用主题，整合 UI Kitten/Eva 基础主题与自定义 special 主题，向全局暴露合并后的颜色表与主题控制 API，并支持“预览模式”“跟随系统”“退出登录重置”场景。

## 目标与职责
- 统一主题色源：合并 Eva 基础主题与自定义 `light/dark-*-theme.json`。
- 提供一致的主题上下文（`theme`, `themeColors`）。
- 支持预览模式（`previewTheme`）。
- 支持跟随系统深浅色（基于 `Appearance` 监听）。
- 退出登录时恢复默认：浅色 + 不跟随系统。
- 保留向后兼容 API（逐步迁移）。

## 核心数据流
- 状态
  - `currentTheme: 'light'|'dark'`
  - `autoSwitch: boolean`（是否跟随系统）
  - 预览相关：`isPreviewMode`, `previewTheme`, `previewAutoSwitch`
- 派生
  - `effectiveTheme`: 预览中使用 `previewTheme`，否则用 `currentTheme`
  - `uiKittenTheme`: `eva[effectiveTheme]` + `light/dark-theme.json`
  - `specialThemeColors`: `light/dark-special-theme.json`
  - `themeColors`: `{...uiKittenTheme, ...specialThemeColors}`（自定义覆盖）

## 对外 API（`useUnifiedTheme`）
- 读取
  - `theme`: 当前有效主题（考虑预览）
  - `themeColors`: 合并后的颜色表（供 UI Kitten `ApplicationProvider` 使用）
  - `autoSwitch`, `isPreviewMode`, `previewTheme`, `previewAutoSwitch`
- 操作
  - `setTheme(theme)` / `toggleTheme()`
  - `setAutoSwitch(enabled)`（真实状态）
  - 预览流：`setPreviewMode(enabled)`, `setPreviewTheme(theme)`, `handleAutoSwitch(enabled)`, `applyPreviewTheme()`, `cancelPreviewTheme()`
  - 退出登录重置：`resetThemeToDefault()`（浅色 + 不跟随系统）
- 向后兼容（不建议新代码使用）
  - `specialTheme`, `specialThemeColors`, `uiKittenTheme`
  - `toggleSpecialTheme()`, `setSpecialTheme(theme)`

## 典型用法

```tsx
// 根组件主题注入
<ApplicationProvider {...eva} theme={themeColors}>
  {children}
</ApplicationProvider>
```

```tsx
// 设置页：预览 → 确认/取消
const {
  isPreviewMode,
  previewTheme,
  setPreviewMode,
  setPreviewTheme,
  applyPreviewTheme,
  cancelPreviewTheme,
  handleAutoSwitch,
} = useUnifiedTheme();

// 进入预览并选择
setPreviewMode(true);
setPreviewTheme('dark');
handleAutoSwitch(false);

// 用户确认
applyPreviewTheme();
// 或者取消
cancelPreviewTheme();
```

```tsx
// 退出登录：恢复初始体验
const { resetThemeToDefault } = useUnifiedTheme();
resetThemeToDefault();
```

## 跟随系统
- 初始化时读取 `Appearance.getColorScheme()`；
- 挂载时注册 `Appearance.addChangeListener`；
- 仅当 `autoSwitch === true` 时同步 `currentTheme` 为系统色系。

> 注意：监听 `useEffect` 当前实现挂载时注册一次，若运行时频繁切换 `autoSwitch`，可根据需求将依赖项调整为 `autoSwitch` 或在回调中读取最新值（通过 ref）。

## 颜色合并规则
- `themeColors = { ...uiKittenTheme, ...specialThemeColors }`
- 发生同名键时，自定义 special 颜色覆盖 UI Kitten，保证品牌/设计优先。

## 迁移建议
- 新代码统一使用 `useUnifiedTheme()` 的 `theme/themeColors`。
- 旧的 `useTheme/useSpecialTheme/useUIKittenTheme` 标注为 deprecated，仅做过渡适配层。

## 集成要点
- App 根：`UnifiedThemeProvider → ApplicationProvider(themeColors)` 包裹应用。
- 主题切换只影响上下文，不做持久化；若需跨进程/重启保留，可在外层（例如用户设置保存处）自行落盘与恢复。

## 常见问题（FAQ）
- Q：为什么使用“预览模式”？
  - A：避免直接写入真实主题；用户确认后再 `applyPreviewTheme` 落地，取消则恢复原状态，提升可用性与容错，具有逻辑操作性。
- Q：系统主题变化与手动设置的关系？
  - A：当 `autoSwitch` 为真时才响应系统变化；否则以 `currentTheme` 为准。当以其他方式修改主题时，会取消自动跟随系统，如果有的话。
- Q：如何确保颜色一致性？
  - A：以 special 主题覆盖 UI Kitten，保证关键品牌色与自定义语义色生效。

## 后续计划
- 无

