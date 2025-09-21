import React from 'react';
import { MenuItem } from '@/center/personCenter/types';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
// import { ConfirmExit } from '@/main/components';
import { useGlobal, useUnifiedTheme } from '@/contexts';
// import RNExitApp from 'react-native-exit-app';
import { SessionService } from '@/auth/services';
import { useAuthStore } from '@/auth/stores';
import { useNavigationStore } from '@navigation/stores';
import { ConfirmLogout } from '@/main/components';

export const OtherSection = () => {
    const { actionDialogRef } = useGlobal();
    const { resetThemeToDefault } = useUnifiedTheme();

    const menuItems: MenuItem[] = [{
    //     icon: 'sync-alt',
    //     title: '切换账号',
    //     color: '#4285F4',
    //     onPress: () => {
    //         console.log('点击了切换账号');
    //     },
    // }, {
        icon: 'logout',
        title: '退出登录',
        color: '#4285F4',
        onPress: async () => {
            actionDialogRef.current?.show({
                content: <ConfirmLogout />,
                onConfirm: async () => {
                    const { setMessageType, setMessageText } = useNavigationStore.getState();

                    setMessageType('loading');
                    setMessageText('正在退出登录...');

                    const timer = setTimeout(async () => {
                        try {
                            // 登出
                            const logoutResponse = await SessionService.logoutSession();

                            if (logoutResponse) {
                                // RNExitApp.exitApp();
                                const { setIsLoggedIn } = useAuthStore.getState();
                                const { resetInitialRouteName } = useNavigationStore.getState();

                                resetInitialRouteName();
                                setIsLoggedIn(false);
                                resetThemeToDefault();

                                setMessageType('success');
                                setMessageText('退出登录成功');
                            } else {
                                throw new Error('退出登录');
                            }
                        } catch (error: any) {
                            setMessageType('danger');
                            setMessageText(error?.message ?? error ?? '未知错误');
                            console.log(error?.message ?? error ?? '未知错误');
                        } finally {}

                        clearTimeout(timer);
                    }, 1000);
                },
            });
        },
    }];

    return (
        <SectionContainer items={menuItems}/>
    );
};
