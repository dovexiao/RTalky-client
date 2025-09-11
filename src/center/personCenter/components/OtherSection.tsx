import React from 'react';
import { MenuItem } from '@/center/personCenter/types';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';

export const OtherSection = () => {
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
            console.log('点击了退出登录');
        },
    }];

    return (
        <SectionContainer items={menuItems}/>
    );
};
