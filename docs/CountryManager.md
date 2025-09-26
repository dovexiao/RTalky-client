# CountryManager（国家/区号工具）

位置：`src/auth/verificationLogin/utils/CountryManager.ts`

## 职责
- 统一管理国家列表、区号映射、手机号校验/格式化与搜索。
- 数据源：`world-countries` + `libphonenumber-js`。

## 数据结构
```ts
export interface CountryInfo {
  flag: string;        // 国旗 emoji
  nameEn: string;      // 英文名
  nameZh: string;      // 中文名（含补充映射）
  callingCode: string; // e.g. "+86"
  cca2: string;        // 国家代码（如 CN/US）
}
```

## 初始化
- 过滤：仅保留 `independent` 且具备 `idd.root` 的国家。
- 区号优先级：
  1) `libphonenumber-js` 的 `getCountryCallingCode(cca2)`（权威数据）
  2) 回退到 `idd.root + suffixes[0]`
- 中文名补充：对常见国家提供 `cca2 → 中文名` 的映射补全。
- 建立 `callingCode → CountryInfo` 映射，便于快速查询。

## 能力
- `getAllCountries()`：返回已排序的国家列表（按英文名升序）。
- `searchCountries(query)`：名称（中/英）、区号、cca2 模糊搜索。
- `getCountryByCallingCode(code)` / `getCountryByCode(cca2)`：查询工具。
- `validatePhoneNumber(callingCode, phoneNumber)`：
  - 先查区号映射获取 `cca2`；
  - 构造完整号码并用 `parsePhoneNumberWithError` 校验；
  - 失败时回退 `isValidPhoneNumber(full, cca2)`；
  - 返回 `{ isValid, formattedNumber?, errorMessage? }`。
- `formatPhoneNumber(callingCode, phoneNumber, format)`：输出国际/本地/E164 格式。
- `getCountryFromPhoneNumber(phoneNumber)`：通过解析完整号码反查国家。

## 用法示例
```ts
import { countryManager } from '@/auth/verificationLogin/utils/CountryManager';

const list = countryManager.getAllCountries();
const result = countryManager.validatePhoneNumber('+86', '13800138000');
const formatted = countryManager.formatPhoneNumber('+86', '13800138000', 'INTERNATIONAL');
```

## 注意事项
- `getCountryByCallingCode` 内部使用了 `callingCode` 的规范化（去掉 `+`）时需对应调用；当前实现通过 Map 存储时已去前缀，API 调用不需要再手动去。
- 数据源更新：第三方库版本升级后可重新评估过滤与排序规则。
