import React from 'react';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
import { MenuItem } from '@/center/personCenter/types';

export const AboutRTalkySection = () => {
    const menuItems: MenuItem[] = [{
        icon: 'info-outline',
        title: '关于RTalky',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'assignment',
        title: '用户协议',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'privacy-tip',
        title: '隐私政策',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'vpn-key',
        title: '应用权限',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'list',
        title: '个人信息收集清单',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'description',
        title: '开源软件声明',
        color: '#4285F4',
        onPress: () => {},
    }];

    return (
        <SectionContainer title={'关于'} items={menuItems}/>
    );
};

