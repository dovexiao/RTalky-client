import React, {
    forwardRef,
    useImperativeHandle,
    useCallback,
} from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    useDerivedValue,
} from 'react-native-reanimated';
import CountryCodeSelector from '../../auth/verificationLogin/components/CountryCodeSelector.tsx';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export type CountryCodeDialogAPI = {
    show: () => void;
    hide: () => void;
    getVisible: () => boolean;
};

export const Index = forwardRef<CountryCodeDialogAPI>((_, ref) => {
    const transitionValue = useSharedValue(0);
    const animationDuration: number = 300;

    const dialogWidthRatio = useSharedValue(0.9);
    const dialogHeightRatio = useSharedValue(0.9);

    // 显示弹窗
    const show = useCallback(() => {
        transitionValue.value = withTiming(
            1,
            {
                duration: animationDuration,
                easing: Easing.out(Easing.cubic),
            }
        );
    }, []);

    // 隐藏弹窗
    const hide = useCallback(() => {
        transitionValue.value = withTiming(
            0,
            {
                duration: animationDuration,
                easing: Easing.in(Easing.cubic),
            },
            (finished) => {
                if (finished) {}
            }
        );
    }, []);

    // 暴露API
    useImperativeHandle(ref, () => ({
        show,
        hide,
        getVisible: () => transitionValue.value > 0,
    }));

    const display = useDerivedValue(() => {
        return transitionValue.value > 0 ? 'flex' : 'none';
    });

    // 遮罩层动画
    const backdropStyle = useAnimatedStyle(() => ({
        opacity: transitionValue.value * 0.5,
        display: display.value,
    }));

    // 内容容器动画（居中弹出+缩放）
    const containerStyle = useAnimatedStyle(() => ({
        opacity: transitionValue.value,
        transform: [
            { scale: 0.9 + 0.1 * transitionValue.value },
            { translateY: '-50%' },
            { translateY: (1 - transitionValue.value) * 20 },
        ],
        width: SCREEN_WIDTH * (dialogWidthRatio.value ?? 0.9),
        height: SCREEN_HEIGHT * (dialogHeightRatio.value ?? 0.8),
        display: display.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        display: display.value,
    }));

    return (
        <>
            {/* 半透明遮罩层 */}
            <AnimatedPressable
                style={[styles.backdrop, backdropStyle]}
                onPress={hide}
            />

            {/* 内容容器 */}
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                ]}
            >
                {/* 国家选择器内容 */}
                <Animated.View
                    style={[
                        styles.content,
                        contentStyle,
                    ]}
                >
                    <CountryCodeSelector />
                </Animated.View>
            </Animated.View>
        </>
    );
});

// 动画组件封装
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// const AnimatedCountryCodeSelector = Animated.createAnimatedComponent(CountryCodeSelector);

// 样式定义
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 104,
    },
    container: {
        width: SCREEN_WIDTH * 0.9,
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        zIndex: 105,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

export default Index;
