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
    const { toastShow } = useGlobal();

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

                    console.log('正在退出登录..., loading');

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

                                toastShow('退出登录成功', { type: 'success', position: 'bottom' });
                            } else {
                                throw new Error('退出登录失败');
                            }
                        } catch (error: any) {
                            toastShow(`退出登录失败, ${error?.message ?? error ?? '未知错误'}`, { type: 'danger', position: 'bottom' });
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
