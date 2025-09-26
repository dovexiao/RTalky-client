# 设备信息（DeviceInfo）

位置：
- `src/auth/verificationLogin/utils/DeviceInfoManager.ts`
- `src/auth/verificationLogin/utils/DeviceInfoUtils.ts`

## 职责
- 采集应用运行设备的关键信息，并序列化为 API 载荷（字符串）用于登录/发送短信请求的风控与溯源。

## 采集项（DeviceInfoManager）
- `deviceId`：唯一设备标识（`react-native-device-info.getUniqueId()`）
- `deviceModel`：品牌 + 机型（如 `Apple iPhone 15`）
- `osType`：`ios` / `android`（来自 `Platform.OS`）
- `osVersion`：系统版本（如 `17.0`）
- `appVersion`：应用版本号（如 `1.0.0`）

采集通过 `Promise.all` 并行执行；失败时提供 `unknown` 回退值，确保请求字段完整。

## 序列化（DeviceInfoUtils）
- `toApiFormat(deviceInfo)`：输出 JSON 字符串（固定键名），作为接口中的 `deviceInfo` 字段。

## 使用示例
```ts
const info = await DeviceInfoManager.getDeviceInfo();
const payload = DeviceInfoUtils.toApiFormat(info);
// 携带到接口：SmsService.sendSmsCode / LoginService.smsLogin
```

## 合规与隐私
- 仅采集必要字段；勿采集个人敏感数据。
- 建议在用户协议/隐私政策中说明采集目的与字段。
- 如需扩展采集项（如设备语言/时区/运营商），需评估最小化原则与服务端需求。
