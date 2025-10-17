import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type OpeQuestionNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'OpeQuestion'
>;

// 定义路由参数类型
type OpeQuestionRouteProp = RouteProp<
    RootStackParamList,
    'OpeQuestion'
>;

// OpeQuestion 组件属性类型
export type OpeQuestionProps = {
    navigation: OpeQuestionNavigationProp;
    route: OpeQuestionRouteProp;
};

type CreateQuestionTagsNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CreateQuestionTags'
>;

// 定义路由参数类型
type CreateQuestionTagsRouteProp = RouteProp<
    RootStackParamList,
    'CreateQuestionTags'
>;

// CreateQuestionTags 组件属性类型
export type CreateQuestionTagsProps = {
    navigation: CreateQuestionTagsNavigationProp;
    route: CreateQuestionTagsRouteProp;
};
