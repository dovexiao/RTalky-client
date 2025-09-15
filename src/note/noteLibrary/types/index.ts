// 定义导航属性类型
import { RootStackParamList } from '@navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type NoteLibraryNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'NoteLibrary'
>;

// 定义路由参数类型
type NoteLibraryRouteProp = RouteProp<
    RootStackParamList,
    'NoteLibrary'
>;

// NoteLibrary 组件属性类型
export type NoteLibraryProps = {
    navigation: NoteLibraryNavigationProp;
    route: NoteLibraryRouteProp;
};

export type Note = {
    noteId: string,
    displayId: string;
    createdAt: string,
    lastModified: string,
    title: string,
    content: string,
    introduce: string,
    tags: string[];
};
