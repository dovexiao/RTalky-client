import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    BackgroundSettingsHeader,
    ThemePreview,
    BackgroundSettingsFooter,
} from '../components';
import { BackgroundSettingsProps } from '@/center/backgroundSettings/types';
import { useUnifiedTheme } from '@/contexts';

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ navigation }) => {
    const { themeColors } = useUnifiedTheme();

    // 处理取消
    const handleCancel = () => {
        navigation.goBack();
    };

    // 处理确认
    const handleConfirm = () => {
        navigation.goBack();
    };

    return (
        <View style={[
            styles.container,
            {backgroundColor: themeColors['bg-100']},
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
