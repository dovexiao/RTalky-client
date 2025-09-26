# TiltObserver（手机倾斜检测组件）

位置：`src/note/noteReader/components/TiltObserver.tsx`

`TiltObserver` 是一个基于手机重力传感器的倾斜检测组件，通过监听设备的倾斜状态实现左右倾斜检测，并支持动态频率调整。该组件主要用于笔记阅读器的倾斜翻页功能，提供流畅的交互体验。

## 组件职责

- **倾斜检测**：基于重力传感器检测设备的左右倾斜状态
- **动态频率**：根据倾斜状态动态调整检测频率，倾斜时加速，稳定时恢复
- **状态管理**：提供启动/停止控制，支持外部组件管理检测状态
- **回调支持**：支持左倾斜、右倾斜、无倾斜等多种状态回调
- **性能优化**：使用固定频率传感器 + 时间控制实现虚拟动态频率

## 技术栈

- **react-native-reanimated**：`useAnimatedSensor` + `SensorType.GRAVITY` 重力传感器
- **React Hooks**：`useRef`、`useState`、`useEffect`、`useCallback`、`useImperativeHandle`
- **TypeScript**：完整的类型定义和接口设计
- **forwardRef**：暴露控制 API 给父组件

## API 接口

### Props

```typescript
interface TiltObserverProps {
    initialFrequency?: number;      // 初始频率 (ms)，默认200ms
    maxFrequency?: number;          // 最大频率 (ms)，默认50ms
    acceleration?: number;          // 加速度 (ms/update)，默认10ms
    tiltThreshold?: number;         // 倾斜阈值 (度)，默认1.5度
    stableTimeout?: number;         // 稳定超时 (ms)，默认1000ms
    onLeftTilt?: () => void;        // 左倾斜回调
    onRightTilt?: () => void;       // 右倾斜回调
    onNoTilt?: () => void;          // 无倾斜回调
    onStart?: () => void;           // 启动回调
    onStop?: () => void;            // 停止回调
}
```

### 暴露的 API

```typescript
export interface TiltObserverAPI {
    start: () => void;    // 启动倾斜检测
    stop: () => void;     // 停止倾斜检测
}
```

### 核心参数说明

- **initialFrequency**：初始检测频率，200ms 间隔检测一次
- **maxFrequency**：最大检测频率，倾斜时最快 50ms 检测一次
- **acceleration**：频率加速步长，每次倾斜时减少 10ms
- **tiltThreshold**：倾斜阈值，1.5度以上才认为有倾斜
- **stableTimeout**：稳定超时，无倾斜 1000ms 后恢复初始频率

## 实现原理

### 1. 传感器配置

```typescript
const gravity = useAnimatedSensor(SensorType.GRAVITY, {
    interval: Math.max(16, maxFrequency),
});
```

- 使用 `SensorType.GRAVITY` 获取重力传感器数据
- 传感器频率设置为 `maxFrequency`（50ms），确保有足够的数据
- 传感器只创建一次，避免重复创建的性能开销

### 2. 动态频率控制

```typescript
// 倾斜时加速频率
setCurrentFrequency(prev => Math.max(maxFrequency, prev - acceleration));

// 稳定时恢复频率
setCurrentFrequency(initialFrequency);
```

- **倾斜检测**：当检测到倾斜时，频率从 200ms 逐步加速到 50ms
- **稳定恢复**：无倾斜状态持续 1000ms 后，频率恢复到 200ms
- **边界控制**：频率不会低于 `maxFrequency`（50ms）

### 3. 倾斜检测算法

```typescript
const handleTiltDetection = useCallback((x: number, y: number, z: number) => {
    if (!isActiveRef.current || z > 0) {return;}

    const tiltValue = x;  // 使用 X 轴判断左右倾斜
    const absValue = Math.abs(tiltValue);

    if (absValue > tiltThreshold) {
        // 有倾斜
        if (tiltValue < 0) {
            onLeftTilt();   // 左倾斜
        } else {
            onRightTilt();  // 右倾斜
        }
    } else {
        // 无倾斜
        onNoTilt();
    }
}, [tiltThreshold, onLeftTilt, onRightTilt, onNoTilt]);
```

