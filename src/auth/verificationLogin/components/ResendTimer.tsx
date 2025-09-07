import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SmsService } from '@/auth/services';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

export const ResendTimer = ({ initialCount = 300 }) => {
    const [count, setCount] = useState(initialCount);
    const [isActive, setIsActive] = useState(true);
    const [isResending, setIsResending] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 防抖相关ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef<boolean>(false);

    // 获取store中的状态
    const { formattedNumber, isAgreedToTerms, setCodeDigits } = useVerificationLoginStore();

    useEffect(() => {
        if (isActive && count > 0) {
            intervalRef.current = setInterval(() => {
                setCount(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, count]);

    // 清理定时器，避免内存泄漏
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const reset = () => {
        setCount(initialCount);
        setIsActive(true);
        setIsResending(false);
    };

    // 重新发送验证码逻辑
    const handleResend = () => {
        // 防抖检查：如果正在处理中，直接返回
        if (isProcessingRef.current || isActive) {
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
                setIsResending(true);

                // 重新发送验证码
                const response = await SmsService.sendSmsCode(formattedNumber, isAgreedToTerms);

                if (response.success) {
                    // 设置验证码位数
                    if (response.codeDigits) {
                        setCodeDigits(response.codeDigits);
                    }
                    // 重置倒计时
                    reset();
                }
            } catch (error: any) {
                console.error('重新发送验证码失败:', error);
            } finally {
                isProcessingRef.current = false;
                setIsResending(false);
            }
        }, 300); // 300ms防抖延迟
    };

    const getButtonText = () => {
        if (isResending) {
            return '发送中...';
        }
        if (isActive) {
            return `${count} 秒后重新发送`;
        }
        return '重新发送';
    };

    const getButtonStyle = () => {
        if (isResending) {
            return [styles.helperText, styles.loadingText];
        }
        if (isActive) {
            return [styles.helperText, styles.countdownText];
        }
        return [styles.helperText];
    };

    return (
        <TouchableOpacity
            onPress={handleResend}
            disabled={isActive || isResending}
            style={styles.buttonContainer}
        >
            {isResending && (
                <ActivityIndicator
                    size="small"
                    color="#007AFF"
                    style={styles.loadingIndicator}
                />
            )}
            <Text style={getButtonStyle()}>
                {getButtonText()}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperText: {
        fontSize: 14,
        color: '#007AFF',
    },
    countdownText: {
        color: '#999',
    },
    loadingText: {
        color: '#007AFF',
        marginLeft: 4,
    },
    loadingIndicator: {
        marginRight: 4,
    },
});
