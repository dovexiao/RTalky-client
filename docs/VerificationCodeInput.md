# VerificationCodeInput（验证码输入）

位置：`src/auth/verificationLogin/components/VerificationCodeInput.tsx`

## 职责
- 基于第三方 `react-native-confirmation-code-field` 的二次封装。
- 提供验证码输入组件，支持 4~7 位长度、光标动画、尺寸/样式自定义，并在输入完成时回调。

## Props
```ts
interface VerificationCodeInputProps {
  cellCount: 4 | 5 | 6 | 7;            // 验证码位数
  onFinish: (code: string) => void;     // 输入完成回调
  cursorDelay?: number;                 // 光标闪烁延迟，默认 500ms
  cursorSymbol?: string;                // 光标符号，默认 '|'
  cellWidth?: number;                   // 单元格宽度（覆盖默认）
  cellHeight?: number;                  // 单元格高度（覆盖默认）
  cellMargin?: number;                  // 单元格水平间距（覆盖默认）
  containerStyle?: ViewStyle;           // 容器样式覆盖
  cellStyle?: ViewStyle;                // 单元格样式覆盖
  textStyle?: TextStyle;                // 文本样式覆盖
  activeColor?: string;                 // 焦点边框色（默认 #4285F4）
  inactiveColor?: string;               // 非焦点边框色（默认 #E8E8E8）
  editable?: boolean;                   // 是否可编辑，默认 true
}
```

## 行为
- 内部维护输入值 `value`，每次变更触发 `handleChange`。
- 当 `value.length === cellCount` 时自动调用 `onFinish(code)`。
- 自动完成：
  - iOS：`textContentType="oneTimeCode"`
  - Android：`autoComplete="sms-otp"`

## 尺寸策略
- 提供默认尺寸（按位数设定宽高/间距），可通过 `cellWidth/cellHeight/cellMargin` 覆盖。
- 默认文本字号 24，白底灰边风格，圆角 8，可通过样式 props 覆盖。

## 使用示例
```tsx
<VerificationCodeInput
  cellCount={6}
  onFinish={(code) => doVerify(code)}
  activeColor="#4ecdc4"
  inactiveColor="#E0E0E0"
/>
```