- **X 轴检测**：使用重力传感器的 X 轴值判断左右倾斜
- **阈值判断**：绝对值大于 1.5 度才认为有倾斜
- **方向判断**：负值为左倾斜，正值为右倾斜
- **Z 轴过滤**：Z > 0 时跳过检测（设备可能倒置）

### 4. 时间控制机制

```typescript
useEffect(() => {
    if (!isActiveRef.current) {return;}

    frequencyTimerRef.current = setInterval(() => {
        const { x, y, z } = gravity.sensor.value;
        handleTiltDetection(x, y, z);
    }, currentFrequency);

    return () => {
        if (frequencyTimerRef.current) {
            clearTimeout(frequencyTimerRef.current);
            frequencyTimerRef.current = null;
        }
    };
}, [currentFrequency]);
```

- **定时器控制**：使用 `setInterval` 根据 `currentFrequency` 控制检测频率
- **依赖更新**：`currentFrequency` 变化时重新创建定时器
- **资源清理**：组件卸载或频率变化时清理旧定时器

## 使用方式

### 基础用法

```typescript
import TiltObserver, { TiltObserverAPI } from '@/note/noteReader/components/TiltObserver';

const MyComponent = () => {
    const tiltObserverRef = useRef<TiltObserverAPI>(null);

    const handleLeftTilt = () => {
        console.log('向左倾斜');
        // 执行左倾斜操作，如翻到上一页
    };

    const handleRightTilt = () => {
        console.log('向右倾斜');
        // 执行右倾斜操作，如翻到下一页
    };

    const handleNoTilt = () => {
        console.log('无倾斜');
        // 执行无倾斜操作
    };

    const startTiltDetection = () => {
        tiltObserverRef.current?.start();
    };

    const stopTiltDetection = () => {
        tiltObserverRef.current?.stop();
    };

    return (
        <View>
            <TiltObserver
                ref={tiltObserverRef}
                onLeftTilt={handleLeftTilt}
                onRightTilt={handleRightTilt}
                onNoTilt={handleNoTilt}
                onStart={() => console.log('倾斜检测启动')}
                onStop={() => console.log('倾斜检测停止')}
            />
            <Button title="开始检测" onPress={startTiltDetection} />
            <Button title="停止检测" onPress={stopTiltDetection} />
        </View>
    );
};
```

### 自定义配置

```typescript
<TiltObserver
    ref={tiltObserverRef}
    initialFrequency={300}      // 初始频率 300ms
    maxFrequency={30}           // 最大频率 30ms
    acceleration={15}           // 加速步长 15ms
    tiltThreshold={2.0}         // 倾斜阈值 2.0度
    stableTimeout={1500}        // 稳定超时 1.5秒
    onLeftTilt={handleLeftTilt}
    onRightTilt={handleRightTilt}
    onNoTilt={handleNoTilt}
/>
```

### 在笔记阅读器中的应用

```typescript
const NoteReader = () => {
    const tiltObserverRef = useRef<TiltObserverAPI>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleLeftTilt = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleRightTilt = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        // 进入阅读器时启动倾斜检测
        tiltObserverRef.current?.start();
        
        return () => {
            // 退出时停止检测
            tiltObserverRef.current?.stop();
        };
    }, []);

    return (
        <View>
            <TiltObserver
                ref={tiltObserverRef}
                onLeftTilt={handleLeftTilt}
                onRightTilt={handleRightTilt}
            />
            <Text>第 {currentPage + 1} 页</Text>
        </View>
    );
};
```

## 设计特点

