import React from 'react';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
import { MenuItem } from '@/center/personCenter/types';

export const GeneralSettingsSection = () => {

    const menuItems: MenuItem[] = [{
        icon: 'wallpaper',
        title: '背景设置',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'text-fields',
        title: '字体大小',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'delete-sweep',
        title: '清理缓存',
        color: '#4285F4',
        onPress: () => {},
    }];

    return (
        <SectionContainer title={'通用'} items={menuItems}/>
    );
};

