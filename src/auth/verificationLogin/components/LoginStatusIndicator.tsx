import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Spinner, useTheme } from '@ui-kitten/components';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    useDerivedValue,
} from 'react-native-reanimated';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { LoginService } from '@/auth/services';
import UserAuthManager from '@/utils/UserAuthManager';
import { useAuthStore } from '@/auth/stores';
import { useNavigationStore } from '@navigation/stores';

export const LoginStatusIndicator: React.FC = () => {
    // 只订阅需要的状态，避免不必要的重渲染
    const isCodeComplete = useVerificationLoginStore(state => state.isCodeComplete);

    // 使用ref来避免函数重渲染
    const isLoadingRef = useRef(false);
    const animationDuration = 300;

    // 状态管理
    const [statusText, setStatusText] = useState('');

    const themes = useTheme();

    // 动画值
    const transitionValue = useSharedValue(0);

    // 使用useCallback缓存函数，避免重渲染
    const handleLoginSuccess = useCallback((loginData: any) => {
        setStatusText('登录成功');

        // 存储用户认证信息到UserAuthManager
        const saveAuthData = async () => {
            try {
                const authData = {
                    phoneNumber: loginData.phoneNumber,
                    sessionToken: loginData.sessionToken,
                };

                const saveSuccess = await UserAuthManager.saveUserAuthComplete(
                    loginData.userId,
                    authData
                );

                if (!saveSuccess) {
                    console.error('保存用户认证信息失败');
                }
            } catch (error) {
                console.error('保存用户认证信息异常:', error);
            }
        };

        // 同步执行存储和动画
        saveAuthData();

        // 延迟执行动画和导航（同步延迟）
        setTimeout(() => {
            const setInitialRouteName = useNavigationStore.getState().setInitialRouteName;
            const handleLogin = useAuthStore.getState().handleLogin;
            const resetForm = useVerificationLoginStore.getState().resetForm;

            setInitialRouteName('AppMain');
            handleLogin(loginData.userId, loginData.userProfile);
            resetForm();
        }, 1500);
    }, []);

    const handleLoginError = useCallback((error: any) => {
        console.error('登录失败:', error);
        setStatusText('登录失败');

        // 延迟执行动画和重置
        setTimeout(() => {
            transitionValue.value = withTiming(
                0,
                {
                    duration: animationDuration,
                    easing: Easing.in(Easing.cubic),
                },
                () => {
                    // runOnJS(resetForm)();
                }
            );
        }, 1000);
    }, [transitionValue]);

    // 登录函数
    const login = useCallback(async (): Promise<void> => {
        // 防止重复执行
        if (isLoadingRef.current) {
            return;
        }

        try {
            isLoadingRef.current = true;
            setStatusText('登录中...');

            const { formattedNumber, smsCode, isAgreedToTerms } = useVerificationLoginStore.getState();

            const response = await LoginService.smsLogin(
                formattedNumber,
                smsCode,
                isAgreedToTerms,
            );

            if (response.success) {
                handleLoginSuccess(response.data);
            } else {
                handleLoginError(new Error('登录响应失败'));
            }
        } catch (error) {
            handleLoginError(error);
        } finally {
            isLoadingRef.current = false;
        }
    }, [handleLoginSuccess, handleLoginError]);

    // 当验证码完成时，触发登录和显示动画
    useEffect(() => {
        if (isCodeComplete && !isLoadingRef.current) {
            // 显示动画
            transitionValue.value = withTiming(
                1,
                {
                    duration: animationDuration,
                    easing: Easing.out(Easing.cubic),
                }
            );

            // 执行登录
            login();
        }
    }, [isCodeComplete, login, animationDuration, transitionValue]);

    // 动画样式 - 使用useDerivedValue和useAnimatedStyle缓存
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
    }), [transitionValue, display]);

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {isLoadingRef.current && <Spinner size="small"/>}
            <Text style={[styles.text, { color: themes['color-primary-500'] }]}>{statusText}</Text>
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
