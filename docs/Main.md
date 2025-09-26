# Main 模块

位置：`src/main/`

Main 模块是应用登录后的主入口，提供工作台界面、用户头像展示、侧边栏导航等核心功能。该模块设计简洁，主要作为功能模块的导航入口。

## 模块结构

```
src/main/
├── screen/
│   └── AppMain.tsx              # 主屏幕组件
├── components/                  # 组件库
│   ├── PanSwipeResponder.tsx   # 手势滑动检测组件
│   ├── SwipeSidebar.tsx        # 侧边栏容器组件
│   ├── TopAvatarColumn.tsx     # 顶部头像栏组件
│   ├── LearnMain.tsx           # 学习模块主容器
│   ├── LearnBox.tsx            # 学习卡片组件
│   ├── RandomAvatar.tsx        # 随机头像生成组件
│   ├── ConfirmExit.tsx         # 退出确认对话框内容
│   ├── ConfirmLogout.tsx       # 登出确认对话框内容
│   ├── TopNavigationOpe.tsx    # 通用顶部导航操作组件
│   └── index.ts                # 组件导出文件
├── stores/
│   └── main.store.ts           # 主模块状态管理（当前为空实现）
└── types/
    └── index.ts                # 类型定义
```

## 核心功能

### AppMain.tsx（主屏幕）
- **布局结构**：
  - 顶部：状态栏 + 头像栏（`TopAvatarColumn`）
  - 中间：学习模块内容（`LearnMain`），支持右滑手势
  - 侧边：可滑出的个人中心（`SwipeSidebar` + `PersonCenter`）
- **交互逻辑**：
  - 点击头像或右滑屏幕 → 显示侧边栏（个人中心）
  - 左滑侧边栏 → 隐藏侧边栏
  - 返回键 → 显示退出确认对话框
- **状态栏管理**：根据主题动态调整状态栏样式和高度
- **主题适配**：使用 `useUnifiedTheme` 获取主题色彩

### 关键组件

#### PanSwipeResponder（手势检测）
- **技术栈**：React Native `PanResponder`
- **功能**：检测水平滑动手势，支持自定义阈值和速度
- **配置**：`threshold={60}`（滑动距离阈值）、`minVelocity={0.7}`（最小速度）
- **用途**：包裹 `LearnMain`，检测右滑手势触发侧边栏显示

#### SwipeSidebar（侧边栏容器）
- **技术栈**：`react-native-reanimated` + `forwardRef` + `useImperativeHandle`
- **功能**：从左侧滑出的侧边栏，支持手势关闭和点击遮罩关闭
- **动画**：使用 `withSpring` 实现平滑的滑入/滑出动画
- **API**：暴露 `show()`、`hide()`、`getVisible()` 方法
- **内容**：承载 `PersonCenter` 组件

#### TopAvatarColumn（顶部头像栏）
- **技术栈**：UI Kitten `TopNavigation`
- **功能**：显示用户头像、应用标题"工作台"
- **头像逻辑**：优先显示用户真实头像，否则显示 `RandomAvatar`
- **交互**：点击头像触发侧边栏显示

#### LearnMain（学习模块容器）
- **功能**：展示功能模块入口卡片
- **数据来源**：从 `useNoteStore` 获取笔记数据
- **当前模块**：仅显示"笔记库"入口（其他模块被注释）
- **导航**：点击卡片跳转到对应功能模块

#### LearnBox（学习卡片）
- **技术栈**：UI Kitten `Icon` + `Text`
- **功能**：展示单个功能模块的图标、标题、描述
- **样式**：圆角卡片设计，支持主题色彩适配
- **交互**：点击跳转到对应屏幕

#### RandomAvatar（随机头像）
- **技术栈**：基于用户ID的哈希算法
- **功能**：为没有头像的用户生成固定颜色的圆形头像
- **算法**：使用字符串哈希确保同一用户始终获得相同颜色
- **颜色库**：15种深色调色板，避免过于鲜艳的颜色

## 状态管理

### main.store.ts
- **当前状态**：空实现，暂无状态管理需求
- **设计预留**：为未来可能的主模块状态管理预留接口

### 依赖的外部状态
- **认证状态**：`useAuthStore` - 获取用户头像、ID等信息
- **笔记状态**：`useNoteStore` - 获取笔记数量和最后更新时间
- **主题状态**：`useUnifiedTheme` - 获取主题色彩和类型

## 类型定义

### AppMainProps
```typescript
export type AppMainProps = {
    navigation: AppMainNavigationProp;
    route: AppMainRouteProp;
};
```

### LearnBox
```typescript
export type LearnBox = {
    id: string;
    title: string;
    description: string;
    count: number;
    lastUpdated: string;
    icon: string;
    backgroundColor: string;
    countColor: string;
    countTextColor: string;
    screen: keyof RootStackParamList;
};
```

## 设计特点

### 1. 简洁的导航设计
- 主界面只展示核心功能入口
- 通过侧边栏访问个人中心，避免界面拥挤

### 2. 手势交互优化
- 右滑显示侧边栏，符合用户习惯
- 左滑关闭侧边栏，提供便捷的关闭方式

### 3. 主题适配完整
- 状态栏样式根据主题动态调整
- 所有组件都支持主题色彩系统

### 4. 模块化组件设计
- 每个功能组件职责单一，便于维护
- 通过 `index.ts` 统一导出，简化导入

## 使用方式

### 导航到主屏幕
```typescript
// 在导航栈中，AppMain 作为登录后的主入口
navigation.navigate('AppMain');
```

### 访问侧边栏
```typescript
// 通过 ref 控制侧边栏显示/隐藏
const swipeSidebarRef = useRef<SwipeSidebarAPI>(null);
swipeSidebarRef.current?.show();
swipeSidebarRef.current?.hide();
```

## 扩展建议

1. **功能模块扩展**：在 `LearnMain` 中添加更多功能模块入口
2. **状态管理**：如需要，可在 `main.store.ts` 中添加主模块相关状态
3. **手势优化**：可考虑添加更多手势交互，如双击、长按等
4. **性能优化**：对于大量功能模块，可考虑使用虚拟化列表

## 注意事项

1. **状态栏处理**：需要手动处理状态栏高度，确保内容不被遮挡
2. **手势冲突**：`PanSwipeResponder` 可能与子组件的手势产生冲突，需要合理配置
3. **主题一致性**：所有组件都应使用 `useUnifiedTheme` 确保主题一致性
4. **内存管理**：侧边栏使用动画，需要注意组件卸载时的清理工作
