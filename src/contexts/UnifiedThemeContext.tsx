// src/contexts/UnifiedThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import * as eva from '@eva-design/eva';
import lightSpecialTheme from '@root/light-special-theme.json';
import darkSpecialTheme from '@root/dark-special-theme.json';
import lightTheme from '@root/light-theme.json';
import darkTheme from '@root/dark-theme.json';
import { Appearance,  ColorSchemeName } from 'react-native';

export type ThemeType = 'light' | 'dark';

// 特殊主题颜色接口
interface SpecialThemeColors {
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

// UI Kitten 主题类型（基于实际使用情况定义）
interface UIKittenTheme {
    [key: string]: string;
}

// 统一主题上下文类型
interface UnifiedThemeContextType {
    /** 当前主题类型 */
    theme: ThemeType;

    /** 统一主题颜色组，包含自定义主题和UI Kitten主题，键名冲突时优先使用自定义主题 */
    themeColors: SpecialThemeColors & UIKittenTheme;

    /** 设置主题类型 */
    setTheme: (theme: ThemeType) => void;

    /** 切换主题类型 */
    toggleTheme: () => void;

    /** 是否自动切换主题（跟随系统） */
    autoSwitch: boolean;

    /** 设置自动切换主题 */
    setAutoSwitch: (enabled: boolean) => void;

    /** 是否处于预览模式 */
    isPreviewMode: boolean;

    /** 预览主题类型 */
    previewTheme: ThemeType;

    /** 设置预览模式 */
    setPreviewMode: (enabled: boolean) => void;

    /** 设置预览主题 */
    setPreviewTheme: (theme: ThemeType) => void;

    /** 应用预览主题（确认选择） */
    applyPreviewTheme: () => void;

    /** 取消预览主题（恢复原主题） */
    cancelPreviewTheme: () => void;

    /** 是否自动切换主题（预览版） */
    previewAutoSwitch: boolean;

    /** 选择是否跟随系统 */
    handleAutoSwitch: (enabled: boolean) => void;

    /** 重置主题设置为初始状态（浅色主题，不跟随系统） */
    resetThemeToDefault: () => void;

    // 向后兼容属性
    specialTheme: ThemeType;
    specialThemeColors: SpecialThemeColors;
    uiKittenTheme: UIKittenTheme;
    toggleSpecialTheme: () => void;
    setSpecialTheme: (theme: ThemeType) => void;
}

const UnifiedThemeContext = createContext<UnifiedThemeContextType | undefined>(undefined);

export const UnifiedThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
    const [autoSwitch, setAutoSwitch] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [previewTheme, setPreviewTheme] = useState<ThemeType>(currentTheme);
    const [previewAutoSwitch, setPreviewAutoSwitch] =  useState(autoSwitch);

    // 计算有效主题（预览模式时使用预览主题，否则使用当前主题）
    const effectiveTheme = useMemo(() => {
        return isPreviewMode ? previewTheme : currentTheme;
    }, [currentTheme, isPreviewMode, previewTheme]);

    // 计算特殊主题颜色
    const specialThemeColors = useMemo(() => {
        return effectiveTheme === 'light' ? lightSpecialTheme : darkSpecialTheme;
    }, [effectiveTheme]);

    // 计算 UI Kitten 主题
    const uiKittenTheme = useMemo(() => {
        const baseTheme = eva[effectiveTheme];
        const customTheme = effectiveTheme === 'light' ? lightTheme : darkTheme;
        return {...baseTheme, ...customTheme};
    }, [effectiveTheme]);

    // 计算统一主题颜色，自定义主题优先
    const themeColors = useMemo(() => {
        return {...uiKittenTheme, ...specialThemeColors};
    }, [uiKittenTheme, specialThemeColors]);

    // 主题操作
    const setTheme = (theme: ThemeType) => {
        setCurrentTheme(theme);
    };

