import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';

const BackgroundSettingsFooter: React.FC<{}> = () => {
    const { themeColors, autoSwitch, setAutoSwitch } = useUnifiedTheme();

    return (
        <View style={styles.container}>
            <View style={styles.settingItem}>
                <Text style={[styles.settingLabel, {color: themeColors['text-100']}]}>
                    跟随系统
                </Text>
                <Toggle
                    checked={autoSwitch}
                    onChange={(enabled) => {
                        setAutoSwitch(enabled);
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default BackgroundSettingsFooter;
