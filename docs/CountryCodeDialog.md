# CountryCodeDialog（国家区号选择弹窗与组件树）

入口组件：`src/auth/verificationLogin/components/CountryCodeDialog.tsx`

本说明覆盖从 `CountryCodeDialog` 出发的整棵组件树（包含 `CountryCodeSelector`、`CountrySectionList`、`CountryAlphabetNavigator`、`CountryLetterPopup`）与相关 store 的数据流与交互关系。

## 1. 组件职责概览
- `CountryCodeDialog`：弹窗容器 + 动画与可见性管理 + 遮罩点击关闭
- `CountryCodeSelector`：选择器容器，分组列表/字母索引/悬浮大字母提示
- `CountrySectionList`：分组列表（A-Z/#），支持滚动至分组、选中国家区号
- `CountryAlphabetNavigator`：右侧字母条导航，点击跳转分组
- `CountryLetterPopup`：居中放大的字母提示（短暂显示）

## 2. 弹窗（CountryCodeDialog）
- 动画：
  - 遮罩透明度 0 → 0.5；
  - 容器缩放 0.9 → 1.0 + 轻微上移，宽/高为屏幕 90%。
- API（ref）：`show()`、`hide()`、`getVisible()`；外部通过 `useRef<CountryCodeDialogAPI>()` 调用。
- 内容：首次展示显示 Spinner，`isReady` 后渲染 `CountryCodeSelector`。
- 交互：点击遮罩关闭。

## 3. 选择器容器（CountryCodeSelector）
源码：`src/auth/verificationLogin/components/CountryCodeSelector.tsx`
- 结构：
  - `CountrySectionList`（主列表）
  - `CountryLetterPopup`（居中放大字母提示）
  - `CountryAlphabetNavigator`（右侧字母条）
- 行为：
  - 右侧字母点击 → `letterPopupRef.show(letter)` 展示大字母提示 → `sectionListRef.scrollToSection(letter)` 滚动至对应分组。

## 4. 分组列表（CountrySectionList）
源码：`src/auth/verificationLogin/components/CountrySectionList.tsx`
- 渲染：使用 `@shopify/flash-list`，数据 `flashListData` 为分组数据。
- 粘性头部：`stickyHeaderIndices` 构造所有分组标题的索引，实现悬浮分组头。
- 滚动控制（ref）：对外暴露 `scrollToSection(letter)`，用于从字母导航跳转。
- 选中逻辑：
  - 读取 `selectedCallingCode/selectedCCA2` 高亮当前选中项；
  - 点击某项调用 `useVerificationLoginStore.getState().onSelectedCallingCode(callingCode, cca2, sectionLetters)` 写回所选区号。
- 可视分组追踪：`onViewableItemsChanged` 将当前可视分组的字母写入 `useCountryCodeSelectorStore.setState({ activeLetter })`，驱动字母条高亮。

## 5. 字母导航（CountryAlphabetNavigator）
源码：`src/auth/verificationLogin/components/CountryAlphabetNavigator.tsx`
- 展示：A-Z + `#` 组成的竖直字母条，半透明白底。
- 状态：
  - `activeLetter`（当前可视分组，来自 `useCountryCodeSelectorStore`）→ 字号更大、主色高亮；
  - `selectedSectionLetter`（当前已选项所在分组，来自 `useVerificationLoginStore`）→ 次级高亮。
- 交互：仅当 `sectionIndexMap[letter] !== undefined` 才可点击；点击触发向上回调，驱动列表滚动与大字母提示展示。

## 6. 大字母提示（CountryLetterPopup）
源码：`src/auth/verificationLogin/components/CountryLetterPopup.tsx`
- 动画：`opacity` 以 `withSequence(withTiming(1), withDelay(300, withTiming(0)))` 显示后淡出；
- API（ref）：`show(letter?)`，并可通过 `useCountryCodeSelectorStore.setState({ popupLetter: letter })` 更新展示字母。
- 定位：绝对居中圆形容器，短时显示。

## 7. 相关 store 与数据流
- `useCountryCodeSelectorStore`（目录：`src/auth/verificationLogin/stores`）
  - 字段：`flashListData`（含分组标题/行）、`sectionIndexMap`（字母→索引）、`activeLetter`、`popupLetter`。
  - 用途：驱动列表数据、可视分组高亮、字母提示文案。
- `useVerificationLoginStore`（目录同上）
  - 字段：`selectedCallingCode`、`selectedCCA2`、`selectedSectionLetter` 等；
  - 方法：`onSelectedCallingCode(callingCode, cca2, sectionLetters)` 写回所选项并记录所属分组（便于右侧索引显示已选状态）。
- 数据来源：国家与区号原始数据由 `CountryManager` 提供（见 docs/CountryManager.md）。

## 8. 交互路径总结
1) 打开区号弹窗（`CountryCodeDialog.show()`）。
2) 字母条点击某字母 → 显示大字母提示、列表滚动到对应分组。
3) 点击某一国家行 → 将区号与国家代码写回 `useVerificationLoginStore`，并高亮当前项/分组。
4) 点击遮罩关闭弹窗（或外部逻辑关闭）。

## 9. 性能与 UX 注意
- 列表项高度/头部高度常量化（`ITEM_HEIGHT`、`HEADER_HEIGHT`），配合 FlashList 提升滚动性能。
- 使用粘性头部改善分组感知；
- 字母条禁用无数据分组，减少无效跳转；
- 字母提示使用取消动画（`cancelAnimation`）避免连续点击的动画竞争。

## 10. 关联文档
- 国家与区号工具：`docs/CountryManager.md`
- 验证登录入口与弹窗触发：`docs/Auth.md`
