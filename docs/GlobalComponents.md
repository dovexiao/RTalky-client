# 全局组件与 GlobalContext

本节仅描述：全局容器 `GlobalContext.tsx`，以及三个全局组件 `ActionDialog`、`BottomActionSheet`、`ReactiveToastContainer` 的功能、展示方式与定位。

## GlobalContext.tsx（全局容器）
- 位置：`src/contexts/GlobalContext.tsx`
- 职责：
  - 作为全局 UI 能力的承载容器，在应用根部挂载三类全局组件。
  - 通过 Context 暴露可命令式调用的 ref：`bottomActionSheetRef`、`actionDialogRef`。
- 渲染结构：
  - Provider 包裹 children；在 Provider 根层并排渲染：
    - `<BottomActionSheet ref={bottomActionSheetRef} />`
    - `<ActionDialog ref={actionDialogRef} />`
    - `<ReactiveToastContainer />`
- 使用方式：
  - 业务内通过 `useGlobal()` 取得 ref 并调用 `show/hide` 等 API。

---

## ActionDialog（模态对话框）
- 位置：`src/global/actionDialog/index.tsx`
- 功能：
  - 居中弹出的确认/告知类对话框，支持自定义内容、滚动、按钮回调。
- 展示方式：
  - Reanimated 动画：淡入 + 轻微缩放。
  - 背景遮罩（半透明黑）可点击关闭。
- 定位与层级：
  - 绝对定位，垂直居中，`zIndex` 高于业务页面（遮罩约 203，内容约 204）。
- 调用示例（通过 ref）：
  - `actionDialogRef.current?.show({ content, onConfirm, onCancel, dialogWidthRatio?, contentMinHeightRatio?, scrollable? })`
  - `actionDialogRef.current?.hide()`

---

## BottomActionSheet（底部操作栏）
- 位置：`src/global/bottomActionSheet/index.tsx`
- 功能：
  - 自底部滑入的操作面板/动作列表容器，内容由调用方传入。
- 展示方式：
  - Reanimated 动画：自下而上位移；半透明遮罩点击收起。
- 定位与层级：
  - 绝对定位于底部，铺满宽度；`zIndex` 高于业务页面（遮罩约 101，内容约 102）。
- 调用示例（通过 ref）：
  - `bottomActionSheetRef.current?.show(<View>...</View>)`
  - `bottomActionSheetRef.current?.hide()`

---

## ReactiveToastContainer（全局提示容器）
- 位置：`src/global/reactiveToast/ReactiveToastContainer.tsx`
- 功能：
  - 读取提示状态并渲染全局 `ReactiveToast`；作为全局提示系统的唯一入口。
- 展示方式：
  - 根据消息类型决定位置与是否自动关闭：
    - `loading`：居中，常驻，带 Spinner 面板；
    - `offline/online/tilt`：顶部条幅，`offline` 常驻，`online/tilt` 自动关闭；
    - 其他（如 success/warning/danger）：底部短时提示。
  - 视觉风格按主题色 `themeColors` 渲染（来自 `UnifiedThemeContext`）。
- 定位与层级：
  - 绝对定位；由 `ReactiveToast` 内部控制位置（top/center/bottom）；`zIndex` 高于业务页面（约 300）。
- 状态来源：
  - 订阅 `useReactiveToastStore`（Zustand）：`messageType`、`messageText`、`isActive`。
  - 隐藏时重置为 `none`/空文本。

> 说明：`ReactiveToastContainer` 仅负责“读状态并渲染”，动画与位置切换细节由 `ReactiveToast` 实现；如需更细粒度自定义，参阅 `docs/ReactiveToast.md`。
