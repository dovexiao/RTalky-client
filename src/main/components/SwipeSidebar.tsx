import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
    Dimensions,
    Pressable,
    // StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    // withTiming,
    // Easing,
} from 'react-native-reanimated';
import { PanSwipeResponder } from '@/main/components';
import { useUnifiedTheme } from '@contexts/UnifiedThemeContext.tsx';
// import { useBackgroundSettingsStore } from '@/center/personCenter/stores';
// import { useTheme } from '@contexts/ThemeContext';

// 定义交互容器暴露的API
export type SwipeSidebarAPI = {
    show: () => void;
    hide: () => void;
    getVisible: () => boolean;
};

// 通用滑动交互容器：从左侧滑出，支持手势滑动关闭
export const SwipeSidebar = forwardRef<SwipeSidebarAPI, { children: React.ReactNode }>(({ children }, ref) => {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const sidebarWidth = screenWidth * 0.9;
    // const sidebarWidth = screenWidth;

    // 动画相关共享值
    const positionX = useSharedValue<number>(-sidebarWidth); // 侧边栏X轴位置（-width为隐藏，0为显示）
    const visible = useSharedValue(false); // 控制显示/隐藏状态

    // 背景设置动画相关共享值
    // const backgroundScale = useSharedValue(1);
    // const backgroundTranslateXProgress = useSharedValue(0); // 0 表示原始位置，1 表示目标位置
    // const backgroundTranslateY = useSharedValue(0);

    // const { theme } = useTheme();
    const { specialThemeColors } = useUnifiedTheme();
    // const { isVisible: isBackgroundSettingsVisible } = useBackgroundSettingsStore();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const onChange = ({ window }: { window: { width: number, height: number } }) => {
            setScreenWidth(window.width);
        };

        const subscription = Dimensions.addEventListener('change', onChange);

        return () => {
            subscription?.remove(); // 使用返回的 remove 方法
        };
    }, []);

    // const { width } = Dimensions.get('window');
    // const targetScale = (width - 30) / width / 2;
    // const targetTranslateY = -((StatusBar.currentHeight || 0) + 40 + 75);

    // 监听背景设置状态变化
    // useEffect(() => {
    //     if (isBackgroundSettingsVisible) {
    //         // 缩小、平移并降低透明度
    //         backgroundScale.value = withTiming(targetScale, {
    //             duration: 1000,
    //             easing: Easing.out(Easing.linear),
    //         });
    //         backgroundTranslateXProgress.value = withTiming(1, {
    //             duration: 1000,
    //             easing: Easing.out(Easing.linear),
    //         });
    //         backgroundTranslateY.value = withTiming(targetTranslateY, {
    //             duration: 1000,
    //             easing: Easing.out(Easing.linear),
    //         });
    //     } else {
    //         // 恢复原始状态
    //         backgroundScale.value = withSpring(1, {
    //             damping: 15,
    //             mass: 0.5,
    //         });
    //         backgroundTranslateXProgress.value = withSpring(0, {
    //             damping: 15,
    //             mass: 0.5,
    //         });
    //         backgroundTranslateY.value = withSpring(0, {
    //             damping: 15,
    //             mass: 0.5,
    //         });
    //     }
    // }, [isBackgroundSettingsVisible]);

    // 控制遮罩层显示逻辑（根据位置动态切换）
    const display = useDerivedValue(() => {
        return visible.value ? 'flex' : 'none';
    });

    // 显示侧边栏（带动画）
    const show = () => {
        visible.value = true;
        positionX.value = withSpring(0, {
            mass: 1,
            stiffness: 100,
            damping: 20,
        });
    };

    // 隐藏侧边栏（带动画）
    const hide = () => {
        positionX.value = withSpring(-sidebarWidth, {
            mass: 1,
            stiffness: 100,
            damping: 15,
        });
        // 动画结束后隐藏（延迟500ms匹配动画时长）
        const timer = setTimeout(() => {
            visible.value = false;
            clearTimeout(timer);
        }, 500);
    };

    // 获取当前显示状态
    const getVisible = () => visible.value;

    // 暴露API给父组件
    useImperativeHandle(ref, () => ({
        show,
        hide,
        getVisible,
    }));

    // 侧边栏容器动画样式
    const containerAnimatedStyle = useAnimatedStyle(() => {
        // 根据主题和进度计算 translateX 值
        // const translateXValue = theme === 'light'
        //     ? backgroundTranslateXProgress.value * -55 // 从 0 到 -50%
        //     : backgroundTranslateXProgress.value * 55; // 从 0 到 +50%
        //
        // const extraTranslateXValue = theme === 'light'
        //     ? backgroundTranslateXProgress.value * -35
        //     : backgroundTranslateXProgress.value * 35;

        return {
            width: sidebarWidth,
            // opacity: interpolate(backgroundScale.value, [targetScale, 0.5], [0, 1], 'clamp'),
            transform: [
                { translateX: positionX.value },
                // { scale: backgroundScale.value },
                // { translateX: `${translateXValue}%` },
                // { translateX: extraTranslateXValue },
                // { translateY: backgroundTranslateY.value },
            ],
        };
    });

    // 遮罩层动画样式（透明度随侧边栏位置变化和背景设置状态）
    const backdropAnimatedStyle = useAnimatedStyle(() => {
        const sidebarOpacity = interpolate(positionX.value, [-sidebarWidth, 0], [0, 1]);
        // const combinedOpacity = sidebarOpacity * interpolate(backgroundScale.value, [targetScale, 0.5], [0, 1], 'clamp');

        // 根据主题和进度计算 translateX 值
        // const translateXValue = theme === 'light'
        //     ? backgroundTranslateXProgress.value * -50 // 从 0 到 -50%
        //     : backgroundTranslateXProgress.value * 50; // 从 0 到 +50%
        //
        // const extraTranslateXValue = theme === 'light'
        //     ? backgroundTranslateXProgress.value * -10
        //     : backgroundTranslateXProgress.value * 10;

        return {
            display: display.value,
            // opacity: combinedOpacity,
            opacity: sidebarOpacity,
            // transform: [
            //     { scale: backgroundScale.value },
            //     { translateX: `${translateXValue}%` },
            //     { translateX: extraTranslateXValue },
            //     { translateY: backgroundTranslateY.value },
            // ],
        };
    });

    return (
        <>
            {/* 半透明遮罩层：点击关闭侧边栏 */}
            <AnimatedPressable
                style={[styles.backdrop, backdropAnimatedStyle]}
                onPress={hide}
            />

            {/* 侧边栏主体：包含手势处理和传入的内容 */}
            <Animated.View style={[
                styles.container,
                containerAnimatedStyle,
                { backgroundColor: specialThemeColors['bg-100'] },
            ]}>
                {/* 提升PanSwipeResponder层级：包裹所有内容，处理左滑关闭手势 */}
                <PanSwipeResponder
                    onSwipeLeft={hide} // 向左滑动时关闭
                    threshold={60} // 触发滑动的最小距离
                    minVelocity={0.7} // 触发滑动的最小速度
                >
                    {/* 预留状态栏高度 */}
                    {/*<View style={{ height: StatusBar.currentHeight }} />*/}
                    {/* 传入的子内容（如个人中心具体内容） */}
                    <View style={styles.contentContainer}>
                        {children}
                    </View>
                </PanSwipeResponder>
            </Animated.View>
        </>
    );
});

// 动画化Pressable组件
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// 基础样式
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        height: '100%',
        zIndex: 100,
        // borderRightWidth: 1,
        // borderColor: '#ddd',
    },
    contentContainer: {
        flex: 1,
        // paddingHorizontal: 20,
        // paddingTop: 20,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99,
    },
});
