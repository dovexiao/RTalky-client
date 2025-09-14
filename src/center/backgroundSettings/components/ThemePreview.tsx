import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, StatusBar } from 'react-native';
import { Radio } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';
import { ThemePreviewProps } from '../types';
import { useBackgroundSettingsStore } from '@/center/backgroundSettings/stores';

const { width, height } = Dimensions.get('window');

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
    const {
        themeColors,
        isPreviewMode,
        setPreviewMode,
        setPreviewTheme,
    } = useUnifiedTheme();
    const isLight = theme === 'light';
    const bgColor = isLight ? '#FFFFFF' : '#1F2B3E';
    const cardBgColor = isLight ? '#F5F5F5' : '#0F1C2E';

    const selectedTheme = useBackgroundSettingsStore(state => state.selectedTheme);

    const handleThemeChange = (checked: boolean) => {
        // 启用预览模式并设置预览主题
        if (!isPreviewMode) {
            setPreviewMode(true);
        }
        if (checked) {
            setPreviewTheme(theme);
            // 同时更新背景设置存储
            const { setSelectedTheme } = useBackgroundSettingsStore.getState();
            setSelectedTheme(theme);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.themeCard,
                    { backgroundColor: bgColor, aspectRatio: width / (height + (StatusBar.currentHeight ?? 0)) },
                ]}
                onPress={() => {
                    handleThemeChange(true);
                }}
                activeOpacity={0.8}
            >
                {/* 模拟个人中心内容 */}
                <View style={styles.previewContent}>
                    {/* 头像区域 */}
                    <View style={styles.avatarSection}>
                        <View style={[
                            styles.avatar,
                            { backgroundColor: cardBgColor },
                        ]}/>
                        <View style={styles.userInfo}>
                            <View style={[
                                styles.userName,
                                { backgroundColor: cardBgColor },
                            ]}/>
                            <View style={[
                                styles.userDesc,
                                { backgroundColor: cardBgColor },
                            ]}/>
                        </View>
                    </View>

                    {/* 分割线 */}
                    <View style={[
                        styles.divider,
                        { backgroundColor: cardBgColor },
                    ]}/>

                    {/* 内容区域 */}
                    <View style={styles.contentGrid}>
                        {Array.from({length: 9}).map((_, index) => (
                            <View
                                key={index}
                                style={[styles.contentItem, {backgroundColor: cardBgColor}]}
                            />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>

            {/* 选择指示器 */}
            <View style={styles.selectionArea}>
                <Radio
                    checked={selectedTheme === theme}
                    onChange={handleThemeChange}
                    status={selectedTheme === theme ? 'primary' : 'basic'}
                />
                <Text style={[
                    styles.themeLabel,
                    { color: themeColors['text-100'] },
                ]}>
                    {isLight ? '浅色' : '深色'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    themeCard: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    previewContent: {
        alignItems: 'center',
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        height: 12,
        width: '80%',
        borderRadius: 6,
        marginBottom: 8,
    },
    userDesc: {
        height: 12,
        width: '100%',
        borderRadius: 6,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    contentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        marginLeft: 2,
    },
    contentItem: {
        width: '32%',
        height: 40,
        aspectRatio: 1,
        borderRadius: 5,
    },
    selectionArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default ThemePreview;
