import React, {useCallback} from 'react';
import { StyleSheet, View } from 'react-native';
import { VerificationCodeInput } from './VerificationCodeInput';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useTheme } from '@ui-kitten/components';
import { useGlobal } from '@/contexts';
import { ExceptionUtils, ImageCache, UserAuthManager } from '@/utils';
import { createSessionEvents, UserProfile, useSessionStore } from '@/core/session';

export const VerificationCodeSection = () => {
    const { codeDigits, verificationSmsLogin, setIsCodeCompleted } = useVerificationLoginStore.getState();
    const editable = !useVerificationLoginStore(state => state.isCodeCompleted);

    const themes = useTheme();

    const { toastShow } = useGlobal();

    const handleCodeComplete = useCallback(async (code: string) => {
        setIsCodeCompleted(true);

        toastShow('正在登录校验', { type: 'info', position: 'bottom' });

        const timer = setTimeout(async () => {
            clearTimeout(timer);
            try {
                const loginData = await verificationSmsLogin(code);

                toastShow('登录校验通过', {type: 'success', position: 'bottom'});

                const userProfile: UserProfile = {
                    userId: loginData.userId,
                    nickname: loginData.userProfile.nickname,
                    avatar: '',
                    bio: loginData.userProfile.bio,
                    theme: loginData.userProfile.theme,
                };

                const events = createSessionEvents();
                useSessionStore.getState().dispatch(events.loginSuccess(userProfile));

                await UserAuthManager.saveUserAuthComplete(
                    loginData.userId,
                    {
                        phoneNumber: loginData.phoneNumber,
                        sessionToken: loginData.sessionToken,
                    },
                );

                userProfile.avatar = await ImageCache.saveImageToFile(loginData.userProfile.avatar, 'AVATARS');
            } catch (error: unknown) {
                ExceptionUtils.logError(error, 'VerificationCodeSection');
                toastShow(ExceptionUtils.getErrorMessage(error), {type: 'danger', position: 'bottom'});
            } finally {
                setIsCodeCompleted(false);
            }
        }, 500);
    }, []);

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
