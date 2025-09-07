import { StyleSheet, View } from 'react-native';
import { Input, Text } from '@ui-kitten/components';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAuthStore } from '@/auth/stores';

// 定义暴露给父组件的 API 接口
export type EditNicknameActionAPI = {
    getNickname: () => string;
};

const EditNicknameAction = forwardRef<EditNicknameActionAPI, {}>((props, ref) => {
    const nickname = useAuthStore(state => state.nickname);
    const [currentNickname, setCurrentNickname] = useState(nickname || '');

    // 使用 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        getNickname: () => currentNickname,
    }), [currentNickname]);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>编辑昵称</Text>
            </View>
            <View style={styles.contentContainer}>
                <Input
                    value={currentNickname}
                    onChangeText={setCurrentNickname}
                    textStyle={styles.contentInput}
                    placeholder="请输入昵称"
                    maxLength={10}
                />
                <Text style={styles.tipText}>最多10个字符</Text>
            </View>
        </View>
    );
});

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
    contentInput: {
        minHeight: 50,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    tipText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'right',
    },
});

export default EditNicknameAction;
