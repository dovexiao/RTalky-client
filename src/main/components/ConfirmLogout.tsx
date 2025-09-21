import {StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import React from 'react';

export const ConfirmLogout = () => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>退登</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>确定要退出登录 RTalky 吗？</Text>
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
    },
    contentText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
