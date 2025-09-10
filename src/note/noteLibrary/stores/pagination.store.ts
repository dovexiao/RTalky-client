import { create } from 'zustand';

interface PaginationState {
    // 分页状态
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;

    // 加载状态
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;

    // 错误状态
    error: string | null;

    // 分页控制方法
    setPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    resetPagination: () => void;

    // 加载状态控制
    setLoading: (loading: boolean) => void;
    setRefreshing: (refreshing: boolean) => void;
    setLoadingMore: (loadingMore: boolean) => void;

    // 错误处理
    setError: (error: string | null) => void;

    // 更新分页信息
    updatePaginationInfo: (info: {
        currentPage: number;
        totalElements: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }) => void;
}

export const usePaginationStore = create<PaginationState>((set, get) => ({
    // 初始状态
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,

    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,

    // 分页控制方法
    setPage: (page: number) => {
        set({ currentPage: page });
    },

    nextPage: () => {
        const { currentPage, hasNext } = get();
        if (hasNext) {
            set({ currentPage: currentPage + 1 });
        }
    },

    previousPage: () => {
        const { currentPage, hasPrevious } = get();
        if (hasPrevious) {
            set({ currentPage: currentPage - 1 });
        }
    },

    resetPagination: () => {
        set({
            currentPage: 0,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
            error: null,
        });
    },

    // 加载状态控制
    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setRefreshing: (refreshing: boolean) => {
        set({ isRefreshing: refreshing });
    },

    setLoadingMore: (loadingMore: boolean) => {
        set({ isLoadingMore: loadingMore });
    },

    // 错误处理
    setError: (error: string | null) => {
        set({ error });
    },

    // 更新分页信息
    updatePaginationInfo: (info) => {
        set({
            currentPage: info.currentPage,
            totalElements: info.totalElements,
            totalPages: info.totalPages,
            hasNext: info.hasNext,
            hasPrevious: info.hasPrevious,
        });
    },
}));
