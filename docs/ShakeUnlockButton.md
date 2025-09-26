# ShakeUnlockButton（摇晃解锁按钮组件）

位置：`src/note/noteReader/components/ShakeUnlockButton.tsx`

`ShakeUnlockButton` 是一个复杂的交互式解锁按钮组件，集成了长按检测、进度条显示、摇晃动画、图标切换等多种交互效果。该组件主要用于笔记阅读器的特殊交互场景，提供沉浸式的解锁体验。

## 组件职责

- **长按解锁**：通过长按触发解锁流程，支持自定义持续时间
- **进度反馈**：使用环形进度条显示长按进度
- **摇晃动画**：解锁时的摇晃效果增强视觉反馈
- **图标切换**：从锁定图标切换到解锁图标
- **手势控制**：支持手势移动检测，超出按钮区域自动重置
- **状态管理**：完整的锁定/解锁状态管理和动画控制

## 技术栈

- **React Native PanResponder**：手势检测和响应
- **react-native-reanimated**：高性能动画（摇晃、缩放、透明度、位移动画）
- **UI Kitten CircularProgressBar**：环形进度条组件
- **react-native-vector-icons**：Material Icons 图标库
- **react-native-linear-gradient**：渐变背景效果
- **TypeScript**：完整的类型定义

## API 接口

### Props

```typescript
interface ShakeUnlockButtonProps {
    longPressDuration?: number;    // 长按持续时间，默认2000ms
    onShow?: () => void;          // 显示按钮时回调
    onUnlock?: () => void;        // 解锁成功时回调
    onLock?: () => void;          // 锁定状态时回调
}
```

### 核心参数

- **longPressDuration**：长按持续时间，默认 2000ms（2秒）
- **onShow**：按钮显示时的回调函数
- **onUnlock**：解锁成功时的回调函数
- **onLock**：锁定状态时的回调函数

## 组件结构

### 1. 双层结构设计

```typescript
return (
    <>
        {/* 主按钮容器 */}
        <Animated.View style={[styles.container, containerStyle]}>
            <LinearGradient>...</LinearGradient>
            <CircularProgressBar renderIcon={renderLockButton} />
        </Animated.View>
        
        {/* 触发按钮 */}
        <Animated.View style={[styles.PressTrigger, triggerStyle]}>
            <TouchableOpacity onPress={showUnlockButton}>
                <Icon name="screen-rotation" />
            </TouchableOpacity>
        </Animated.View>
    </>
);
```

- **主按钮容器**：包含渐变背景、进度条和锁定按钮
- **触发按钮**：屏幕旋转图标，点击显示主按钮

### 2. 动画系统

#### 共享值定义

```typescript
const shakeX = useSharedValue(0);        // 摇晃动画
const scale = useSharedValue(1);         // 缩放动画
const opacity = useSharedValue(1);       // 透明度动画
const bottomOffset = useSharedValue(-100);      // 主按钮位置
const triggerBottomOffset = useSharedValue(-20); // 触发按钮位置
```

#### 摇晃动画序列

```typescript
shakeX.value = withSequence(
    withTiming(-15, { duration: 100 }), // 左摇
    withTiming(15, { duration: 100 }),  // 右摇
    withTiming(-12, { duration: 100 }), // 左摇
    withTiming(12, { duration: 100 }),  // 右摇
    withTiming(0, { duration: 100 })    // 回正
);
```

#### 图标切换动画

```typescript
// 放大效果
scale.value = withSequence(
    withTiming(1.2, { duration: 150 }),
    withTiming(1, { duration: 150 })
);

// 淡出淡入
opacity.value = withSequence(
    withTiming(0.3, { duration: 100 }),
    withDelay(100, withTiming(1, { duration: 100 }))
);
```

## 核心功能实现

### 1. 长按计时系统

```typescript
const startTimer = () => {
    setIsUnlocking(true);
    setProgress(0);

    let currentProgress = 0;
    const updateInterval = 20; // 50fps
    const progressIncrement = updateInterval / longPressDuration;

    progressTimerRef.current = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= 1) {
            currentProgress = 1;
            setProgress(1);
            clearInterval(progressTimerRef.current!);
            runOnJS(handleUnlock)();
        } else {
            setProgress(currentProgress);
        }
    }, updateInterval);
};
```

- **高频率更新**：20ms 间隔更新进度，提供流畅的视觉反馈
- **精确计算**：基于时间间隔和总时长计算进度增量
- **状态管理**：使用 `isUnlocking` 状态控制解锁流程

### 2. 手势检测与区域控制

```typescript
onPanResponderMove: (event, gestureState) => {
    const { locationX, locationY } = event.nativeEvent;
    const buttonRadius: number = 40;

    const distance = Math.sqrt(
        Math.pow(locationX - buttonRadius, 2) +
        Math.pow(locationY - buttonRadius, 2)
    );

    if (distance > buttonRadius) {
        resetAllStatues();
    }
},
```

- **区域检测**：计算手指位置与按钮中心的距离
- **自动重置**：超出按钮区域时自动停止计时并重置状态
- **精确控制**：40像素的按钮半径，提供合理的操作区域

### 3. 状态颜色系统

```typescript
const statusColorStyle = useMemo(() => {
    if (isAnimating) {
        return themeColors['color-danger-500'];    // 红色：动画中
    } else if (isUnlocking) {
        return themeColors['color-warning-500'];   // 橙色：解锁中
    } else if (!isLocked) {
        return themeColors['color-success-500'];   // 绿色：已解锁
    }
    return themeColors['color-primary-600'];       // 蓝色：默认锁定
}, [isAnimating, isUnlocking, isLocked, themeColors]);
```

