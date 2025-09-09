// 定义导航属性类型
import { RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type AddNoteCoverNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AddNoteCover'
>;

// 定义路由参数类型
type AddNoteCoverRouteProp = RouteProp<
    RootStackParamList,
    'AddNoteCover'
>;

// AddNoteCover 组件属性类型
export type AddNoteCoverProps = {
    navigation: AddNoteCoverNavigationProp;
    route: AddNoteCoverRouteProp;
};

type AddNoteContentNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AddNoteContent'
>;

// 定义路由参数类型
type AddNoteContentRouteProp = RouteProp<
    RootStackParamList,
    'AddNoteContent'
>;

// AddNoteContent 组件属性类型
export type AddNoteContentProps = {
    navigation: AddNoteContentNavigationProp;
    route: AddNoteContentRouteProp;
};

type CreateNoteTagNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CreateNoteTag'
>;

// 定义路由参数类型
type CreateNoteTagRouteProp = RouteProp<
    RootStackParamList,
    'CreateNoteTag'
>;

// CreateNoteTag 组件属性类型
export type CreateNoteTagProps = {
    navigation: CreateNoteTagNavigationProp;
    route: CreateNoteTagRouteProp;
};
