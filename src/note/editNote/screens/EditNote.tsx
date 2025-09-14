import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Button, Divider } from '@ui-kitten/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { useOpeNoteStore } from '../../createNote/stores';
import { useNoteStore } from '../../noteLibrary/stores';
import { NoteContentEditor, NoteIntroduceEditor, NoteTagsEditor, NoteTitleEditor } from '../../createNote/components';
import { EditNoteProps } from '../types';
import { NoteService } from '@/note/services';
import { useUnifiedTheme } from '@/contexts';

const EditNote: React.FC<EditNoteProps> = ({ navigation, route }) => {
    const { noteId } = route.params;

    const note = useNoteStore(state => state.notes.filter(q => q.noteId === noteId)[0]);
    const initialize = useOpeNoteStore(state => state.initialize);
    const reset = useOpeNoteStore(state => state.reset);

    const { themeColors } = useUnifiedTheme();

    useEffect(() => {
        initialize(note);
        return () => {
            reset();
        };
    }, [initialize, note, reset]);

    return (
        <SafeAreaView style={[
            styles.safeArea,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <View style={{
                height: StatusBar.currentHeight,
                backgroundColor: themeColors['bg-100'],
            }} />
            <TopNavigationOpe
                title={'编辑 ' + note?.displayId + ' 笔记'}
                renderItemAccessory={() => <></>}
            />
            <Divider />

            <ScrollView style={[
                styles.container,
                { backgroundColor: themeColors['bg-100'] },
            ]}>
                <NoteTitleEditor />

                <NoteIntroduceEditor />

                <NoteContentEditor />

                <NoteTagsEditor />

                <SaveStepButton navigation={navigation} />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const SaveStepButton = ({ navigation }: { navigation: any }) => {
    const isSaveDisabled = useOpeNoteStore(state => state.isOpeDisabled);
    const [isSaving, setIsSaving] = useState(false);

    // 处理保存
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const state = useOpeNoteStore.getState();

            // 构建更新请求参数
            const updateRequest = {
                title: state.noteTitle,
                description: state.noteIntroduce,
                content: state.noteContent,
                tags: state.noteTags,
            };

            // 调用 API 修改笔记
            const updatedNote = await NoteService.updateNote(state.noteId, updateRequest);

            const updateNote = useNoteStore.getState().updateNote;

            // 将 NoteResponse 转换为 Note 类型并更新本地 store
            updateNote({
                noteId: updatedNote.noteId,
                displayId: updatedNote.displayId,
                title: updatedNote.title,
                content: updatedNote.content,
                introduce: updatedNote.description,
                tags: updatedNote.tags,
                createdAt: updatedNote.createdTime,
                lastModified: updatedNote.updatedTime,
            });

            // 返回上一页
            navigation.goBack();
        } catch (error: any) {
            console.error('保存笔记失败:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Button
            style={styles.endButton}
            onPress={() => handleSave()}
            disabled={isSaveDisabled || isSaving}
        >
            <Text style={styles.endButtonText}>
                {isSaving ? '保存中...' : '保存'}
            </Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    endButton: {
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        // marginTop: 16,
        // backgroundColor: '#3366FF',
    },
    endButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EditNote;
