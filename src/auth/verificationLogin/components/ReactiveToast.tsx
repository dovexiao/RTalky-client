import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

interface ReactiveToastProps {
    // 外部传入的依赖状态对象
    dependencies: Record<string, any>;

    // 计算方法，通过对象解构接收参数
    render: (deps: Record<string, any>) => React.ReactNode;
    shouldShow: (deps: Record<string, any>) => boolean;
    // animation?: (deps: Record<string, any>) => string;
    position?: (deps: Record<string, any>) => string;
    autoClose?: (deps: Record<string, any>) => number | false;

    // 生命周期回调
    onShow?: () => void;
    onHide?: () => void;
}

const { width } = Dimensions.get('window');

export const ReactiveToast: React.FC<ReactiveToastProps> = ({
    dependencies,
    render,
    shouldShow,
    // animation = () => 'fadeIn',
    position = () => 'center',
    autoClose = () => 3000,
    onShow,
    onHide,
}) => {
    // 计算各种状态
    const shouldShowResult: boolean = useMemo(
        () => shouldShow(dependencies),
        [shouldShow, dependencies]
    );

    // const animationResult = useMemo(
    //     () => animation(dependencies),
    //     [animation, animationDeps]
    // );

    const positionResult: string = useMemo(
        () => position(dependencies),
        [position, dependencies]
    );

    const autoCloseResult: number | false = useMemo(
        () => autoClose(dependencies),
        [autoClose, dependencies]
    );

    const contentResult: React.ReactNode = useMemo(
        () => render(dependencies),
        [render, dependencies]
    );

    // 状态管理
    const [isVisible, setIsVisible] = useState(false);
    const [currentContent, setCurrentContent] = useState<React.ReactNode>(null);
    const [positionStyle, setPositionStyle] = useState<any>(styles.center);

    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevVisibleRef = useRef(false);
    const prevPositionRef = useRef('center');

    // 动画值
    const transitionValue = useSharedValue(0);

    // 细粒度更新
    useEffect(() => {
        setIsVisible(shouldShowResult);
    }, [shouldShowResult]);

    // 位置变化处理：先隐藏再在新位置展示
    useEffect(() => {
        if (isVisible && prevPositionRef.current !== positionResult) {
            // 位置变化，先隐藏
            transitionValue.value = withTiming(0, { duration: 150 }, (finished) => {
                if (finished) {
                    runOnJS(handlePositionChange)();
                    transitionValue.value = withTiming(1, { duration: 300 });
                }
            });
        } else {
            setPositionStyle(getPositionStyle(positionResult));
            setCurrentContent(contentResult);
            prevPositionRef.current = positionResult;
        }
    }, [positionResult, contentResult]);

    const handlePositionChange = useCallback(() => {
        prevPositionRef.current = positionResult;
        const style = getPositionStyle(positionResult);
        setPositionStyle(style);
        setCurrentContent(contentResult);
    }, [positionResult, contentResult]);

    // 显隐动画处理
    useEffect(() => {
        if (isVisible && !prevVisibleRef.current) {
            transitionValue.value = withTiming(1, { duration: 300 }, (finished) => {
                if (finished && onShow) {
                    runOnJS(onShow)();
                }
            });
        } else if (!isVisible && prevVisibleRef.current) {
            transitionValue.value = withTiming(0, { duration: 300 }, (finished) => {
                if (finished && onHide) {
                    runOnJS(onHide)();
                }
            });
        }

        prevVisibleRef.current = isVisible;
    }, [isVisible]);

    // 自动关闭逻辑
    useEffect(() => {
        if (isVisible && autoCloseResult !== false && autoCloseResult > 0) {
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
            }

            autoCloseTimerRef.current = setTimeout(() => {
                setIsVisible(false);
            }, autoCloseResult);
        }

        return () => {
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
            }
        };
    }, [isVisible, autoCloseResult]);

    // 手动关闭处理
    // const handleClose = () => {
    //     // 清除自动关闭定时器
    //     if (autoCloseTimerRef.current) {
    //         clearTimeout(autoCloseTimerRef.current);
    //         autoCloseTimerRef.current = null;
    //     }
    //     setIsVisible(false);
    // };

    // 动画样式
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: transitionValue.value,
            transform: [
                { scale: 0.9 + 0.1 * transitionValue.value },
                { translateY: positionResult === 'top' || positionResult === 'bottom' ? 0 : '-50%' },
                // { translateY: '-50%' },
                { translateY: (1 - transitionValue.value) * 20 },
            ],
            display: transitionValue.value > 0 ? 'flex' : 'none',
        };
    });

    return (
        <Animated.View
            style={[
                styles.container,
                positionStyle,
                animatedStyle,
            ]}
        >
            {currentContent}
        </Animated.View>
    );
};

// 获取位置样式
const getPositionStyle = (positionValue: string) => {
    switch (positionValue) {
        case 'center':
            return styles.center;
        case 'top':
            return styles.top;
        case 'bottom':
            return styles.bottom;
        case 'left':
            return styles.left;
        case 'right':
            return styles.right;
        default:
            return styles.center;
    }
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 8,
        // minWidth: width * 0.3,
        maxWidth: width * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 5,
        overflow: 'hidden',
        top: undefined,
        left: undefined,
        bottom: undefined,
        right: undefined,
    },
    center: {
        top: '50%',
        left: undefined,
        bottom: undefined,
        right: undefined,
        alignSelf: 'center',
    },
    top: {
        top: 25,
        left: undefined,
        bottom: undefined,
        right: undefined,
        alignSelf: 'center',
    },
    bottom: {
        top: undefined,
        left: undefined,
        bottom: 25,
        right: undefined,
        alignSelf: 'center',
    },
    left: {
        top: '50%',
        left: 20,
        bottom: undefined,
        right: undefined,
        alignSelf: 'center',
    },
    right: {
        top: '50%',
        left: undefined,
        bottom: undefined,
        right: 20,
        alignSelf: 'center',
    },
});
