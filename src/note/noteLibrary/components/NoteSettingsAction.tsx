import { Text } from '@ui-kitten/components';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import DeleteNoteAction from './DeleteNoteAction.tsx';
import EditIntroduceAction, { EditIntroduceActionAPI } from './EditIntroduceAction.tsx';
import RenameNoteAction, { RenameNoteActionAPI } from './RenameNoteAction.tsx';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { NoteService } from '@/note/services';

type ColumnCount = 1 | 2 | 3 | 4;

export const NoteSettingsAction = ({
    cardId,
    // columnCount = 3 as ColumnCount
}: {
    cardId: string,
    // columnCount?: ColumnCount
}) => {
    const { actionDialogRef, bottomActionSheetRef } = useGlobal();
    const note = useNoteStore(state => state.notes.filter(n => n.noteId === cardId)[0]);

    const renameNoteActionRef = useRef<RenameNoteActionAPI>(null);
    const editIntroduceActionRef = useRef<EditIntroduceActionAPI>(null);

    const columnCount: ColumnCount = 3;

    // 根据列数计算宽度（%）
    const getWidthByColumn = (columns: ColumnCount): number => {
        const widthMap = {
            1: 100,
            2: 45,
            3: 30,
            4: 23
        };
        return widthMap[columns];
    };

    // 生成空白占位元素（数量 = 列数 - 1）
    const renderEmptyPlaceholders = () => {
        const placeholders = [];
        for (let i = 0; i < columnCount - 1; i++) {
            placeholders.push(
                <View
                    key={`empty-${i}`}
                    style={[styles.actionObject, {
                        height: 0,
                        borderTopWidth: 0,
                        marginBottom: 0,
                        width: `${getWidthByColumn(columnCount)}%` // 保持与操作项相同宽度
                    }]}
                />
            );
        }
        return placeholders;
    };

    const renameNote = async () => {
        try {
            const title = renameNoteActionRef.current?.getTitle();
            const newTitle = title?.trim();

            if (!newTitle || newTitle === note.title) {
                return; // 如果没有输入新标题或标题没有变化，直接返回
            }

            // 调用 API 重命名笔记
            const updatedNote = await NoteService.renameNote(cardId, { title: newTitle });

            // 将 NoteResponse 转换为 Note 类型并更新本地 store
            const { updateNote } = useNoteStore.getState();
            updateNote({
                noteId: updatedNote.noteId,
                title: updatedNote.title,
                content: updatedNote.content,
                introduce: updatedNote.description,
                tags: updatedNote.tags,
                createdAt: updatedNote.createdTime,
                lastModified: updatedNote.updatedTime,
            });

            // 关闭对话框
            actionDialogRef.current?.hide();
        } catch (error: any) {
            console.error('重命名笔记失败:', error);
            Alert.alert('重命名失败', error.message || '重命名笔记失败，请稍后重试');
        }
    };

    const editIntroduce = async () => {
        try {
            const introduce = editIntroduceActionRef.current?.getIntroduce();
            const newIntroduce = introduce?.trim();

            if (!newIntroduce || newIntroduce === note.introduce) {
                return; // 如果没有输入新简介或简介没有变化，直接返回
            }

            // 调用 API 修改笔记简介
            const updatedNote = await NoteService.updateNoteDescription(cardId, { description: newIntroduce });

            // 将 NoteResponse 转换为 Note 类型并更新本地 store
            const { updateNote } = useNoteStore.getState();
            updateNote({
                noteId: updatedNote.noteId,
                title: updatedNote.title,
                content: updatedNote.content,
                introduce: updatedNote.description,
                tags: updatedNote.tags,
                createdAt: updatedNote.createdTime,
                lastModified: updatedNote.updatedTime,
            });

            // 关闭对话框
            actionDialogRef.current?.hide();
        } catch (error: any) {
            console.error('修改笔记简介失败:', error);
            Alert.alert('修改失败', error.message || '修改笔记简介失败，请稍后重试');
        }
    };

    const deleteNote = async () => {
        try {
            // 调用 API 删除笔记
            await NoteService.deleteNote(cardId);

            // 从本地 store 中删除笔记
            const { deleteNote } = useNoteStore.getState();
            deleteNote(cardId);

            // 关闭对话框和底部操作表
            actionDialogRef.current?.hide();
            bottomActionSheetRef.current?.hide();
        } catch (error: any) {
            console.error('删除笔记失败:', error);
            Alert.alert('删除失败', error.message || '删除笔记失败，请稍后重试');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>设置</Text>
            </View>
            <View style={styles.actionContent}>
                {/* 操作项列表 */}
                <TouchableOpacity
                    style={[styles.actionObject, { width: `${getWidthByColumn(columnCount)}%` }]}
                    onPress={() => {
                        actionDialogRef.current?.show({
                            content: <RenameNoteAction ref={renameNoteActionRef} cardId={cardId} />,
                            onConfirm: renameNote,
                        });
                    }}
                >
                    <Text style={styles.actionText}>重命名</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionObject, { width: `${getWidthByColumn(columnCount)}%` }]}
                    onPress={() => {
                        actionDialogRef.current?.show({
                            content: <EditIntroduceAction ref={editIntroduceActionRef} cardId={cardId} />,
                            onConfirm: editIntroduce,
                        });
                    }}
                >
                    <Text style={styles.actionText}>修改简介</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionObject, { width: `${getWidthByColumn(columnCount)}%` }]}
                    onPress={() => {
                        actionDialogRef.current?.show({
                            content: <DeleteNoteAction />,
                            onConfirm: deleteNote,
                        });
                    }}
                >
                    <Text style={styles.actionText}>删除</Text>
                </TouchableOpacity>

                {/*/!* 新增的第四个操作项示例 *!/*/}
                {/*<TouchableOpacity*/}
                {/*    style={[styles.actionObject, { width: `${getWidthByColumn(columnCount)}%` }]}*/}
                {/*    onPress={() => {*/}
                {/*        // 新增操作逻辑*/}
                {/*        console.log("新增操作触发");*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Text style={styles.actionText}>新增操作</Text>*/}
                {/*</TouchableOpacity>*/}

                {/* 渲染空白占位元素 */}
                {renderEmptyPlaceholders()}
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
        padding: 6,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    actionContent: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap', // 允许换行
        justifyContent: 'space-around',
        padding: 12,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    actionObject: {
        // 宽度由动态计算传入，此处不固定
        height: 100,
        backgroundColor: '#FFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 4,
        borderTopColor: '#FD9B37',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    actionText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default NoteSettingsAction;
