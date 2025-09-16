import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import React from 'react';

interface PermissionSettingsDialogProps {
    title: string;
    message: string;
}

export const PermissionSettingsDialog: React.FC<PermissionSettingsDialogProps> = ({
    title,
    message,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        width: '100%',
        padding: 16,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 5,
        paddingBottom: 30,
        paddingHorizontal: 16,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 28,
    },
});