    const toggleTheme = () => {
        setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // 预览模式操作
    const setPreviewMode = (enabled: boolean) => {
        setIsPreviewMode(enabled);
        if (enabled) {
            setPreviewTheme(currentTheme);
            setPreviewAutoSwitch(autoSwitch);
        }
    };

    const setPreviewThemeHandler = (theme: ThemeType) => {
        setPreviewTheme(theme);
        setPreviewAutoSwitch(false);
    };

    const applyPreviewTheme = () => {
        setCurrentTheme(previewTheme);
        setAutoSwitch(previewAutoSwitch);
    };

    const cancelPreviewTheme = () => {
        setIsPreviewMode(false);
    };

    const handleAutoSwitch = (enabled: boolean) => {
        setPreviewAutoSwitch(enabled);
        if (enabled) {
            const colorScheme: ColorSchemeName = Appearance.getColorScheme();
            if (colorScheme) {
                setPreviewTheme(colorScheme);
            }
        }
    };

    // 重置主题设置为初始状态（浅色主题，不跟随系统）
    const resetThemeToDefault = () => {
        setCurrentTheme('light');
        setAutoSwitch(false);
        console.log('主题设置已重置为默认状态: 浅色主题，不跟随系统');
    };

    React.useEffect(() => {
        const colorScheme: ColorSchemeName = Appearance.getColorScheme();
        if (autoSwitch && colorScheme) {
            setCurrentTheme(colorScheme);
        }

        // 监听主题变化
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (autoSwitch && colorScheme) {
                setCurrentTheme(colorScheme);
            }
        });

        return () => {
            // 清理监听器
            subscription.remove();
        };
    }, [autoSwitch]);

    // 向后兼容的方法
    const toggleSpecialTheme = () => {
        toggleTheme();
    };

    const setSpecialTheme = (theme: ThemeType) => {
        setTheme(theme);
    };

    const value: UnifiedThemeContextType = {
        theme: effectiveTheme,
        themeColors,
        setTheme,
        toggleTheme,
        autoSwitch,
        setAutoSwitch,
        isPreviewMode,
        previewTheme,
        setPreviewMode,
        setPreviewTheme: setPreviewThemeHandler,
        applyPreviewTheme,
        cancelPreviewTheme,
        previewAutoSwitch,
        handleAutoSwitch,
        resetThemeToDefault,
        // 向后兼容
        specialTheme: currentTheme,
        specialThemeColors,
        uiKittenTheme,
        toggleSpecialTheme,
        setSpecialTheme,
    };

    return (
        <UnifiedThemeContext.Provider value={value}>
            {children}
        </UnifiedThemeContext.Provider>
    );
};

/**
 * 统一主题管理 Hook
 *
 * @description 提供统一的主题管理功能，包括主题类型、主题颜色、主题切换等
 *
 * @returns {UnifiedThemeContextType} 主题上下文对象
 *
 * @example
 * ```typescript
 * // 基本使用
 * const { theme, themeColors, setTheme, toggleTheme } = useUnifiedTheme();
 *
 * // 使用主题类型
 * console.log('当前主题:', theme); // 'light' | 'dark'
 *
 * // 使用主题颜色
 * <View style={{
 *   backgroundColor: themeColors['bg-100'],
 *   borderColor: themeColors['border-basic-color-4']
 * }} />
 *
 * // 切换主题
 * <Button onPress={toggleTheme}>切换主题</Button>
 *
 * // 设置特定主题
 * <Button onPress={() => setTheme('dark')}>设置为深色</Button>
 *
 * // 自动切换设置
 * const { autoSwitch, setAutoSwitch } = useUnifiedTheme();
 * <Switch value={autoSwitch} onValueChange={setAutoSwitch} />
 *
 * // 重置主题设置为默认状态（用于退出登录时）
 * const { resetThemeToDefault } = useUnifiedTheme();
 * <Button onPress={resetThemeToDefault}>重置主题设置</Button>
 * ```
 *
 * @example
 * ```typescript
 * // 在组件中使用
 * const MyComponent = () => {
 *   const { theme, themeColors, setTheme } = useUnifiedTheme();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: themeColors['bg-100'],
 *       borderColor: themeColors['border-basic-color-4']
 *     }}>
 *       <Text style={{ color: themeColors['text-100'] }}>
 *         当前主题: {theme}
 *       </Text>
 *       <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         切换主题
 *       </Button>
 *     </View>
 *   );
 * };
 * ```
 *
 * @example
 * ```typescript
 * // 主题设置组件
 * const ThemeSettings = () => {
 *   const { theme, setTheme, autoSwitch, setAutoSwitch } = useUnifiedTheme();
 *
 *   return (
 *     <View>
 *       <Text>当前主题: {theme}</Text>
 *       <Button onPress={() => setTheme('light')}>浅色主题</Button>
 *       <Button onPress={() => setTheme('dark')}>深色主题</Button>
 *       <Switch
 *         value={autoSwitch}
 onValueChange={setAutoSwitch}
 *         title="跟随系统"
 *       />
 *     </View>
 *   );
 * };
 * ```
 *
 * @example
 * ```typescript
 * // 主题预览功能
 * const ThemePreview = () => {
 *   const {
 *     isPreviewMode,
 *     previewTheme,
 *     setPreviewMode,
 *     setPreviewTheme,
 *     applyPreviewTheme,
 *     cancelPreviewTheme
 *   } = useUnifiedTheme();
 *
 *   const handleThemeSelect = (theme: 'light' | 'dark') => {
 *     if (!isPreviewMode) {
 *       setPreviewMode(true);
 *     }
 *     setPreviewTheme(theme);
 *   };
 *
 *   const handleConfirm = () => {
 *     applyPreviewTheme(() => {
 *       // 主题应用完成后的回调
 *       console.log('主题已应用');
 *     });
 *   };
 *
 *   const handleCancel = () => {
 *     cancelPreviewTheme();
 *   };
 *
 *   return (
 *     <View>
 *       <Text>预览模式: {isPreviewMode ? '开启' : '关闭'}</Text>
 *       <Text>预览主题: {previewTheme}</Text>
 *       <Button onPress={() => handleThemeSelect('light')}>预览浅色</Button>
 *       <Button onPress={() => handleThemeSelect('dark')}>预览深色</Button>
 *       <Button onPress={handleConfirm}>确认应用</Button>
 *       <Button onPress={handleCancel}>取消预览</Button>
 *     </View>
 *   );
 * };
 * ```
 *
 * @note 向后兼容：此 Hook 同时提供向后兼容的属性，包括 specialTheme、specialThemeColors、uiKittenTheme 等，
 *       现有代码可以继续使用这些属性，但建议逐步迁移到新的统一属性。
 *
 * @see {@link useTheme} 向后兼容的简单主题 Hook
 * @see {@link useSpecialTheme} 向后兼容的特殊主题 Hook
 * @see {@link useUIKittenTheme} 向后兼容的 UI Kitten 主题 Hook
 */
