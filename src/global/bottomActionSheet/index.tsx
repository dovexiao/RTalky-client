import React, {
    forwardRef,
    ReactNode,
    useCallback,
    useImperativeHandle,
    useState,
} from 'react';
import {
    Dimensions,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    runOnJS,
    useDerivedValue,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type BottomActionSheetAPI = {
    show: (content: ReactNode) => void;
    hide: () => void;
    getVisible: () => boolean;
};

type BottomActionSheetProps = {
    contentContainerStyle?: StyleProp<ViewStyle>;
    backdropOpacity?: number;
    animationDuration?: number;
    onDismiss?: () => void;
};

const BottomActionSheet = forwardRef<
    BottomActionSheetAPI,
    BottomActionSheetProps
>((props, ref) => {
    const {
        contentContainerStyle,
        backdropOpacity = 0.5,
        animationDuration = 400,
        onDismiss,
    } = props;

    // 状态管理弹窗内容
    const [content, setContent] = useState<ReactNode | null>(null);

    // 动画值 (0: 隐藏, 1: 显示)
    const transitionValue = useSharedValue(0);

    const display = useDerivedValue(() => {
        // console.log('display', transitionValue.value);
        return transitionValue.value > 0 ? 'flex' : 'none';
    });

    // 遮罩层动画样式
    const backdropStyle = useAnimatedStyle(() => ({
        display: display.value,
        opacity: transitionValue.value * backdropOpacity,
    }));

    // 内容容器动画样式
    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: (1 - transitionValue.value) * SCREEN_HEIGHT,
            },
        ],
    }));

    // 显示操作栏
    const show = useCallback((newContent: ReactNode) => {
        if (transitionValue.value > 0) {
            return;
        }
        setContent(newContent);
        transitionValue.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
    }, [animationDuration]);

    // 隐藏操作栏
    const hide = useCallback(() => {
        if (transitionValue.value < 1) {
            return;
        }
        transitionValue.value = withTiming(
            0,
            {
                duration: animationDuration,
                easing: Easing.in(Easing.cubic),
            },
            (finished) => {
                if (finished) {
                    // 动画完成后清空内容
                    runOnJS(setContent)(null);
                    if (onDismiss) {
                        runOnJS(onDismiss)();
                    }
                }
            }
        );
    }, [animationDuration, onDismiss]);

    // 暴露API给父组件
    useImperativeHandle(ref, () => ({
        show,
        hide,
        getVisible() {
            return transitionValue.value > 0;
        },
    }));

    return (
        <>
             {/*半透明遮罩层*/}
            <AnimatedPressable
                style={[styles.backdrop, backdropStyle]}
                onPress={hide}
            />

            {/*/!* 内容容器 *!/*/}
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                    contentContainerStyle,
                ]}
            >
                {/* 顶部圆角容器 */}
                <View style={styles.content}>
                    {content ? content : <></>}
                </View>
            </Animated.View>
        </>
    );
});

// 创建动画组件
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 101,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 102,
        // paddingHorizontal: 12,
        // paddingBottom: 24,
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
});

export default BottomActionSheet;
