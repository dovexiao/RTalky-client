import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import { NoteRecycleBin } from "@/center/recycleBin/components";

// 测试页面组件
const TestPage = () => {
    return (
        <View style={styles.container}>
            <NoteRecycleBin />
        </View>
    );
};

// 样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    customButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        alignItems: 'center',
    },
    customButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    actionSheetContent: {
        // padding: 16,
        backgroundColor: '#FFF',
    },
    menuItem: {
        paddingVertical: 18,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    cancelButton: {
        // marginTop: 10,
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    cancelText: {
        fontSize: 16,
        color: '#f44336',
        fontWeight: '500',
    },
});

export default TestPage;
