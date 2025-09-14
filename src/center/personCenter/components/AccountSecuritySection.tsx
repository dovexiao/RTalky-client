import React from 'react';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
import { MenuItem } from '@/center/personCenter/types';

export const AccountSecuritySection = () => {
    const menuItems: MenuItem[] = [{
        icon: 'phone-android',
        title: '手机号绑定',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'lock',
        title: 'RTalky 密码',
        color: '#4285F4',
        onPress: () => {},
    }, {
        icon: 'person-remove',
        title: '注销账号',
        color: '#4285F4',
        onPress: () => {},
    }];

    return (
        <SectionContainer title={'账号'} items={menuItems}/>
    );
};

