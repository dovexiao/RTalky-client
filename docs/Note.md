# Note 模块（聚焦阅读器）

位置：`src/note/`

本文系统阐述 Note 模块，重点放在阅读器（NoteReader）的架构、数据流与交互设计；列表/新增/编辑仅做路由级概述与接口承接。

## 目录结构总览

```
src/note/
├── noteLibrary/        # 列表页（进入阅读器的入口）
├── createNote/         # 分步骤创建（封面/正文/标签）
├── editNote/           # 编辑页
└── noteReader/         # 阅读器（核心）
    ├── screens/
    │   └── NoteReader.tsx
    ├── contexts/
    │   └── PagerController.tsx
    ├── components/
    │   ├── NotePagerContainer.tsx
    │   ├── NoteDetailContent.tsx
    │   ├── MarkdownRenderer.tsx
    │   ├── ButtonControls.tsx
    │   ├── TiltObserver.tsx
    │   └── ShakeUnlockButton.tsx
    ├── stores/
    │   └── noteReader.store.ts
    └── types/
```

## 路由与入口（简述）
- 列表页：`note/noteLibrary/screens/NoteLibrary.tsx` → 点击卡片进入阅读器
- 新增页：`note/createNote/screens/...` → 完成后可跳转到阅读器
- 编辑页：`note/editNote/screens/EditNote.tsx` → 编辑完成后可返回阅读器

阅读器路由参数（建议约定）：
- `noteId: string`（必需）
- `initialPage?: number`（可选，指定初始翻页索引）
- `mode?: 'read' | 'edit-preview'`（可选）

---

## 阅读器总体架构

阅读器由三层组成：
- 屏幕层：`NoteReader.tsx`（承接导航/TopBar/注入主题）
- 控制层：`PagerController.tsx`（翻页编排、状态与回调协调）
- 视图层：`NotePagerContainer`（横向分页容器）+ 每页内容 `NoteDetailContent`

关键交互模块：
- 手势/按钮翻页：`ButtonControls` + `NotePagerContainer`
- 倾斜翻页：`TiltObserver`（重力传感器）
- 解锁门槛：`ShakeUnlockButton`（长按进度+动画）

---

## 屏幕层：NoteReader.tsx
- 注入 `TopNavigationOpe` 和主题色，右上角提供“编辑”入口
- 读取 `noteId`，从 `useNoteStore` 获取笔记数组
- 将 `notes` 和 `currentNoteId` 交给控制层 `PagerController`

---

## 控制层：PagerController.tsx（核心）
职责：协调翻页、页面滚动复位、倾斜/解锁服务的启动与停止。

- 状态/引用
  - `containerRef: ContainerAPI`（控制 `NotePagerContainer`）
  - `scrollViewRefs: Map<noteId, ScrollView>`（每页纵向滚动容器）
  - `TiltObserverRef: TiltObserverAPI`（命令式启动/停止）
  - `useNoteReaderStore`：`currentPage`、`pageCount`

- 能力
  - `goNext / goPrev`
    - 读取当前页 → 边界判断 → 复位当前页纵向滚动 → 滚动至目标页
  - `resetScrollViewPosition(noteId)`：将某页纵向滚动复位至顶部
  - 初始化：根据 `currentNoteId` 定位初始页、设置 `pageCount`

- 集成
  - 渲染横向分页容器：`NotePagerContainer`
  - 底部按钮控制：`ButtonControls`（上一页/下一页等）
  - 倾斜检测：`TiltObserver`（回调直连 `goPrev/goNext`）
  - 解锁门槛：`ShakeUnlockButton`
    - `onShow`：引导文案（ReactiveToast）
    - `onUnlock`：提示成功并 `TiltObserver.start()`
    - `onLock`：提示上锁并 `TiltObserver.stop()`

> 关联补充：详见 `docs/TiltObserver.md` 与 `docs/ShakeUnlockButton.md`

---

## 视图层：分页与页面内容

