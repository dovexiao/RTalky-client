import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type QuestionBankNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'QuestionBank'
>;

// 定义路由参数类型
type QuestionBankRouteProp = RouteProp<
    RootStackParamList,
    'QuestionBank'
>;

// QuestionBank 组件属性类型
export type QuestionBankProps = {
    navigation: QuestionBankNavigationProp;
    route: QuestionBankRouteProp;
};

export type QuestionType = '单选题' | '多选题' | '判断题' | '填空题' | '简答题';

export type Question = {
    questionId: string;
    type: QuestionType;
    createdAt: string;
    lastModified: string;
    content: string;
    body: any;
    analysis: string;
    tags: string[];
};
