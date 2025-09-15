import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';

// 定义导航属性类型
type QuestionPaginatorNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'QuestionPaginator'  // 指定当前路由名称
>;

// 定义路由参数类型
type QuestionPaginatorRouteProp = RouteProp<
    RootStackParamList,
    'QuestionPaginator'  // 指定当前路由名称
>;

// QuestionPaginator 组件属性类型
export type QuestionPaginatorProps = {
    navigation: QuestionPaginatorNavigationProp;
    route: QuestionPaginatorRouteProp;
};
