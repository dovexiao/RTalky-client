import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VerificationCodeInput } from './VerificationCodeInput';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useTheme } from '@ui-kitten/components';
import { useGlobal } from '@/contexts';
import { ImageCache } from '@/utils';
import { useAuthStore } from '@/auth/stores';
import { useNavigationStore } from '@navigation/stores';
import UserAuthManager from '@utils/UserAuthManager.ts';

export const VerificationCodeSection = () => {
    const { codeDigits, verificationSmsLogin, setIsCodeCompleted } = useVerificationLoginStore.getState();
    const editable = !useVerificationLoginStore(state => state.isCodeCompleted);

    const themes = useTheme();

    const { toastShow } = useGlobal();

    const handleCodeComplete = async (code: string) => {
        setIsCodeCompleted(true);

        console.log('登录校验中, loading');

        try {
            const loginData = await verificationSmsLogin(code);

            if (UserAuthManager) {

                console.log('校验完成初始化中');

                await UserAuthManager.saveUserAuthComplete(
                    loginData.userId,
                    {
                        phoneNumber: loginData.phoneNumber,
                        sessionToken: loginData.sessionToken,
                    },
                );
                const { setInitialRouteName } = useNavigationStore.getState();
                const { handleLogin, setAvatar, setIsLoggedIn } = useAuthStore.getState();

                setInitialRouteName('AppMain');

                handleLogin(loginData.userId, loginData.userProfile);
                const imagePath = await ImageCache.saveImageToFile(loginData.userProfile.avatar, 'AVATARS');
                setAvatar(imagePath);

                setIsLoggedIn(true);
            } else {
                console.log('初始化失败');
                throw new Error('初始化失败, 相关服务缺失');
            }
        } catch(error: any) {
            console.log(error?.message ?? error);
            toastShow(error?.message ?? error, { type: 'danger', position: 'bottom' });
        } finally {
            setIsCodeCompleted(false);
        }
    };

    return (
        <View style={styles.codeInputContainer}>
            <VerificationCodeInput
                cellCount={codeDigits}
                onFinish={handleCodeComplete}
                activeColor={themes['color-primary-500']}
                editable={editable}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    codeInputContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
});
