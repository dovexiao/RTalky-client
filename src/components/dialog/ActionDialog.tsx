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
import { Button, Text } from '@ui-kitten/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ActionDialogProps {
    visible: boolean;
    children?: ReactNode;
    onRequestClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showDuration?: number;
    hideDuration?: number;
    onShowStart?: () => void;
    onShowEnd?: () => void;
    onHideStart?: () => void;
    onHideEnd?: () => void;
    contentContainerStyle?: StyleProp<ViewStyle>;
    footerContainerStyle?: StyleProp<ViewStyle>;
    dialogStyle?: StyleProp<ViewStyle>;
    keepMounted?: boolean;
    dismissOnBackdropPress?: boolean;
    dismissOnBackPress?: boolean;
    widthRatio?: number;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
    visible,
    children,
    onRequestClose,
    onConfirm,
    onCancel,
    confirmText = '确定',
    cancelText = '取消',
    showDuration = 500,
    hideDuration = 400,
    onShowStart,
    onShowEnd,
    onHideStart,
    onHideEnd,
    contentContainerStyle,
    footerContainerStyle,
    dialogStyle,
    keepMounted = false,
    dismissOnBackdropPress = true,
    dismissOnBackPress = true,
    widthRatio = 0.8,
}) => {
    // 动画进度 (0: 隐藏, 1: 显示)
    const animationProgress = useSharedValue(0);
    const isAnimatingRef = useRef(false);

    // 用于跟踪是否应该渲染（在动画完成后才真正卸载）
    const [shouldRender, setShouldRender] = useState(false);

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

    // 处理确认操作
    const handleConfirm = useCallback(() => {
        onConfirm?.();
        if (onRequestClose) {
            onRequestClose();
        }
    }, [onConfirm, onRequestClose]);

    // 处理取消操作
    const handleCancel = useCallback(() => {
        onCancel?.();
        if (onRequestClose) {
            onRequestClose();
        }
    }, [onCancel, onRequestClose]);

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

    // 遮罩层动画样式
    const backdropStyle = useAnimatedStyle(() => ({
        display: animationProgress.value > 0 ? 'flex' : 'none',
        opacity: animationProgress.value,
    }));

    // 对话框容器动画样式
    const containerStyle = useAnimatedStyle(() => ({
        display: animationProgress.value > 0 ? 'flex' : 'none',
        opacity: animationProgress.value,
        transform: [
            { scale: 0.9 + 0.1 * animationProgress.value },
            { translateY: (1 - animationProgress.value) * 20 },
        ],
    }));

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

            {/* 对话框容器 */}
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                    { width: SCREEN_WIDTH * widthRatio },
                    dialogStyle,
                ]}
            >
                {/* 内容区域 */}
                <View
                    style={[
                        styles.content,
                        // { backgroundColor: themeColors['bg-200'] },
                        contentContainerStyle,
                    ]}
                >
                    {children}
                </View>

                {/* 操作按钮组 */}
                <View
                    style={[
                        styles.footer,
                        footerContainerStyle,
                        // { backgroundColor: themeColors['bg-200'] },
                    ]}
                >
                    <Button
                        appearance="ghost"
                        style={styles.button}
                        onPress={handleCancel}
                    >
                        <Text style={styles.buttonText}>{cancelText}</Text>
                    </Button>
                    <Button
                        style={[styles.button, styles.confirmButton]}
                        onPress={handleConfirm}
                    >
                        <Text style={[styles.buttonText, styles.confirmText]}>
                            {confirmText}
                        </Text>
                    </Button>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

// 创建动画组件
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        position: 'absolute',
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },
    content: {
        padding: 20,
        backgroundColor: '#FFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 0,
    },
    confirmButton: {
        borderRadius: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    confirmText: {
        color: '#FFF',
    },
});

export default ActionDialog;
