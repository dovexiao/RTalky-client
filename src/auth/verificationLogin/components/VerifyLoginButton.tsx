import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Spinner } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { SmsService } from '@/auth/verificationLogin/services';

const VerifyLoginButton: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isFormValid = useVerificationLoginStore(state => state.isFormValid);
    const validateAndFormatPhone = useVerificationLoginStore(state => state.validateAndFormatPhone);
    const setCodeDigits = useVerificationLoginStore(state => state.setCodeDigits);

    const [isWaiting, setIsWaiting] = useState(false);

    const LoadingIndicator = (): React.ReactElement => (
        <Spinner size="small" status="control" />
    );

    const handleVerifyLogin = async () => {
        const isValidAndFormatted = validateAndFormatPhone();

        if (isFormValid && isValidAndFormatted) {
            try {
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
                    navigation.navigate('VerificationCode');
                }
            } catch (error: any) {
                console.error('发送短信验证码失败:', error);
            } finally {
                setIsWaiting(false);
            }
        }
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