### NotePagerContainer.tsx（横向分页容器）
- 技术：`Animated.FlatList` + Reanimated
- 能力：
  - `scrollToPage(page: number)`
  - `getCurrentPage(): number`
  - `setScrollEnabled(enabled: boolean)`（预留：动画期间可禁滚动）
- 滚动事件：
  - `onMomentumEnd` 计算页码 → 更新 `currentPage`
  - 若页码变更，复位上一页的纵向 `ScrollView`
- 性能：
  - `getItemLayout` 提供定长布局（屏宽）
  - `initialNumToRender` 预渲染数量（10）

### NoteDetailContent.tsx（单页内容）
- 责任：懒加载笔记详情（必要时）与渲染标题/简介/时间/标签/正文
- 数据：
  - 若 `note.content` 为空 → 调 `NoteService.getNoteDetail` 填充 → 写回 `useNoteStore`
  - 错误：通过全局 Toast 提示
- 正文渲染：交给 `MarkdownRenderer`

### MarkdownRenderer.tsx（Markdown 渲染）
- 技术：`react-native-markdown-display`
- 主题：按 `UnifiedThemeContext` 合并样式（文本、代码块、表格、引用等）
- 媒体：自定义 `image` 规则（直接以 `Image` 展示，后续可接入 `ImageCache`）

---

## 交互能力

### 1) 按钮/手势翻页（基础）
- `ButtonControls` 提供 UI 层面的上一页/下一页入口
- 横向分页手势由 `NotePagerContainer` 接管
- 动画中或锁定态下可调用 `setScrollEnabled(false)`（预留）

### 2) 倾斜翻页（强化）
- 组件：`TiltObserver`
- 逻辑要点：固定高频传感器 + 定时器控制实现“虚拟动态频率”；倾斜加速、稳定恢复
- 生命周期：仅在解锁后 `start()`，上锁或离开阅读器 `stop()`
- 文档：参阅 `docs/TiltObserver.md`

### 3) 解锁门槛（防误触）
- 组件：`ShakeUnlockButton`
- 行为：长按 2s → 进度满 → 摇晃/缩放/渐隐动画 → 图标切换为解锁
- 颜色：按状态切换（锁定/解锁中/动画中/已解锁）
- 动画中断：支持 `cancelAnimation`，确保状态一致性
- 文档：参阅 `docs/ShakeUnlockButton.md`

---

## 状态机（建议实现）
- 状态：`idle` → `locking` → `unlocked` → `relock`
- 触发：
  - `showUnlock` → `locking`
  - `longPressDone` → `unlocked`（TiltObserver.start）
  - `release/timeout/leave` → `relock`（TiltObserver.stop）
- 约束：
  - `unlocked` 时允许倾斜翻页；其他状态禁止倾斜翻页
  - 动画期间禁重复触发，必要时禁水平滚动

---

## 性能与体验
- 懒加载：详情按需请求，页面滚动复位减少累计位移
- 动画：Reanimated 驱动，避免 JS 线程阻塞；倾斜检测用“虚拟频率”降低开销
- 列表/分页：`getItemLayout` + `initialNumToRender` 优化首屏与翻页流畅度
- 图片：可接入 `ImageCache` 做本地缓存与尺寸优化（参阅 `docs/ImageCache.md`）

---

## 错误与边界处理
- 边界页：首尾页翻页时可提示（震动/Toast），避免空滚动
- 网络失败：详情请求失败给出错误提示并维持已有内容
- 资源失败：图片加载失败的降级与重试（后续可在 Markdown 渲染层统一处理）

---

## 与其他模块的衔接
- 列表：NoteLibrary 负责提供 `notes` 列表与入口 `noteId`
- 新增/编辑：完成后可通过导航参数定位到阅读器相应页
- 全局：Toast 提示由 `ReactiveToast` 承担；主题由 `UnifiedThemeContext` 提供

---

## 后续扩展
- 目录/书签/搜索/高亮
- 阅读进度保存与恢复（入场定位）
- Markdown 增强（本地图片、代码高亮、表格增强）
- 手势优先级管理（与外层容器/系统手势协作）
