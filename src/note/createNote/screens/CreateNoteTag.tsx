import React, { useState } from 'react';
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

const CreateNoteTag: React.FC<CreateNoteTagProps> = ({ navigation }) => {
    const [tagInput, setTagInput] = useState('');
    const tags = useOpeNoteStore(state => state.noteTags);

    const handleAddTag = () => {
        const addTag = useOpeNoteStore.getState().addTag;

        if (tagInput.trim() !== '') {
            addTag(tagInput.trim());
            setTagInput('');
        }
    };

    const handleSubmit = async () => {
        try {
            const createNote = useNoteStore.getState().createNote;
            const { noteIntroduce, noteContent, noteTitle } = useOpeNoteStore.getState();

            // 类型转换：将 Note 类型转换为 CreateNoteRequest 类型
            const createNoteRequest: CreateNoteRequest = {
                title: noteTitle,
                description: noteIntroduce,
                content: noteContent,
                tags,
            };

            const createdNote = await NoteService.createNote(createNoteRequest);

            // 创建成功后，更新本地 store
            createNote({
                noteId: createdNote.noteId,
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
        } catch (error: any) {
            console.error('创建笔记失败:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF'}} />
            <TopNavigationOpe
                title={'创建新笔记'}
                navigation={navigation}
                renderItemAccessory={() => <></>}
            />
            <Divider />
            <TagsEditor
                title="添加标签"
                tags={tags}
                tagInput={tagInput}
                setTagInput={setTagInput}
                onAddTag={handleAddTag}
                onRemoveTag={(tagIndex) => {
                    const removeTag = useOpeNoteStore.getState().removeTag;
                    removeTag(tagIndex);
                }}
                onSubmit={handleSubmit}
            />
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
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
});

export default CreateNoteTag;