export const useUnifiedTheme = (): UnifiedThemeContextType => {
    const context = useContext(UnifiedThemeContext);
    if (!context) {
        throw new Error('useUnifiedTheme must be used within a UnifiedThemeProvider');
    }
    return context;
};

/**
 * 向后兼容的简单主题 Hook
 *
 * @description 提供基本的主题切换功能，保持与原有代码的兼容性
 *
 * @returns {Object} 包含 theme 和 toggleTheme 的对象
 *
 * @example
 * ```typescript
 * const { theme, toggleTheme } = useTheme();
 *
 * <Button onPress={toggleTheme}>
 *   当前主题: {theme}
 * </Button>
 * ```
 *
 * @deprecated 建议使用 useUnifiedTheme 替代
 */
export const useTheme = (): object => {
    const {theme, toggleTheme} = useUnifiedTheme();
    return {theme, toggleTheme};
};

/**
 * 向后兼容的特殊主题 Hook
 *
 * @description 提供特殊主题颜色管理功能，保持与原有代码的兼容性
 *
 * @returns {Object} 包含特殊主题相关属性和方法的对象
 *
 * @example
 * ```typescript
 * const {
 *   specialTheme,
 *   specialThemeColors,
 *   toggleSpecialTheme,
 *   setSpecialTheme
 * } = useSpecialTheme();
 *
 * <View style={{ backgroundColor: specialThemeColors['bg-100'] }}>
 *   <Text>特殊主题: {specialTheme}</Text>
 * </View>
 * ```
 *
 * @deprecated 建议使用 useUnifiedTheme 替代
 */
export const useSpecialTheme = (): object => {
    const {
        specialTheme,
        specialThemeColors,
        toggleSpecialTheme,
        setSpecialTheme,
    } = useUnifiedTheme();
    return {
        specialTheme,
        specialThemeColors,
        toggleSpecialTheme,
        setSpecialTheme,
    };
};

/**
 * 向后兼容的 UI Kitten 主题 Hook
 *
 * @description 提供 UI Kitten 主题颜色访问功能，保持与原有代码的兼容性
 *
 * @returns {UIKittenTheme} UI Kitten 主题颜色对象
 *
 * @example
 * ```typescript
 * const themes = useUIKittenTheme();
 *
 * <View style={{
 *   borderColor: themes['border-basic-color-4'],
 *   backgroundColor: themes['background-basic-color-1']
 * }}>
 *   <Text style={{ color: themes['text-basic-color'] }}>
 *     UI Kitten 主题
 *   </Text>
 * </View>
 * ```
 *
 * @deprecated 建议使用 useUnifiedTheme 替代
 */
export const useUIKittenTheme = (): UIKittenTheme => {
    const {uiKittenTheme} = useUnifiedTheme();
    return uiKittenTheme;
};
