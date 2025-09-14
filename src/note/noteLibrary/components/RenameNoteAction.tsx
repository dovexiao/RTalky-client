import {StyleSheet, View} from 'react-native';
import {Input, Text} from '@ui-kitten/components';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { useUnifiedTheme } from '@/contexts';

// 定义暴露给父组件的 API 接口
export type RenameNoteActionAPI = {
    getTitle: () => string;
    // setTitle: (title: string) => void;
};

const RenameNoteAction = forwardRef<RenameNoteActionAPI, { cardId: string }>(({ cardId }, ref) => {
    const note = useNoteStore(state => state.notes.filter(q => q.noteId === cardId)[0]);
    const [title, setTitle] = React.useState(note.title);

    const { themeColors } = useUnifiedTheme();

    // 使用 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        getTitle: () => title,
        // setTitle: (newTitle: string) => setTitle(newTitle),
    }), [title]);

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-200'] },
        ]}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>重命名</Text>
            </View>
            <View style={styles.contentContainer}>
                <Input
                    value={title.trim()}
                    onChangeText={setTitle}
                    textStyle={styles.contentInput}
                    multiline={true}
                    placeholder="请输入笔记标题"
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
        minHeight: 50,
        fontSize: 16,
        textAlignVertical: 'top',
    },
});

export default RenameNoteAction;
