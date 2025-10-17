// 定义导航属性类型
import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type EditNoteNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'EditNote'
>;

// 定义路由参数类型
type EditNoteRouteProp = RouteProp<
    RootStackParamList,
    'EditNote'
>;

// EditNote 组件属性类型
export type EditNoteProps = {
    navigation: EditNoteNavigationProp;
    route: EditNoteRouteProp;
};