- **动态颜色**：根据组件状态动态改变按钮颜色
- **主题适配**：使用 `useUnifiedTheme` 获取主题色彩
- **状态反馈**：不同颜色代表不同的交互状态

### 4. 动画中断机制

```typescript
const interruptAnimation = () => {
    isAnimationCancelled.current = true;

    // 取消所有动画
    cancelAnimation(shakeX);
    cancelAnimation(scale);
    cancelAnimation(opacity);
    setIsAnimating(false);

    // 重置到初始状态
    shakeX.value = 0;
    scale.value = 1;
    opacity.value = 1;

    isAnimationRef.current = false;
};
```

- **动画取消**：使用 `cancelAnimation` 立即停止所有动画
- **状态重置**：将所有动画值重置到初始状态
- **标志管理**：使用 `isAnimationCancelled` 防止动画完成后的状态更新

## 使用方式

### 基础用法

```typescript
import ShakeUnlockButton from '@/note/noteReader/components/ShakeUnlockButton';

const MyComponent = () => {
    const handleShow = () => {
        console.log('按钮显示');
    };

    const handleUnlock = () => {
        console.log('解锁成功');
        // 执行解锁逻辑
    };

    const handleLock = () => {
        console.log('锁定状态');
        // 执行锁定逻辑
    };

    return (
        <ShakeUnlockButton
            longPressDuration={3000}
            onShow={handleShow}
            onUnlock={handleUnlock}
            onLock={handleLock}
        />
    );
};
```

### 自定义配置

```typescript
<ShakeUnlockButton
    longPressDuration={1500}  // 1.5秒长按
    onShow={() => setShowButton(true)}
    onUnlock={() => {
        setUnlocked(true);
        // 执行解锁后的操作
    }}
    onLock={() => {
        setUnlocked(false);
        // 执行锁定后的操作
    }}
/>
```

## 设计特点

### 1. 沉浸式交互体验
- **双层结构**：触发按钮 + 主按钮，提供渐进式交互
- **渐变背景**：使用 `LinearGradient` 创建沉浸式背景
- **流畅动画**：多种动画效果组合，提供丰富的视觉反馈

### 2. 精确的手势控制
- **区域检测**：精确的手指位置检测，超出区域自动重置
- **状态保护**：多重状态标志防止异常情况
- **动画中断**：支持动画的中断和重置

### 3. 高性能动画
- **Reanimated 3**：使用最新的 Reanimated 3 API
- **共享值**：所有动画基于共享值，性能优异
- **动画序列**：使用 `withSequence` 创建复杂的动画序列

### 4. 主题适配
- **动态颜色**：根据状态和主题动态调整颜色
- **一致性**：与整体应用主题保持一致

## 技术细节

### 1. 进度条集成

```typescript
<CircularProgressBar
    progress={progress}
    animating={true}
    size="giant"
    status="primary"
    renderIcon={renderLockButton}
    style={styles.progressBar}
/>
```

- 使用 UI Kitten 的 `CircularProgressBar` 组件
- 通过 `renderIcon` 属性将锁定按钮作为图标渲染
- 进度值通过 `setProgress` 实时更新

### 2. 状态管理策略

```typescript
const [isLocked, setIsLocked] = useState(true);
const [isAnimating, setIsAnimating] = useState(false);
const [progress, setProgress] = useState(0);
const [isUnlocking, setIsUnlocking] = useState(false);

const isAnimationRef = useRef(false);
const isAnimationCancelled = useRef(false);
const isLockedRef = useRef(true);
```

- **React State**：管理 UI 状态和进度
- **useRef**：管理动画状态和标志，避免闭包问题

### 3. 内存管理

```typescript
const stopTimer = () => {
    if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
    }
    setProgress(0);
    setIsUnlocking(false);
};
```

- 及时清理计时器，防止内存泄漏
- 重置所有相关状态

## 扩展建议

### 1. 自定义动画
可以添加更多动画效果：

```typescript
// 添加旋转动画
const rotation = useSharedValue(0);
rotation.value = withTiming(360, { duration: 1000 });
```

### 2. 声音反馈
集成声音反馈：

```typescript
import Sound from 'react-native-sound';

const playUnlockSound = () => {
    const sound = new Sound('unlock.mp3', Sound.MAIN_BUNDLE);
    sound.play();
};
```

### 3. 触觉反馈
添加触觉反馈：

```typescript
import { Vibration } from 'react-native';

const vibrate = () => {
    Vibration.vibrate(100);
};
```

## 注意事项

1. **性能考虑**：高频率的进度更新可能影响性能，注意优化
2. **动画冲突**：确保与其他动画组件没有冲突
3. **状态同步**：注意多个状态标志的同步，避免状态不一致
4. **内存管理**：及时清理计时器和动画，防止内存泄漏
5. **手势冲突**：注意与页面其他手势的冲突

## 适用场景

- **笔记阅读器**：长按解锁特殊功能
- **安全应用**：需要确认操作的安全场景
- **游戏应用**：需要长按确认的游戏操作
- **工具应用**：需要防止误操作的工具功能
- **任何需要长按确认的重要操作**

该组件提供了完整的交互式解锁体验，是构建复杂交互界面的优秀示例。
