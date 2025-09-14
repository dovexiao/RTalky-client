import { StyleSheet, View } from 'react-native';
import { Input, Text } from '@ui-kitten/components';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { useUnifiedTheme } from '@/contexts';

// 定义暴露给父组件的 API 接口
export type EditIntroduceActionAPI = {
    getIntroduce: () => string;
    // setIntroduce: (introduce: string) => void;
};

const EditIntroduceAction = forwardRef<EditIntroduceActionAPI, { cardId: string }>(({ cardId }, ref) => {
    const note = useNoteStore(state => state.notes.filter(q => q.noteId === cardId)[0]);
    const [introduce, setIntroduce] = React.useState(note.introduce);

    const { themeColors } = useUnifiedTheme();

    // 使用 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        getIntroduce: () => introduce,
        // setIntroduce: (newIntroduce: string) => setIntroduce(newIntroduce),
    }), [introduce]);

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-200'] },
        ]}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>简介修改</Text>
            </View>
            <View style={styles.contentContainer}>
                <Input
                    value={introduce.trim()}
                    onChangeText={setIntroduce}
                    textStyle={styles.contentInput}
                    multiline={true}
                    placeholder="请输入笔记介绍"
                />
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
        // borderWidth: 1,
        // borderColor: '#E0E0E0',
        // borderRadius: 4,
        // padding: 12,
        minHeight: 100,
        fontSize: 16,
        // lineHeight: 22,
        // color: '#333',
        textAlignVertical: 'top',
    },
});

export default EditIntroduceAction;
