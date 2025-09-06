import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { SmsService } from '@/auth/verificationLogin/services';

const LoadingIndicator = (): React.ReactElement => (
    <Spinner size="small" status="control" />
);

const VerifyLoginButton: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isFormValid = useVerificationLoginStore(state => state.isFormValid);
    const validateAndFormatPhone = useVerificationLoginStore(state => state.validateAndFormatPhone);
    const setCodeDigits = useVerificationLoginStore(state => state.setCodeDigits);

    const [isWaiting, setIsWaiting] = useState(false);

    // 防抖相关ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef<boolean>(false);

    // 清理定时器，避免内存泄漏
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleVerifyLogin = () => {
        const isValidAndFormatted = validateAndFormatPhone();

        if (!isFormValid || !isValidAndFormatted) {
            return;
        }

        // 防抖检查：如果正在处理中，直接返回
        if (isProcessingRef.current) {
            return;
        }

        // 清除之前的防抖定时器
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 设置防抖定时器
        debounceTimerRef.current = setTimeout(async () => {
            // 再次检查是否正在处理（防止快速点击）
            if (isProcessingRef.current) {
                return;
            }

            try {
                isProcessingRef.current = true;
                setIsWaiting(true);

                const { formattedNumber, isAgreed } = useVerificationLoginStore.getState();
                // console.log('发送短信验证码...', formattedNumber, isAgreed)
                // 发送短信验证码
                const response = await SmsService.sendSmsCode(formattedNumber, isAgreed);

                if (response.success) {
                    // 设置验证码位数
                    if (response.codeDigits) {
                        setCodeDigits(response.codeDigits);
                    }
                    // 短信发送成功，跳转到验证码页面
                    navigation.replace('VerificationCode');
                }
            } catch (error: any) {
                console.error('发送短信验证码失败:', error);
            } finally {
                isProcessingRef.current = false;
                setIsWaiting(false);
            }
        }, 300); // 300ms防抖延迟
    };

    return (
        <Button
            style={styles.button}
            onPress={handleVerifyLogin}
            disabled={!isFormValid}
            accessoryLeft={isWaiting ? LoadingIndicator : <></>}
        >
            <Text style={styles.buttonText}>
                {isWaiting ? '发送中...' : '验证并登录'}
            </Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderWidth: 0,
        marginBottom: 25,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VerifyLoginButton;
