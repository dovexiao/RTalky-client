# usePermission（权限封装 Hook）

位置：`src/hooks/usePermission.ts`

`usePermission` 封装了常见权限（相机、照片、麦克风、定位）的检查、请求、被拒后的设置引导与返回重检流程。设计目标是：统一交互、可复用配置、最小入侵接入。

## 设计动机
- 权限交互分散、样式不一：统一用全局 `ActionDialog` 呈现说明/引导
- 跨平台差异：内部映射 iOS/Android 权限常量
- 被永久拒绝的回流：跳设置 → 回到 App 后自动重检

## 技术栈
- `react-native-permissions`：check/request/openSettings/常量
- 全局对话：`GlobalContext` 的 `actionDialogRef`
- AppState：监听从设置返回后的权限重检

## API

```ts
type PermissionType = 'camera' | 'photos' | 'microphone' | 'location';

interface PermissionConfig {
  permission: PermissionType;
  rationale: { title: string; message: string; positiveButton: string; };
  settings: { title: string; message: string; positiveButton: string; };
}

interface ReturnState {
  status: PermissionStatus;      // 当前权限状态
  isLoading: boolean;            // 是否在检查/请求中
  isGranted: boolean;            // 是否已授权
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<PermissionStatus>;
  permissionType: PermissionType;
}
```

## 使用示例

```tsx
const { isGranted, requestPermission } = usePermission({
  permission: 'camera',
  rationale: {
    title: '开启相机权限',
    message: 'RTalky 需要相机权限用于拍摄照片更新头像',
    positiveButton: '去开启',
  },
  settings: {
    title: '权限被拒绝',
    message: '请在系统设置中允许相机权限',
    positiveButton: '去设置',
  },
});

const onTakePhoto = async () => {
  const ok = await requestPermission();
  if (!ok) return;
  // 执行拍照逻辑
};
```

## 交互流程
- 检查：`check(permission)` → 若已授权直接返回 true
- 非授权：弹出“请求说明对话框” → 用户确认 → `request(permission)`
- 永久拒绝（blocked）：弹出“去设置引导对话框” → 打开设置
- 返回 App：监听 AppState → 重新 `check` → 关闭监听

## 复用与扩展
- 通过 `PermissionType` 扩展更多权限（如通知、蓝牙等）
- 可替换对话组件为品牌化的 UI（保持 `actionDialogRef` 接口不变）
- 在具体业务中组合封装高阶钩子：如 `useCameraAccess()`、`usePhotoPickerAccess()`

## 注意事项
- iOS/Android 权限名称不同，统一由内部映射函数处理
- 某些权限需要在 `Info.plist`/`AndroidManifest.xml` 添写用途描述
- 从设置返回的重检依赖 AppState，确保监听正确移除
