import React from 'react';
import { MenuItem } from '@/center/personCenter/types';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
// import { ConfirmExit } from '@/main/components';
import { useGlobal } from '@/contexts';
// import RNExitApp from 'react-native-exit-app';
import { SessionService } from '@/auth/services';
import { ConfirmLogout } from '@/main/components';
import { ExceptionUtils } from '@/utils';
import { createSessionEvents, useSessionStore } from '@/core/session';

export const OtherSection = () => {
    const { actionDialogRef, toastShow } = useGlobal();

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

                    try {
                        // 登出
                        const logoutResponse = await SessionService.logoutSession();

                        if (logoutResponse.success) {
                            toastShow('退出登录成功', { type: 'success', position: 'bottom' });

                            const timer = setTimeout(() => {
                                clearTimeout(timer);
                                const events = createSessionEvents();
                                useSessionStore.getState().dispatch(events.logoutSuccess());
                            }, 500);
                        }
                    } catch (error: unknown) {
                        ExceptionUtils.logError(error);
                        toastShow(`退出登录失败, ${ExceptionUtils.getErrorMessage(error)}`, { type: 'danger', position: 'bottom' });
                    } finally {}
                },
            });
        },
    }];

    return (
        <SectionContainer items={menuItems}/>
    );
};
