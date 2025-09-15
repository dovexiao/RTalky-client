# RTalky

一个基于 React Native 开发的现代化笔记应用，提供优雅的用户体验和强大的功能特性。

## 📱 项目简介

RTalky 是一款功能丰富的笔记管理应用，采用 React Native 0.76.5 开发，支持 iOS 和 Android 平台。应用集成了笔记创建、编辑、阅读、个人中心管理等功能，为用户提供流畅的笔记记录和管理体验。

## ✨ 核心功能

### 📝 笔记模块

**笔记库管理**
- 支持创建、编辑、删除笔记
- 笔记列表展示，支持搜索和筛选
- 笔记标签系统，便于分类管理

**笔记阅读器**
- 内置 Markdown 渲染，支持代码高亮、表格、图片等
- 自适应主题的阅读界面
- 笔记元信息展示（创建时间、修改时间、标签等）
- 支持按键和滑动翻页功能

**笔记创建流程**
- 分步骤的笔记创建向导
- 支持添加封面、标题、内容、标签

### 👤 个人中心模块

**用户资料管理**
- 头像上传和编辑（支持拍照和相册选择）
- 昵称和简介编辑
- 权限管理和用户友好的错误提示

**主题设置**
- 支持浅色/深色主题切换
- 实时主题预览功能
- 跟随系统主题设置
- 主题设置页面提供直观的预览界面

## 🎨 优秀的 UI/UX 设计

### 📖 笔记阅读器设计

RTalky 的笔记阅读器采用了精心设计的 Markdown 渲染系统：

- **主题适配**：阅读器会根据当前主题自动调整文字颜色、背景色等样式
- **代码高亮**：支持代码块的语法高亮，提供良好的代码阅读体验

### 🖼️ 头像修改操作栏

个人中心的头像修改功能展现了优秀的交互设计：

- **权限管理**：集成了智能的权限请求系统，支持相机和相册权限
- **动画效果**：使用 React Native Reanimated 实现流畅的弹窗动画
- **用户引导**：提供清晰的权限说明和设置引导
- **多种选择**：支持从相册选择、拍照、保存图片等多种操作

### 🎭 全局弹窗动画设计

应用中的各种弹窗组件都采用了统一的动画设计语言：

**ActionDialog（操作对话框）**
- 居中弹出动画，配合缩放效果
- 半透明遮罩层，提供良好的视觉层次
- 支持自定义内容高度和宽度比例
- 流畅的进入和退出动画

**BottomActionSheet（底部操作栏）**
- 从底部滑入的动画效果
- 圆角设计，符合现代移动应用设计规范
- 支持自定义内容容器样式
- 优雅的关闭动画

### 🌈 主题切换功能设计

RTalky 的主题系统展现了出色的设计理念：

**统一主题管理**
- 基于 Context API 的全局主题状态管理
- 支持浅色、深色主题，以及自定义主题
- 实时主题预览功能，用户可以在应用前预览效果
- 自动跟随系统主题设置

**主题预览界面**
- 直观的主题对比界面
- 模拟真实应用界面的预览效果
- 支持实时切换和预览
- 确认/取消机制，避免误操作

### 🌍 多国家区号选择设计

针对国际化需求，RTalky 实现了优雅的区号选择功能：

**CountryManager 国家管理**
- 基于 `world-countries` 和 `libphonenumber-js` 的权威数据
- 支持 200+ 个国家和地区的区号信息
- 支持多国家手机号格式验证
- 支持中英文国家名称搜索

**CountryCodeSelector 选择器**
- 分组列表展示，按字母顺序排列
- 侧边字母导航，快速定位
- 字母弹窗提示，提升用户体验
- 支持模糊搜索功能

## 🛠️ 技术架构

### 核心技术栈

- **React Native 0.76.5** - 跨平台移动应用开发框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **UI Kitten** - 基于 Eva Design 的 React Native UI 组件库
- **Zustand** - 轻量级状态管理库
- **React Navigation** - 导航管理
- **React Native Reanimated** - 高性能动画库

### 网络请求架构

**Axios 封装**
- 统一的请求/响应拦截器
- 自动 Token 管理和刷新
- 请求取消机制，避免重复请求
- 完善的错误处理和用户提示

**请求工具函数**
- 类型安全的 API 调用封装
- 统一的错误处理逻辑
- 支持 GET、POST、PUT、DELETE 等 HTTP 方法
- 自动处理网络错误和服务器错误

### 权限管理

**usePermission Hook**
- 统一的权限请求和管理
- 支持相机、相册、麦克风、位置等权限
- 智能的权限状态检测
- 用户友好的权限说明和引导

## 📦 项目结构

```
src/
├── auth/                    # 认证模块
│   ├── login/              # 登录相关
│   ├── oneTapLogin/        # 一键登录
│   ├── passwordLogin/      # 密码登录
│   ├── verificationLogin/  # 验证码登录
│   └── services/           # 认证服务
├── center/                 # 个人中心
│   ├── about/              # 关于页面
│   ├── backgroundSettings/ # 背景设置
│   ├── personCenter/       # 个人中心主页
│   └── recycleBin/         # 回收站
├── contexts/               # 全局上下文
│   ├── GlobalContext.tsx   # 全局状态
│   └── UnifiedThemeContext.tsx # 主题管理
├── global/                 # 全局组件
│   ├── actionDialog/       # 操作对话框
│   ├── avatarActionsModal/ # 头像操作弹窗
│   ├── bottomActionSheet/  # 底部操作栏
│   └── sliderVerification/ # 滑动验证
├── hooks/                  # 自定义 Hooks
├── icon/                   # 图标组件
├── main/                   # 主页面
├── navigation/             # 导航配置
├── note/                   # 笔记模块
│   ├── createNote/         # 创建笔记
│   ├── editNote/           # 编辑笔记
│   ├── noteLibrary/        # 笔记库
│   ├── noteReader/         # 笔记阅读器
│   └── services/           # 笔记服务
├── question/               # 问题模块
├── services/               # 服务层
│   └── fetch/              # 网络请求
└── utils/                  # 工具函数
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- React Native CLI
- Android Studio (Android 开发)
- Xcode (iOS 开发)

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# Android
npm run android

# iOS
npm run ios

# 启动 Metro
npm start
```

### 环境配置

项目支持多环境配置：

```bash
# 开发环境
npm run start:dev

# 测试环境
npm run start:staging

# 生产环境
npm run start:prod
```

## 📱 功能特性

### 笔记管理
- ✅ Markdown 格式支持
- ✅ 标签分类系统
- ✅ 搜索和筛选
- ✅ 笔记导入导出
- ✅ 回收站功能

### 用户系统
- ✅ 多种登录方式
- ✅ 用户资料管理
- ✅ 头像上传编辑
- ✅ 主题个性化

### 国际化支持
- ✅ 多国家区号选择
- ✅ 手机号格式验证
- ✅ 中英文界面支持

### 主题系统
- ✅ 浅色/深色主题
- ✅ 实时预览
- ✅ 跟随系统设置
- ✅ 自定义主题支持

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用 Prettier 进行代码格式化
- 组件采用函数式组件和 Hooks

### 状态管理

- 使用 Zustand 进行全局状态管理
- 按模块划分 Store
- 支持持久化存储

### 样式规范

- 使用 StyleSheet 创建样式
- 支持主题系统
- 响应式设计原则

## 📄 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE.md](LICENSE.md) 文件。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 项目讨论区

---

**RTalky** - 让笔记记录变得更加优雅和高效 🚀
