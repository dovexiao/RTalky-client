import React, { useEffect, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    View,
    RefreshControl,
} from 'react-native';
import { Note } from '@/note/noteLibrary/types';
import { NoteCard } from './NoteCard';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { usePaginationStore } from '@/note/noteLibrary/stores';
import { useTheme } from '@ui-kitten/components';

interface NoteListProps {
    style?: any;
    contentContainerStyle?: any;
}

export const NoteList: React.FC<NoteListProps> = ({
    style,
    contentContainerStyle,
}) => {
    const notes = useNoteStore(state => state.notes);
    const loadNotes = useNoteStore(state => state.loadNotes);
    const loadMoreNotes = useNoteStore(state => state.loadMoreNotes);
    const refreshNotes = useNoteStore(state => state.refreshNotes);

    const themes = useTheme();

    const {
        isLoading,
        isRefreshing,
        isLoadingMore,
        error,
        hasNext,
        setLoading,
        setRefreshing,
        setLoadingMore,
        setError,
        updatePaginationInfo,
    } = usePaginationStore();

    // 初始化加载
    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                setError(null);
                await loadNotes(0, 10);
            } catch (err: any) {
                setError(err.message || '加载失败');
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // 下拉刷新
    const handleRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);
            await refreshNotes();
        } catch (err: any) {
            setError(err.message || '刷新失败');
        } finally {
            setRefreshing(false);
        }
    }, [refreshNotes, setRefreshing, setError]);

    // 加载更多
    const handleLoadMore = useCallback(async () => {
        if (isLoadingMore || !hasNext) return;

        try {
            setLoadingMore(true);
            setError(null);
            await loadMoreNotes();
        } catch (err: any) {
            setError(err.message || '加载更多失败');
        } finally {
            setLoadingMore(false);
        }
    }, [isLoadingMore, hasNext, loadMoreNotes, setLoadingMore, setError]);

    // 渲染列表项
    const renderItem = useCallback(({ item }: { item: Note }) => (
        <NoteCard note={item} />
    ), []);

    // 渲染加载更多指示器
    const renderFooter = useCallback(() => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={styles.footerText}>加载中...</Text>
            </View>
        );
    }, [isLoadingMore]);

    // 渲染空状态
    const renderEmpty = useCallback(() => {
        if (isLoading) return null;

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无笔记</Text>
            </View>
        );
    }, [isLoading]);

    // 渲染错误状态
    const renderError = useCallback(() => {
        if (!error) return null;

        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }, [error]);

    // 初始加载状态
    if (isLoading) {
        return (
            <View style={[styles.centerContainer, style]}>
                <ActivityIndicator size="large" color="#666" />
                <Text style={styles.loadingText}>加载中...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            {renderError()}
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item) => item.noteId}
                contentContainerStyle={[
                    styles.listContent,
                    contentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[themes['color-primary-500']]}
                        tintColor="#666"
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        margin: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        textAlign: 'center',
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});
