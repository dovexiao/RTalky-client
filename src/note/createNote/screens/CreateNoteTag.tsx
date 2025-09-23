import React, {useCallback} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Divider } from '@ui-kitten/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { TagsEditor } from '../components';
import { CreateNoteTagProps } from '../types';
import { useOpeNoteStore } from '@/note/createNote/stores';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { NoteService, CreateNoteRequest } from '@/note/services';
import { useUnifiedTheme } from '@/contexts';
import { useNavigationStore } from '@navigation/stores';

const CreateNoteTag: React.FC<CreateNoteTagProps> = ({ navigation }) => {
    const tags = useOpeNoteStore(state => state.noteTags);

    const { themeColors } = useUnifiedTheme();

    const handleAddTag = useCallback((tagInput: string) => {
        const { addTag } = useOpeNoteStore.getState();

        if (tagInput.trim() !== '') {
            addTag(tagInput.trim());
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        const { setMessageType, setMessageText } = useNavigationStore.getState();
        try {
            const { createNote } = useNoteStore.getState();
            const { noteIntroduce, noteContent, noteTitle, noteTags } = useOpeNoteStore.getState();

            // 类型转换：将 Note 类型转换为 CreateNoteRequest 类型
            const createNoteRequest: CreateNoteRequest = {
                title: noteTitle,
                description: noteIntroduce,
                content: noteContent,
                tags: noteTags,
            };

            const createdNote = await NoteService.createNote(createNoteRequest);

            if ('success' in createdNote) {
                throw new Error(createdNote.message);
            } else {
                setMessageType('success');
                setMessageText('创建笔记成功');

                // 创建成功后，更新本地 store
                createNote({
                    noteId: createdNote.noteId,
                    displayId: createdNote.displayId,
                    title: createdNote.title,
                    content: createdNote.content,
                    introduce: createdNote.description,
                    tags: createdNote.tags,
                    createdAt: createdNote.createdTime,
                    lastModified: createdNote.updatedTime,
                });

                // 特殊处理 - 返回上一页
                navigation.goBack();
                navigation.goBack();
                navigation.goBack();
            }
        } catch (error: any) {
            setMessageType('danger');
            setMessageText(error?.message ?? error ?? '创建笔记失败');
            console.log('创建笔记失败:', error?.message ?? error);
        }
    }, [navigation]);

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
                title={'创建新笔记'}
                renderItemAccessory={() => <></>}
            />
            <Divider />
            <View style={[
                styles.container,
                { backgroundColor: themeColors['bg-100'] },
            ]}>
                <TagsEditor
                    title="添加标签"
                    tags={tags}
                    onAddTag={handleAddTag}
                    onRemoveTag={(tagIndex) => {
                        const removeTag = useOpeNoteStore.getState().removeTag;
                        removeTag(tagIndex);
                    }}
                    onSubmit={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
});

export default CreateNoteTag;
