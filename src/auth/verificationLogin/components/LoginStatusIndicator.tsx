import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import {Spinner, useTheme} from '@ui-kitten/components';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing, useDerivedValue,
} from 'react-native-reanimated';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

export const LoginStatusIndicator: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isCodeComplete = useVerificationLoginStore(state => state.isCodeComplete);
    const resetForm = useVerificationLoginStore(state => state.resetForm);
    const animationDuration: number = 300;
    const themes = useTheme();

    // 动画值
    const transitionValue = useSharedValue(0);

    // Mock 异步登录函数
    const mockLogin = async (): Promise<void> => {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                console.log('登录完成');
                transitionValue.value = withTiming(
                    0,
                    {
                        duration: animationDuration,
                        easing: Easing.in(Easing.cubic),
                    },
                );
                runOnJS(resetForm);
                clearTimeout(timer);
                navigation.replace('AppMain');
                resolve();
            }, 3000); // 模拟3秒登录过程
        });
    };

    // 当验证码完成时，触发登录和显示动画
    useEffect(() => {
        if (isCodeComplete) {
            // 显示动画
            transitionValue.value = withTiming(
                1,
                {
                    duration: animationDuration,
                    easing: Easing.out(Easing.cubic),
                }
            );

            mockLogin();
        }
    }, [isCodeComplete, transitionValue]);

    // 动画样式
    const display = useDerivedValue(() => {
        return transitionValue.value > 0 ? 'flex' : 'none';
    });

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: transitionValue.value,
        transform: [
            { scale: 0.9 + 0.1 * transitionValue.value },
            { translateY: '-50%' },
            { translateY: (1 - transitionValue.value) * 5 },
        ],
        display: display.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Spinner size="small" />
            <Text style={[styles.text, { color: themes['color-primary-500'] }]}>登录中...</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    text: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
});
