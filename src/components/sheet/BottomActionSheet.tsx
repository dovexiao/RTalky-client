import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Dimensions,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    BackHandler,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomActionSheetProps {
    visible: boolean;
    children?: ReactNode;
    onRequestClose?: () => void;
    dismissOnBackdropPress?: boolean;
    dismissOnBackPress?: boolean;
    showDuration?: number;
    hideDuration?: number;
    onShowStart?: () => void;
    onShowEnd?: () => void;
    onHideStart?: () => void;
    onHideEnd?: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keepMounted?: boolean;
    showCloseButton?: boolean;
    closeButtonStyle?: StyleProp<ViewStyle>;
    closeButtonTextStyle?: StyleProp<ViewStyle>;
}

const BottomActionSheet: React.FC<BottomActionSheetProps> = ({
    visible,
    children,
    onRequestClose,
    dismissOnBackdropPress = true,
    dismissOnBackPress = true,
    showDuration = 500,
    hideDuration = 400,
    onShowStart,
    onShowEnd,
    onHideStart,
    onHideEnd,
    contentContainerStyle,
    keepMounted = false,
}) => {
    // 动画值 (0: 隐藏, 1: 显示)
    const animationProgress = useSharedValue(0);
    const isAnimatingRef = useRef(false);

    // 用于跟踪是否应该渲染（在动画完成后才真正卸载）
    const [shouldRender, setShouldRender] = useState(false);

    // 内容容器高度
    const containerHeight = useSharedValue(SCREEN_HEIGHT);

    // 遮罩层动画样式
    const backdropStyle = useAnimatedStyle(() => ({
        display: animationProgress.value > 0 ? 'flex' : 'none',
        opacity: animationProgress.value,
    }));

    // 内容容器动画样式
    const containerStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: (1 - animationProgress.value) * containerHeight.value,
        }],
    }));

    // 显示动画完成回调
    const handleShowEnd = useCallback(() => {
        isAnimatingRef.current = false;
        onShowEnd?.();
    }, [onShowEnd]);

    // 显示动画
    const show = useCallback(() => {
        if (isAnimatingRef.current || animationProgress.value > 0) {
            return;
        }
        isAnimatingRef.current = true;
        onShowStart?.();
        animationProgress.value = withTiming(1, {
            duration: showDuration,
            easing: Easing.out(Easing.cubic),
        }, (finished) => {
            if (finished) {
                runOnJS(handleShowEnd)();
            }
        });
    }, [showDuration, onShowStart, handleShowEnd, animationProgress]);

    // 隐藏动画完成回调
    const handleHideEnd = useCallback(() => {
        isAnimatingRef.current = false;
        onHideEnd?.();
        // 动画完成后，如果不是 keepMounted，则卸载组件
        if (!keepMounted) {
            setShouldRender(false);
        }
    }, [onHideEnd, keepMounted]);

    // 隐藏动画
    const hide = useCallback(() => {
        if (isAnimatingRef.current || animationProgress.value < 1) {
            return;
        }
        isAnimatingRef.current = true;
        onHideStart?.();
        animationProgress.value = withTiming(0, {
            duration: hideDuration,
            easing: Easing.in(Easing.cubic),
        }, (finished) => {
            if (finished) {
                runOnJS(handleHideEnd)();
            }
        });
    }, [hideDuration, onHideStart, handleHideEnd, animationProgress]);

    // 处理遮罩点击
    const handleBackdropPress = useCallback(() => {
        if (dismissOnBackdropPress && onRequestClose) {
            onRequestClose();
        }
    }, [dismissOnBackdropPress, onRequestClose]);

    // 处理内容容器布局测量
    const handleContainerLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        containerHeight.value = height;
    }, [containerHeight]);

    // 返回键处理
    useEffect(() => {
        if (!visible || !dismissOnBackPress) {
            return;
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (onRequestClose) {
                onRequestClose();
                return true; // 消费事件
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible, dismissOnBackPress, onRequestClose]);

    // 根据 visible 控制动画和渲染状态
    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            show();
        } else {
            hide();
        }
    }, [visible, show, hide]);

    // 根据渲染状态决定是否渲染
    if (!shouldRender) {
        return null;
    }

    return (
        <Animated.View style={[styles.root, { pointerEvents: visible ? 'auto' : 'none' }]}>
            {/* 半透明遮罩层 */}
            <AnimatedPressable
                style={[styles.backdrop, backdropStyle]}
                onPress={handleBackdropPress}
            />

            {/* 内容容器 */}
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                ]}
                onLayout={handleContainerLayout}
            >
                {/* 底部圆角容器 */}
                <View
                    style={[
                        styles.contentContainer,
                        contentContainerStyle,
                    ]}
                >
                    {children}
                </View>
            </Animated.View>
        </Animated.View>
    );
};

// 创建动画组件
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        // zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    contentContainer: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    container: {
        position: 'absolute',
        display: 'flex',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
});

export default BottomActionSheet;
