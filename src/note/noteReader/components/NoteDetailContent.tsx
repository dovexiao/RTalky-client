import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Divider } from '@ui-kitten/components';
import { formatTime } from '@utils/formatTime.ts';
import { getTagColor } from '@utils/getTagColor.ts';
import { NoteService } from '@/note/services';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { Note } from '@/note/noteLibrary/types';

// 定义props类型
interface NoteDetailContentProps {
    note: Note;
}

const NoteDetailContent = ({ note }: NoteDetailContentProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);
    const updateNote = useNoteStore(state => state.updateNote);

    // 检查是否需要获取笔记详情
    useEffect(() => {
        const fetchNoteDetail = async () => {
            // 如果 content 为空或只有空白字符，则获取详情
            if (!note.content || note.content.trim() === '') {
                try {
                    setIsLoading(true);
                    const noteDetail = await NoteService.getNoteDetail(note.noteId);

                    // 将 NoteResponse 转换为 Note 类型
                    const updatedNote: Note = {
                        noteId: noteDetail.noteId,
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
                    updateNote(updatedNote);
                } catch (error) {
                    console.error('获取笔记详情失败:', error);
                    // 如果获取失败，保持原有状态
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchNoteDetail();
    }, [note.noteId, note.content, updateNote]);

    // 如果正在加载，显示加载指示器
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#666" />
                <Text style={styles.loadingText}>加载笔记内容中...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} ellipsizeMode={'tail'} numberOfLines={1}>
                    {currentNote.title}
                </Text>
                <Text style={styles.introduction} ellipsizeMode={'tail'} numberOfLines={3}>
                    {currentNote.introduce}
                </Text>
            </View>

            <Text style={styles.creationInfo}>
                {formatTime(currentNote.createdAt, { format: 'datetime' })}
            </Text>

            <Divider style={{ marginBottom: 10 }} />

            <Markdown style={markdownStyles} rules={renderRules}>
                {currentNote.content.trim() || '暂无内容'}
            </Markdown>

            <Divider style={{ marginVertical: 10 }} />

            {currentNote.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    <Text style={styles.sectionTitle}>标签</Text>
                    <View style={styles.tagsList}>
                        {currentNote.tags.map((tag: string, index: number) => (
                            <View
                                key={index}
                                style={[styles.tag, { backgroundColor: getTagColor() }]}
                            >
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    最近修改: {formatTime(currentNote.lastModified, { format: 'datetime' })}
                </Text>
            </View>
            <View style={{ height: 40 }} />
        </View>
    );
};

const markdownStyles = StyleSheet.create({
    // 全局基础样式
    body: {
        fontSize: 16,
        lineHeight: 30,
        color: '#333',
        backgroundColor: '#fff',
        fontFamily: 'System',
    },

    // 标题优化
    heading1: {
        fontSize: 22,
        fontWeight: '800',
        // marginVertical: 10,
        color: '#1a1a1a',
        // borderBottomWidth: 1,
        // borderBottomColor: '#cbcbcb',
        // paddingBottom: 8,
    },
    heading2: {
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 5,
        color: '#222',
    },
    heading3: {
        fontSize: 18,
        fontWeight: '800',
        marginVertical: 5,
        color: '#333',
    },

    // 段落与引用
    paragraph: {
        marginVertical: 5,
    },
    blockquote: {
        backgroundColor: '#f2f2f2',
        borderLeftWidth: 4,
        borderColor: '#CCC',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 10,
        marginHorizontal: 8,
    },

    // 列表样式
    list_item: {
        flexDirection: 'row',
        marginVertical: 0,
    },
    bullet_list_icon: {
        marginRight: 10,
        fontSize: 16,
        color: '#222',
    },
    ordered_list_icon: {
        marginRight: 10,
        fontSize: 16,
        // fontWeight: 'bold',
        color: '#222',
    },

    // 代码块
    code_inline: {
        backgroundColor: '#f2f2f2',
        // color: '#ffffff',
        padding: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
    },
    code_block: {
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
        padding: 15,
        borderRadius: 6,
        marginVertical: 14,
    },
    fence: {
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
        padding: 15,
        borderRadius: 6,
        marginVertical: 14,
    },

    // 链接与图片
    link: {
        color: '#2980b9',
        textDecorationLine: 'underline',
    },
    image: {
        resizeMode: 'contain',
        height: 200,
        marginVertical: 10,
        borderRadius: 4,
    },

    // 表格优化
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginVertical: 12,
        marginHorizontal: 8,
    },
    th: {
        backgroundColor: '#f8f8f8',
        fontWeight: '700',
        padding: 10,
    },
    tr: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    td: {
        flex: 1,
        padding: 10,
    },
});

const renderRules = {
    image: (node: any, children: any, parent: any, styles:  any) => (
        <Image
            key={node.key}
            style={styles.image}
            source={{ uri: node.attributes.src }}
        />
    ),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
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
    },
    tag: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
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
