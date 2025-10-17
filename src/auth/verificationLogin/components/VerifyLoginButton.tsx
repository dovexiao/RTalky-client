import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useGlobal } from '@/contexts';
import { ExceptionUtils } from '@/utils';

const LoadingIndicator = (): React.ReactElement => (
    <Spinner size="small" status="control" />
);

const VerifyLoginButton: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const isFormValid = useVerificationLoginStore(state => state.isFormValid);
    const isSendingSms = useVerificationLoginStore(state => state.isSendingSms);

    // 防抖相关ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef<boolean>(false);

    const { toastShow } = useGlobal();

    const handleVerifyLogin = () => {
        // 防抖检查
        if (isProcessingRef.current || !isFormValid) {return;}

        // 清除之前的定时器
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 设置防抖定时器
        debounceTimerRef.current = setTimeout(async () => {
            if (isProcessingRef.current) return;

            try {
                isProcessingRef.current = true;

                const { sendSmsCode } = useVerificationLoginStore.getState();
                await sendSmsCode(() => {
                    navigation.navigate('VerificationCode');
                    toastShow('短信验证码已发送', { type: 'success', position: 'bottom' });
                });
            } catch (error: unknown) {
                ExceptionUtils.logError(error, 'VerifyLoginButton');
                toastShow(ExceptionUtils.getErrorMessage(error), {type: 'danger', position: 'bottom'});
            } finally {
                isProcessingRef.current = false;
            }
        }, 300);
    };

    // 清理定时器，避免内存泄漏
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);


    return (
        <Button
            style={styles.button}
            onPress={handleVerifyLogin}
            disabled={!isFormValid}
            accessoryLeft={isSendingSms ? LoadingIndicator : <></>}
        >
            <Text style={styles.buttonText}>
                {isSendingSms ? '发送中...' : '验证并登录'}
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
