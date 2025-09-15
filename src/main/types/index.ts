// 定义导航属性类型
import { RootStackParamList } from '@navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from "react";

type AppMainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AppMain'
>;

// 定义路由参数类型
type AppMainRouteProp = RouteProp<
    RootStackParamList,
    'AppMain'
>;

// AppMain 组件属性类型
export type AppMainProps = {
    navigation: AppMainNavigationProp;
    route: AppMainRouteProp;
};

// 定义学习模块类型
export type LearnBox = {
    id: string;
    title: string;
    description: string;
    count: number;
    lastUpdated: string;
    icon: string;
    backgroundColor: string;
    countColor: string;
    countTextColor: string;
    screen: keyof RootStackParamList;
};

export type LearnBoxProps =  {
    learnBox: LearnBox;
    index: number;
};