### 1. 性能优化策略
- **固定传感器**：传感器只创建一次，避免重复创建的性能开销
- **虚拟频率**：通过定时器控制实现动态频率，而不是重新创建传感器
- **状态管理**：使用 `useRef` 管理状态，避免不必要的重新渲染

### 2. 智能频率调整
- **倾斜加速**：检测到倾斜时自动提高检测频率，提供更流畅的响应
- **稳定恢复**：无倾斜状态持续一定时间后恢复初始频率，节省资源
- **边界控制**：频率有上下限，避免过度消耗资源或响应过慢

### 3. 精确的倾斜检测
- **阈值控制**：可配置的倾斜阈值，避免轻微抖动误触发
- **方向判断**：基于 X 轴值精确判断左右倾斜方向
- **状态过滤**：过滤异常状态（如设备倒置）

### 4. 灵活的控制接口
- **命令式 API**：通过 ref 暴露 `start`/`stop` 方法
- **回调支持**：丰富的事件回调，支持各种倾斜状态
- **参数化配置**：所有关键参数都可配置

## 技术细节

### 1. 传感器数据获取

```typescript
const { x, y, z } = gravity.sensor.value;
```

- **X 轴**：左右倾斜，负值表示左倾斜，正值表示右倾斜
- **Y 轴**：前后倾斜，当前未使用
- **Z 轴**：上下方向，用于过滤异常状态

### 2. 状态管理策略

```typescript
const isActiveRef = useRef(false);
const stableTimerRef = useRef<NodeJS.Timeout | null>(null);
const frequencyTimerRef = useRef<NodeJS.Timeout | null>(null);
```

- **isActiveRef**：控制组件是否处于活跃状态
- **stableTimerRef**：管理稳定状态的计时器
- **frequencyTimerRef**：管理检测频率的计时器

### 3. 内存管理

```typescript
const stop = useCallback(() => {
    isActiveRef.current = false;
    setCurrentFrequency(0);
    if (stableTimerRef.current) {
        clearTimeout(stableTimerRef.current);
        stableTimerRef.current = null;
    }
    onStop();
}, [onStop]);
```

- 停止时清理所有计时器
- 重置状态标志
- 调用停止回调

## 扩展建议

### 1. 多轴检测
可以扩展支持前后倾斜：

```typescript
const handleTiltDetection = (x: number, y: number, z: number) => {
    // 左右倾斜
    if (Math.abs(x) > tiltThreshold) {
        x < 0 ? onLeftTilt() : onRightTilt();
    }
    
    // 前后倾斜
    if (Math.abs(y) > tiltThreshold) {
        y < 0 ? onForwardTilt() : onBackwardTilt();
    }
};
```

### 2. 手势组合
结合其他手势实现复杂交互：

```typescript
const handleLeftTilt = () => {
    if (isShaking) {
        // 倾斜 + 摇晃 = 特殊操作
        performSpecialAction();
    } else {
        // 普通倾斜操作
        turnPageLeft();
    }
};
```

### 3. 灵敏度调节
添加动态灵敏度调节：

```typescript
const [sensitivity, setSensitivity] = useState(1.5);

const handleTiltDetection = (x: number, y: number, z: number) => {
    const threshold = tiltThreshold * sensitivity;
    if (Math.abs(x) > threshold) {
        // 处理倾斜
    }
};
```

## 注意事项

1. **权限要求**：需要设备支持重力传感器
2. **性能考虑**：高频率检测会消耗更多电量
3. **状态同步**：注意多个计时器的状态同步
4. **内存管理**：及时清理计时器，防止内存泄漏
5. **设备兼容**：不同设备的传感器精度可能不同

## 适用场景

- **笔记阅读器**：倾斜翻页功能
- **图片查看器**：倾斜切换图片
- **游戏应用**：倾斜控制游戏角色
- **工具应用**：倾斜触发特定功能
- **任何需要倾斜交互的应用**

该组件提供了完整的手机倾斜检测能力，是构建创新交互体验的重要工具。
