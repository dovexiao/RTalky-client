# RTalky - 智能学习助手应用

[![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![UI Kitten](https://img.shields.io/badge/UI%20Kitten-5.3.1-purple.svg)](https://akveo.github.io/react-native-ui-kitten/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📱 项目概述

**RTalky** 是一款基于React Native开发的智能学习助手应用，专注于提供高效的知识管理和学习体验。应用集成了笔记管理、题目练习、智能验证等核心功能，采用现代化的技术架构和用户体验设计。

## 🎯 项目定位

- **目标用户**: 学生、教师、知识工作者
- **核心价值**: 提供一体化的学习内容管理和知识积累平台
- **应用场景**: 课堂笔记、知识整理、题目练习、学习进度跟踪
- **技术特色**: 高性能、流畅交互、安全可靠

## 🚀 主要功能

### 📚 核心学习模块

#### 1. **智能笔记系统**
- **笔记创建**: 支持标题、简介、内容的多层次编辑
- **笔记管理**: 标签分类、搜索过滤、批量操作
- **笔记阅读**: 流畅的翻页体验、内容预览
- **笔记编辑**: 实时保存、版本管理

#### 2. **题目练习系统**
- **题目库管理**: 题目分类、难度分级、标签系统
- **练习模式**: 多种练习方式、进度跟踪
- **题目创建**: 可视化编辑器、模板系统
- **学习分析**: 练习统计、错题分析

#### 3. **个人中心**
- **用户管理**: 个人资料、学习统计
- **回收站**: 数据恢复、永久删除
- **设置中心**: 主题切换、通知设置

### 🔐 安全认证系统

- **短信验证码登录**: 安全便捷的身份验证
- **Token管理**: 24小时自动过期、安全存储
- **设备信息收集**: 智能风控、安全防护
- **权限管理**: 细粒度访问控制

### 🎨 用户体验特性

- **主题系统**: 支持明暗主题切换、自定义主题
- **手势操作**: 滑动侧边栏、手势验证、翻页控制
- **动画效果**: 流畅的过渡动画、交互反馈
- **响应式设计**: 适配不同屏幕尺寸

## 🛠️ 技术架构

### **前端技术栈**

#### 核心框架
- **React Native 0.76.5**: 跨平台移动应用开发框架
- **TypeScript 5.0.4**: 类型安全的JavaScript超集
- **React 18.3.1**: 现代化的用户界面库

#### UI组件库
- **UI Kitten 5.3.1**: 基于Eva Design System的组件库
- **Eva Icons**: 丰富的图标系统
- **自定义组件**: 高度定制化的业务组件

#### 状态管理
- **Zustand 5.0.6**: 轻量级状态管理库
- **React Context**: 全局状态共享
- **本地存储**: 数据持久化

#### 网络通信
- **Axios 1.10.0**: HTTP客户端库
- **拦截器系统**: 请求/响应统一处理
- **错误处理**: 完善的错误处理机制

### **移动端特性**

#### 原生功能集成
- **设备信息**: 获取设备硬件信息
- **权限管理**: 相机、存储、网络权限
- **本地存储**: 安全的数据存储方案

#### 性能优化
- **懒加载**: 按需加载组件和资源
- **内存管理**: 优化组件生命周期
- **渲染优化**: 减少不必要的重渲染

## 🎨 设计亮点

### **1. 手势交互系统**

#### 滑动侧边栏
```typescript
// 支持手势滑动的侧边栏组件
const SwipeSidebar = forwardRef<SwipeSidebarAPI, { children: React.ReactNode }>(({ children }, ref) => {
    const positionX = useSharedValue<number>(-sidebarWidth);
    const visible = useSharedValue(false);
    
    // 流畅的弹簧动画
    const show = () => {
        positionX.value = withSpring(0, {
            mass: 1,
            stiffness: 100,
            damping: 20,
        });
    };
});
```

#### 手势验证组件
- **滑块拼图验证**: 创新的验证方式
- **手势识别**: 精确的手势检测算法
- **动画反馈**: 流畅的交互体验

### **2. 高性能翻页系统**

#### 笔记阅读器
```typescript
// 基于FlatList的高性能翻页容器
const NotePagerContainer = forwardRef<ContainerAPI, NotePagerContainerProps>(
    ({ notes, initialScrollIndex, renderItem }, ref) => {
        const scrollX = useSharedValue(0);
        
        // 优化渲染性能
        const getItemLayout = (data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
        });
        
        return (
            <Animated.FlatList
                horizontal
                pagingEnabled
                getItemLayout={getItemLayout}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
            />
        );
    }
);
```

### **3. 智能状态管理**

#### Zustand Store设计
```typescript
// 模块化的状态管理
export const useAuthStore = create<AuthStore>((set, get) => ({
    // 认证状态
    isAuthenticated: false,
    userProfile: undefined,
    
    // 异步操作
    login: async (phoneNumber: string, smsCode: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthService.smsLogin(phoneNumber, smsCode);
            // 状态更新逻辑
        } catch (error) {
            set({ error: error.message });
        }
    },
}));
```

## 🔧 技术难点与解决方案

### **1. 手势冲突处理**

**问题**: 多个手势组件之间的冲突，如滑动翻页与侧边栏手势的干扰。

**解决方案**:
```typescript
// 手势优先级管理
const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
        // 只响应水平滑动，避免与垂直滚动冲突
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isSignificant = Math.abs(gestureState.dx) > threshold;
        return isHorizontal && isSignificant;
    },
});
```

### **2. 动画性能优化**

**问题**: 复杂动画场景下的性能问题，如侧边栏滑动、翻页动画等。

**解决方案**:
- 使用`react-native-reanimated`的`useSharedValue`和`useAnimatedStyle`
- 实现手势驱动的动画，减少JS线程负担
- 优化动画参数，使用合适的缓动函数

### **3. 内存管理优化**

**问题**: 大量笔记和题目数据的内存占用问题。

**解决方案**:
- 实现虚拟化列表渲染
- 使用`getItemLayout`优化FlatList性能
- 及时清理不需要的组件引用

### **4. 跨平台兼容性**

**问题**: iOS和Android平台的差异，如手势识别、动画表现等。

**解决方案**:
- 使用平台特定的代码分支
- 统一的手势处理逻辑
- 平台适配的动画参数

## 📱 应用截图

> 应用界面截图展示（需要实际截图）

## 🚀 快速开始

### **环境要求**

- Node.js >= 18
- React Native CLI
- Android Studio / Xcode
- 模拟器或真机设备

### **安装步骤**

```bash
# 克隆项目
git clone https://github.com/dovexiao/RTalky.git
cd RTalky

# 安装依赖
npm install

# iOS额外步骤
cd ios && bundle install && bundle exec pod install && cd ..

# 启动开发服务器
npm start

# 运行应用
npm run android  # Android
npm run ios      # iOS
```

### **环境配置**

```bash
# 开发环境
npm run start:dev

# 测试环境
npm run start:staging

# 生产环境
npm run start:prod
```

## 🏗️ 项目结构

```
RTalky/
├── src/                          # 源代码目录
│   ├── auth/                     # 认证模块
│   │   ├── types/               # 类型定义
│   │   ├── stores/              # 状态管理
│   │   ├── verificationLogin/   # 短信验证码登录
│   │   └── examples/            # 使用示例
│   ├── main/                    # 主界面模块
│   │   ├── components/          # 主界面组件
│   │   ├── screen/              # 主界面屏幕
│   │   └── stores/              # 主界面状态
│   ├── note/                    # 笔记模块
│   │   ├── createNote/          # 创建笔记
│   │   ├── noteLibrary/         # 笔记库
│   │   ├── noteReader/          # 笔记阅读器
│   │   └── editNote/            # 编辑笔记
│   ├── question/                # 题目模块
│   │   ├── questionBank/        # 题目库
│   │   ├── questionPaginator/   # 题目分页器
│   │   └── opeQuestion/         # 题目操作
│   ├── center/                  # 个人中心
│   │   ├── personCenter/        # 个人中心
│   │   └── recycleBin/          # 回收站
│   ├── navigation/              # 导航模块
│   ├── contexts/                # 全局上下文
│   ├── global/                  # 全局组件
│   ├── services/                # 服务层
│   ├── hooks/                   # 自定义Hooks
│   ├── icon/                    # 图标组件
│   ├── types/                   # 全局类型
│   └── utils/                   # 工具函数
├── android/                      # Android原生代码
├── ios/                         # iOS原生代码
├── assets/                      # 静态资源
└── docs/                        # 项目文档
```

## 🧪 测试

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 📦 构建与部署

### **Android构建**

```bash
# 生成APK
cd android && ./gradlew assembleRelease

# 生成AAB
cd android && ./gradlew bundleRelease
```

### **iOS构建**

```bash
# 使用Xcode构建
open ios/RTalky.xcworkspace
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React Native](https://reactnative.dev/) - 跨平台移动应用开发框架
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) - 优秀的UI组件库
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - 高性能动画库

## 📞 联系我们

- 项目地址: [https://github.com/dovexiao/RTalky](https://github.com/dovexiao/RTalky)
- 问题反馈: [Issues](https://github.com/dovexiao/RTalky/issues)
- 功能建议: [Discussions](https://github.com/dovexiao/RTalky/discussions)

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
