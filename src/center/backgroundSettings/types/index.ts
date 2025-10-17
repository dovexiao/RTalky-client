import { RootStackParamList } from '@/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type BackgroundSettingsNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'BackgroundSettings'
>;

// 定义路由参数类型
type BackgroundSettingsRouteProp = RouteProp<
    RootStackParamList,
    'BackgroundSettings'
>;

// BackgroundSettings 组件属性类型
export type BackgroundSettingsProps = {
    navigation: BackgroundSettingsNavigationProp;
    route: BackgroundSettingsRouteProp;
};

export interface ThemePreviewProps {
    theme: 'light' | 'dark';
}
