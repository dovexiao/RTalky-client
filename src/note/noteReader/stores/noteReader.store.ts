import { create } from 'zustand';

interface NoteReaderStore {
    currentPage: number;
    pageCount: number;

    setCurrentPage: (page: number) => void;
    setPageCount: (pageCount: number) => void;
}

export const useNoteReaderStore = create<NoteReaderStore>((set, get) => ({
    currentPage: 0,
    pageCount: 1,

    setCurrentPage: (page: number) => {
        set({ currentPage: page });
    },
    setPageCount: (pageCount: number) => {
        set({ pageCount: pageCount });
    },
}));
