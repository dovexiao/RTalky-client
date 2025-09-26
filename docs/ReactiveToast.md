# ReactiveToast 组件说明

位置：`src/global/reactiveToast/ReactiveToast.tsx`

`ReactiveToast` 是一个可配置的状态驱动提示展示组件，支持自定义渲染、展示位置、自动关闭时长，并内置进入/退出与位置切换动画。该组件本身不持有全局状态，通常由 `ReactiveToastContainer` 作为状态驱动的第一渲染者使用。

## 组件职责
- 接收一组“依赖状态”（`dependencies`）与若干计算函数（`render/shouldShow/position/autoClose`）。
- 基于计算结果控制：是否展示、展示位置样式、内容实际渲染、自动关闭计时。
- 在位置、内容变化时，先隐藏再以新位置出现，避免突兀位移。

## Props（API）
```ts
interface ReactiveToastProps {
  dependencies: Record<string, any>;               // 依赖的状态对象（外部计算的输入）
  render: (deps: Record<string, any>) => React.ReactNode; // 内容渲染函数
  shouldShow: (deps: Record<string, any>) => boolean;     // 是否展示
  position?: (deps: Record<string, any>) => string;       // 位置：'center'|'top'|'bottom'|'left'|'right'（默认 center）
  autoClose?: (deps: Record<string, any>) => number | false; // 自动关闭毫秒数，false 表示不自动关闭（默认 3000）
  onShow?: () => void;                           // 完成进入动画回调
  onHide?: () => void;                           // 完成退出动画回调
}
```

## 渲染与动画
- 进入/退出：
  - 使用 Reanimated 的 `withTiming` 控制透明度与轻微缩放/位移，时长约 300ms。
- 位置切换：
  - 当位置或内容变更时，先触发隐藏动画；隐藏完成后更新位置样式并重新进入，避免直接在屏幕上平移导致的“跳动感”。
- 显示条件：
  - `shouldShow(dependencies)` 为 `true` 时展示，否则隐藏。

## 定位（Position）
- 通过 `position(dependencies)` 决定位置，支持：
  - `center`（居中，常用于带面板的 loading 提示）、`top`（顶部条幅）、`bottom`（底部短提示）、`left`、`right`。
- 内部样式：绝对定位。

## 自动关闭逻辑
- 仅在 `shouldShow` 为真且 `autoClose(deps)` 返回正数时启动计时。
- 内容或位置发生变化时，重置计时（避免旧计时对新提示产生影响）。
- 返回 `false` 表示不自动关闭（例如 `loading` 场景）。

## 使用示例（直接使用）
```tsx
<ReactiveToast
  dependencies={{ messageType, messageText }}
  shouldShow={({ messageType, messageText }) => messageType !== 'none' && !!messageText}
  position={({ messageType }) => (messageType === 'loading' ? 'center' : 'top')}
  autoClose={({ messageType }) => (messageType === 'loading' ? false : 2000)}
  render={({ messageText }) => (
    <View style={{ padding: 16, backgroundColor: '#333', borderRadius: 8 }}>
      <Text style={{ color: '#fff' }}>{messageText}</Text>
    </View>
  )}
/>
```

## 与全局状态的关系
- `ReactiveToast` 自身不依赖任何特定状态方案；
- 推荐通过 `ReactiveToastContainer`+store（Zustand）统一驱动：容器订阅状态 → 传参给 `ReactiveToast` → 统一渲染主题化样式；
- 若项目后续需要多实例或不同命名空间的提示，可在容器层拆分不同的 store 切片实现。

## 注意事项
- 这是一个“可控渲染器”，请确保传入的 `dependencies` 与计算函数是稳定的（必要时使用 `useMemo/useCallback`）。
- 位置变化会触发先隐藏再出现的动画序列，若希望平滑过渡，可改为容器层面创建两个实例（旧位置逐渐隐藏，新位置逐渐显示）。
- 自动关闭计时器在组件卸载时会清理，避免内存泄漏。
