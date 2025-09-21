import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { RouteProp } from '@react-navigation/native';
import { CountryInfo } from '@/auth/verificationLogin/utils';

type VerificationLoginNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'VerificationLogin'
>;

// 定义路由参数类型
type VerificationLoginRouteProp = RouteProp<
    RootStackParamList,
    'VerificationLogin'
>;

// VerificationLogin 组件属性类型
export type VerificationLoginProps = {
    navigation: VerificationLoginNavigationProp;
    route: VerificationLoginRouteProp;
};

type VerificationCodeNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'VerificationCode'
>;

// 定义路由参数类型
type VerificationCodeRouteProp = RouteProp<
    RootStackParamList,
    'VerificationCode'
>;

// VerificationCode 组件属性类型
export type VerificationCodeProps = {
    navigation: VerificationCodeNavigationProp;
    route: VerificationCodeRouteProp;
};

export type Country = CountryInfo & {
    countryId: string;
    sectionLetters: string;
}

export type CountryListItem = Country | string;

export type SectionIndexMap = {
    [letter: string]: number;
}

export type CellCount = 4 | 5 | 6 | 7;
