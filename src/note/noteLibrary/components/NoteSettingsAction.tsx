import { Text } from '@ui-kitten/components';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import DeleteNoteAction from './DeleteNoteAction.tsx';
import EditIntroduceAction, { EditIntroduceActionAPI } from './EditIntroduceAction.tsx';
import RenameNoteAction, { RenameNoteActionAPI } from './RenameNoteAction.tsx';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { NoteService } from '@/note/services';
import { useUnifiedTheme } from '@/contexts';

type ColumnCount = 1 | 2 | 3 | 4;

export const NoteSettingsAction = ({
    cardId,
    // columnCount = 3 as ColumnCount
}: {
    cardId: string,
    // columnCount?: ColumnCount
}) => {
    const { toastShow } = useGlobal();
    const note = useNoteStore(state => state.notes.filter(n => n.noteId === cardId)[0]);

    const renameNoteActionRef = useRef<RenameNoteActionAPI>(null);
    const editIntroduceActionRef = useRef<EditIntroduceActionAPI>(null);

    const columnCount: ColumnCount = 3;

    const { themeColors } = useUnifiedTheme();

    // 根据列数计算宽度（%）
    const getWidthByColumn = (columns: ColumnCount): number => {
        const widthMap = {
            1: 100,
            2: 45,
            3: 30,
            4: 23,
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

    const renameNoteDialog = async () => {
        try {
            const title = renameNoteActionRef.current?.getTitle();
            const newTitle = title?.trim();

            if (!newTitle || newTitle === note.title) {
                return; // 如果没有输入新标题或标题没有变化，直接返回
            }

            // 调用 API 重命名笔记
            const updatedNote = await NoteService.renameNote(cardId, { title: newTitle });

            if ('success' in updatedNote) {
                throw new Error(updatedNote.message);
            } else {
                toastShow('笔记重命名成功', { type: 'success', position: 'bottom' });
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
                useNoteStore.getState().hideNoteActionDialog();
            }

        } catch (error: any) {
            console.error('重命名笔记失败:', error);
            toastShow(`重命名笔记失败, ${error.message || '重命名笔记失败，请稍后重试'}`, { type: 'danger', position: 'bottom' });
        }
    };

    const editIntroduceDialog = async () => {
        try {
            const introduce = editIntroduceActionRef.current?.getIntroduce();
            const newIntroduce = introduce?.trim();

            if (!newIntroduce || newIntroduce === note.introduce) {
                return; // 如果没有输入新简介或简介没有变化，直接返回
            }

            // 调用 API 修改笔记简介
            const updatedNote = await NoteService.updateNoteDescription(cardId, { description: newIntroduce });

            if ('success' in updatedNote) {
                throw new Error(updatedNote.message);
            } else {
                toastShow('笔记简介修改成功', { type: 'success', position: 'bottom' });
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
                useNoteStore.getState().hideNoteActionDialog();
            }
        } catch (error: any) {
            console.log('修改笔记简介失败:', error);
            toastShow(`修改笔记简介失败, ${error.message || '修改笔记简介失败，请稍后重试'}`, { type: 'danger', position: 'bottom' })
        }
    };

    const deleteNoteDialog = async () => {
        try {
            // 调用 API 删除笔记
            await NoteService.deleteNote(cardId);

            toastShow('笔记删除成功', { type: 'success', position: 'bottom' });

            // 从本地 store 中删除笔记
            const { deleteNote } = useNoteStore.getState();
            deleteNote(cardId);

            // 关闭对话框
            useNoteStore.getState().hideNoteActionDialog();
        } catch (error: any) {
            console.error('删除笔记失败:', error);
            toastShow(`删除笔记失败, ${error.message || '删除笔记失败，请稍后重试'}`, { type: 'danger', position: 'bottom' });
        }
    }

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-200'] },
        ]}>
            <View style={[
                styles.titleContainer,
                { backgroundColor: themeColors['bg-200'] },
            ]}>
                <Text style={[
                    styles.titleText,
                    { color: themeColors['text-100'] },
                ]}>
                    设置
                </Text>
            </View>
            <View style={[
                styles.actionContent,
                { backgroundColor: themeColors['bg-200'] },
            ]}>
                {/* 操作项列表 */}
                <TouchableOpacity
                    style={[
                        styles.actionObject,
                        {
                            width: `${getWidthByColumn(columnCount)}%`,
                            borderTopColor: themeColors['primary-200'],
                            // backgroundColor: themeColors['primary-200'],
                        },
                    ]}
                    onPress={() => {
                        useNoteStore.getState().showNoteActionDialog(
                            <RenameNoteAction ref={renameNoteActionRef} cardId={cardId} />,
                            renameNoteDialog,
                        );
                    }}
                >
                    <Text style={[
                        styles.actionText,
                        // { color: themeColors['accent-200'] },
                    ]}>
                        重命名
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionObject,
                        {
                            width: `${getWidthByColumn(columnCount)}%`,
                            borderTopColor: themeColors['primary-200'],
                            // backgroundColor: themeColors['primary-200'],
                        },
                    ]}
                    onPress={() => {
                        useNoteStore.getState().showNoteActionDialog(
                            <EditIntroduceAction ref={editIntroduceActionRef} cardId={cardId} />,
                            editIntroduceDialog,
                        );
                    }}
                >
                    <Text style={[
                        styles.actionText,
                        // { color: themeColors['accent-200'] },
                    ]}>
                        修改简介
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionObject,
                        {
                            width: `${getWidthByColumn(columnCount)}%`,
                            borderTopColor: themeColors['primary-200'],
                            // backgroundColor: themeColors['primary-200'],
                        },
                    ]}
                    onPress={() => {
                        useNoteStore.getState().showNoteActionDialog(
                            <DeleteNoteAction />,
                            deleteNoteDialog,
                        );
                    }}
                >
                    <Text style={[
                        styles.actionText,
                        // { color: themeColors['accent-200'] },
                    ]}>
                        删除
                    </Text>
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
        paddingTop: 14,
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
    },
    actionObject: {
        // 宽度由动态计算传入，此处不固定
        height: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 8,
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
        color: '#000000',
    },
});

export default NoteSettingsAction;
