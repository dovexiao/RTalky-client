import React, { createContext, useContext, useState, ReactNode } from 'react';
import lightSpecialTheme from '../../light-special-theme.json';
import darkSpecialTheme from '../../dark-special-theme.json';

// 特殊主题类型定义
export type SpecialThemeType = 'light' | 'dark';

// 特殊主题颜色接口
export interface SpecialThemeColors {
    'primary-100': string;
    'primary-200': string;
    'primary-300': string;
    'accent-100': string;
    'accent-200': string;
    'text-100': string;
    'text-200': string;
    'bg-100': string;
    'bg-200': string;
    'bg-300': string;
}

// 特殊主题上下文类型
interface SpecialThemeContextType {
    specialTheme: SpecialThemeType;
    specialThemeColors: SpecialThemeColors;
    toggleSpecialTheme: () => void;
    setSpecialTheme: (theme: SpecialThemeType) => void;
}

// 创建上下文
const SpecialThemeContext = createContext<SpecialThemeContextType | undefined>(undefined);

// 特殊主题 Provider 组件
interface SpecialThemeProviderProps {
    children: ReactNode;
}

export const SpecialThemeProvider: React.FC<SpecialThemeProviderProps> = ({children}) => {
    const [specialTheme, setSpecialThemeState] = useState<SpecialThemeType>('light');

    // 根据当前主题获取对应的颜色值
    const specialThemeColors = specialTheme === 'light' ? lightSpecialTheme : darkSpecialTheme as SpecialThemeColors;

    // 切换特殊主题
    const toggleSpecialTheme = () => {
        setSpecialThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    // 设置特殊主题
    const setSpecialTheme = (theme: SpecialThemeType) => {
        setSpecialThemeState(theme);
    };

    const value: SpecialThemeContextType = {
        specialTheme,
        specialThemeColors,
        toggleSpecialTheme,
        setSpecialTheme,
    };

    return (
        <SpecialThemeContext.Provider value={value}>
            {children}
        </SpecialThemeContext.Provider>
    );
};

// 使用特殊主题的 Hook
export const useSpecialTheme = (): SpecialThemeContextType => {
    const context = useContext(SpecialThemeContext);
    if (context === undefined) {
        throw new Error('useSpecialTheme must be used within a SpecialThemeProvider');
    }
    return context;
};
