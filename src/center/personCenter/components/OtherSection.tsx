import React from 'react';
import { MenuItem } from '@/center/personCenter/types';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
import { ConfirmExit } from '@/main/components';
import { useGlobal } from '@/contexts';
import RNExitApp from 'react-native-exit-app';

export const OtherSection = () => {
    const { actionDialogRef } = useGlobal();

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
        onPress: () => {
            actionDialogRef.current?.show({
                content: <ConfirmExit />,
                onConfirm: () => {
                    RNExitApp.exitApp();
                },
            });
        },
    }];

    return (
        <SectionContainer items={menuItems}/>
    );
};
