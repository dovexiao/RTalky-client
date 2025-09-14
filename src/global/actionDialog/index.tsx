import { Button, Text } from '@ui-kitten/components';
import React, {
    forwardRef,
    useState,
    useImperativeHandle,
    useCallback,
    ReactNode,
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
    runOnJS,
} from 'react-native-reanimated';
import { useUnifiedTheme } from '@/contexts';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// 类型定义
export type ActionDialogConfig = {
    content: ReactNode;
    dialogWidthRatio?: number;
    contentMinHeightRatio?: number;
    scrollable?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export type ActionDialogAPI = {
    show: (config: ActionDialogConfig) => void;
    hide: () => void;
    getVisible: () => boolean;
};

const ActionDialog = forwardRef<ActionDialogAPI>((_, ref) => {
    const [config, setConfig] = useState<ActionDialogConfig | null>(null);
    const transitionValue = useSharedValue(0);
    const animationDuration: number = 300;

    // const dialogWidthRatio = useDerivedValue(() => {
    //     return config?.dialogWidthRatio;
    // });
    //
    // const contentMinHeightRatio = useDerivedValue(() => {
    //     return config?.contentMinHeightRatio;
    // });

    const dialogWidthRatio = useSharedValue(0.8);
    const contentMinHeightRatio = useSharedValue(0.4);

    const { themeColors } = useUnifiedTheme();

    // 显示弹窗
    const show = useCallback((newConfig: ActionDialogConfig) => {
        setConfig(newConfig);

        dialogWidthRatio.value = newConfig.dialogWidthRatio ?? 0.8;
        contentMinHeightRatio.value = newConfig.contentMinHeightRatio ?? 0.4;

        transitionValue.value = withTiming(1, {
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
        });
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
                if (finished) {
                    runOnJS(setConfig)(null);
                }
            }
        );
    }, []);

    // 处理确认操作
    const handleConfirm = () => {
        config?.onConfirm?.();
        hide();
    };

    // 处理取消操作
    const handleCancel = () => {
        config?.onCancel?.();
        hide();
    };

    // 暴露API
    useImperativeHandle(ref, () => ({
        show,
        hide,
        getVisible: () => transitionValue.value > 0,
    }));

    const display = useDerivedValue(() => {
        // console.log('display', transitionValue.value);
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
            { translateY:  '-50%' },
            { translateY: (1 - transitionValue.value) * 20 },
        ],
        width: SCREEN_WIDTH *  (dialogWidthRatio.value ?? 0.8),
        display: display.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        display: display.value,
        // opacity: transitionValue.value,
    }));

    const scrollContentStyle = useAnimatedStyle(() => ({
        height: SCREEN_HEIGHT * (contentMinHeightRatio.value ?? 0.4),
    }));

    // if (!config) {
    //     return null;
    // }

    return (
        <>
            {/* 半透明遮罩层 */}
            <AnimatedPressable
                style={[styles.backdrop, backdropStyle]}
                onPress={handleCancel}
            />

            {/* 内容容器 */}
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                    { backgroundColor: themeColors['bg-200'] },
                ]}
            >
                {config?.scrollable ?
                    <Animated.ScrollView
                        style={[
                            styles.content,
                            contentStyle,
                            scrollContentStyle,
                            { backgroundColor: themeColors['bg-200'] },
                        ]}
                    >
                        {config?.content}
                    </Animated.ScrollView> :
                    <Animated.View
                        style={[
                            styles.content,
                            contentStyle,
                            { backgroundColor: themeColors['bg-200'] },
                        ]}
                    >
                        {config?.content}
                    </Animated.View>
                }

                {/* 操作按钮组 */}
                <Animated.View
                    style={[
                        styles.footer,
                        contentStyle,
                        { backgroundColor: themeColors['bg-200'] },
                    ]}
                >
                    <Button
                        appearance={'ghost'}
                        style={styles.button}
                        onPress={handleCancel}
                    >
                        <Text style={styles.buttonText}>取消</Text>
                    </Button>
                    <Button
                        style={[styles.button, styles.confirmButton]}
                        onPress={handleConfirm}
                    >
                        <Text style={[styles.buttonText, styles.confirmText]}>确定</Text>
                    </Button>
                </Animated.View>
            </Animated.View>
        </>
    );
});

// 动画组件封装
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// 样式定义
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 103,
    },
    container: {
        width: SCREEN_WIDTH * 0.8,
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        zIndex: 104,
        backgroundColor: '#FFF',
    },
    content: {
        backgroundColor: '#FFF',
    },
    footer: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 0,
    },
    confirmButton: {
        borderRadius: 0,
        // marginLeft: 16,
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
