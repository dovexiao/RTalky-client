import React from 'react';
import SectionContainer from '@/center/personCenter/components/SectionContainer.tsx';
import { MenuItem } from '@/center/personCenter/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';

export const GeneralSettingsSection = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const menuItems: MenuItem[] = [{
        icon: 'wallpaper',
        title: '背景设置',
        color: '#4285F4',
        onPress: () => {
            navigation.navigate('BackgroundSettings');
        },
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

