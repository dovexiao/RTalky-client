import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Divider } from '@ui-kitten/components';
import { formatTime } from '@utils/formatTime.ts';
// import { getTagColor } from '@utils/getTagColor.ts';
import { NoteService } from '@/note/services';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { Note } from '@/note/noteLibrary/types';
import { useGlobal, useUnifiedTheme } from '@/contexts';
import MarkdownRenderer from './MarkdownRenderer';

const { height: screenHeight } = Dimensions.get('window');

// 定义props类型
interface NoteDetailContentProps {
    note: Note;
}

const NoteDetailContent = ({ note }: NoteDetailContentProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    const { themeColors } = useUnifiedTheme();
    const { toastShow } = useGlobal();

    // 检查是否需要获取笔记详情
    useEffect(() => {
        const fetchNoteDetail = async () => {
            // 如果 content 为空或只有空白字符，则获取详情
            try {
                setIsLoading(true);
                const noteDetail = await NoteService.getNoteDetail(note.noteId);

                if ('success' in noteDetail) {
                    throw new Error('笔记详情获取失败');
                } else {
                    // 将 NoteResponse 转换为 Note 类型
                    const updatedNote: Note = {
                        noteId: noteDetail.noteId,
                        displayId: noteDetail.displayId,
                        title: noteDetail.title,
                        content: noteDetail.content,
                        introduce: noteDetail.description,
                        tags: noteDetail.tags,
                        createdAt: noteDetail.createdTime,
                        lastModified: noteDetail.updatedTime,
                    };

                    // 更新本地状态
                    setCurrentNote(updatedNote);

                    // 更新 store 中的笔记数据
                    const { updateNote } = useNoteStore.getState();
                    updateNote(updatedNote);
                }
            } catch (error: any) {
                toastShow(error.message ?? error ?? '笔记详情获取失败', { type: 'danger' });
                console.log('获取笔记详情失败:', error.message ?? error);
                // 如果获取失败，保持原有状态
            } finally {
                setIsLoading(false);
            }
        };

        if (!note.content || note.content.trim() === '') {
            fetchNoteDetail();
        } else {
            console.log('笔记内容非空，无需获取详情');
            setCurrentNote(note);
        }
    }, [note]);

    // 如果正在加载，显示加载指示器
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors['primary-200']} />
                <Text style={[
                    styles.loadingText,
                    { color: themeColors['primary-200'] },
                ]}>
                    加载笔记内容中...
                </Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <View style={styles.header}>
                <Text
                    style={[
                        styles.title,
                        { color: themeColors['text-100'] },
                    ]}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                >
                    {currentNote?.title}
                </Text>
                <Text
                    style={[
                        styles.introduction,
                        { color: themeColors['text-100'] },
                    ]}
                    // ellipsizeMode={'tail'}
                    // numberOfLines={3}
                >
                    {currentNote?.introduce}
                </Text>
            </View>

            <Text style={[
                styles.creationInfo,
                { color: themeColors['text-200'] },
            ]}>
                {(currentNote?.createdAt && formatTime(currentNote.createdAt, { format: 'datetime' })) ?? ''}
            </Text>

            <Divider style={{
                marginBottom: 10,
                backgroundColor: themeColors['bg-300'],
            }} />

            <MarkdownRenderer content={currentNote?.content ?? ''} />

            <Divider style={{
                marginVertical: 10,
                backgroundColor: themeColors['bg-300'],
            }} />

            {currentNote?.tags && currentNote.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: themeColors['text-100'] },
                    ]}>
                        标签
                    </Text>
                    <View style={styles.tagsList}>
                        {currentNote.tags.map((tag: string, index: number) => (
                            <View
                                key={index}
                                style={[styles.tag, { backgroundColor: themeColors['bg-300'] }]}
                            >
                                <Text style={[
                                    styles.tagText,
                                    { color: themeColors['text-200'] },
                                ]}>
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                <Text style={[
                    styles.footerText,
                    { color: themeColors['text-200'] },
                ]}>
                    最近修改: {(currentNote?.lastModified && formatTime(currentNote.lastModified, { format: 'datetime' })) ?? ''}
                </Text>
            </View>
            <View style={{ height: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        marginTop: screenHeight / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    header: {
        flexDirection: 'column',
        // justifyContent: 'center',
        // marginBottom: 8,
    },
    cardId: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginRight: 16,
        color: '#333333',
        // marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // color: '#555555',
        color: '#000000',
        marginBottom: 8,
    },
    introduction: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 8,
    },
    creationInfo: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 16,
    },
    contentContainer: {
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    contentText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },
    tagsContainer: {
        marginVertical: 10,
    },
    tagsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        // marginRight: 8,
        // marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#555555',
    },
    footer: {
        justifyContent: 'center',
        // borderTopWidth: 1,
        // borderTopColor: '#EEEEEE',
        // paddingTop: 12,
        marginTop: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        // margin: 8,
        padding: 12,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NoteDetailContent;
