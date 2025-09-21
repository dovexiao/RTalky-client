import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { TopNavigation, useTheme } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';

interface BackgroundSettingsHeaderProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const BackgroundSettingsHeader: React.FC<BackgroundSettingsHeaderProps> = ({onCancel, onConfirm}) => {
    const themes = useTheme();
    const { themeColors } = useUnifiedTheme();

    const StatusBarHeight = useMemo(() => {
        console.log('StatusBar.currentHeight', StatusBar.currentHeight);
        return StatusBar.currentHeight || 36;
    }, []);

    return (
        <>
            <View style={{
                height: StatusBarHeight,
                backgroundColor: themeColors['bg-100'],
            }}/>
            <TopNavigation
                title="背景设置"
                alignment="center"
                accessoryLeft={() => (
                    <TouchableOpacity onPress={onCancel} style={styles.navButton}>
                        <Text style={[styles.navButtonText, {color: themeColors['text-200']}]}>
                            取消
                        </Text>
                    </TouchableOpacity>
                )}
                accessoryRight={() => (
                    <TouchableOpacity onPress={onConfirm} style={styles.navButton}>
                        <Text style={[styles.navButtonText, {color: themes['color-primary-500']}]}>
                            确认
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    navButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default BackgroundSettingsHeader;
