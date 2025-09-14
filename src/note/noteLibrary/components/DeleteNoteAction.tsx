import {StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { useUnifiedTheme } from '@/contexts';

const DeleteNoteAction = () => {
    const { themeColors } = useUnifiedTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-200'] },
        ]}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>删除</Text>
            </View>
            <View style={[
                styles.contentContainer,
                { backgroundColor: themeColors['bg-100'] },
            ]}>
                <Text style={styles.contentText}>确定删除该笔记吗？</Text>
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
        paddingVertical: 20,
        marginHorizontal: 15,
        marginBottom: 20,
    },
    contentText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default DeleteNoteAction;
