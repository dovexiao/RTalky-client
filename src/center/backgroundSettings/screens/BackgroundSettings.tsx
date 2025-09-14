import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    BackgroundSettingsHeader,
    ThemePreview,
    BackgroundSettingsFooter,
} from '../components';
import { BackgroundSettingsProps } from '@/center/backgroundSettings/types';
import { useUnifiedTheme } from '@/contexts';
import { useBackgroundSettingsStore } from '@/center/backgroundSettings/stores';

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ navigation }) => {
    const {
        themeColors,
        theme,
        setPreviewMode,
        applyPreviewTheme,
        cancelPreviewTheme,
    } = useUnifiedTheme();

    // 处理取消
    const handleCancel = () => {
        // 取消预览模式，恢复原主题
        cancelPreviewTheme();
        const { reset } = useBackgroundSettingsStore.getState();
        reset();
        navigation.goBack();
    };

    // 处理确认
    const handleConfirm = () => {
        // 应用预览主题，并在完成后跳转页面
        applyPreviewTheme();
        navigation.goBack();
    };

    useEffect(() => {
        const initialize = useBackgroundSettingsStore.getState().initialize;
        initialize(theme);

        // 进入页面时启用预览模式
        setPreviewMode(true);

        // 页面卸载时自动取消预览模式
        return () => {
            cancelPreviewTheme();
        };
    }, []);

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            {/* 顶部导航 */}
            <BackgroundSettingsHeader
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />

            {/* 主题选择区域 */}
            <View style={styles.themeSelection}>
                <ThemePreview
                    theme="light"
                />
                <ThemePreview
                    theme="dark"
                />
            </View>

            {/* 底部设置 */}
            <BackgroundSettingsFooter />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    themeSelection: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 20,
        gap: 10,
    },
});

export default BackgroundSettings;
