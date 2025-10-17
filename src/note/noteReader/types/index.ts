import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

// 定义导航属性类型
type NoteReaderNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'NoteReader'  // 指定当前路由名称
>;

// 定义路由参数类型
type NoteReaderRouteProp = RouteProp<
    RootStackParamList,
    'NoteReader'  // 指定当前路由名称
>;

// NoteReader 组件属性类型
export type NoteReaderProps = {
    navigation: NoteReaderNavigationProp;
    route: NoteReaderRouteProp;
};


