import { create } from 'zustand';
import { Note } from '../types';
import { NoteService, NoteInfo } from '@/note/services';

interface NoteStore {
    notes: Note[],
    lastUpdated: Date;
    createNote: (note: Note) => void;
    updateNote: (note: any) => void;
    deleteNote: (noteId: string) => void;

    // 分页相关方法
    loadNotes: (page?: number, size?: number) => Promise<void>;
    loadMoreNotes: () => Promise<void>;
    refreshNotes: () => Promise<void>;
    appendNotes: (newNotes: Note[]) => void;
    clearNotes: () => void;
}

// 将 NoteInfo 转换为 Note 类型的辅助函数
const convertNoteInfoToNote = (noteInfo: NoteInfo): Note => ({
    noteId: noteInfo.noteId,
    displayId: noteInfo.displayId,
    title: noteInfo.title,
    content: '',
    introduce: noteInfo.description,
    tags: noteInfo.tags,
    createdAt: noteInfo.createdTime,
    lastModified: noteInfo.updatedTime,
});

export const useNoteStore = create<NoteStore>((set, get) => ({
    notes: [],
    lastUpdated: new Date(),
    createNote: (note: Note) => {
        set((state) => ({
            notes: [...state.notes, { ...note }],
            // lastUpdated: new Date(),
        }));
    },
    updateNote: (note: any) => {
        set((state) => ({
            notes: state.notes.map((n) => (n.noteId === note.noteId ? {...n, ...note} : n)),
            // lastUpdated: new Date(),
        }));
    },
    deleteNote: (noteId: string) => {
        set((state) => ({
            notes: state.notes.filter((n) => n.noteId !== noteId),
            // lastUpdated: new Date(),
        }));
    },

    // 分页相关方法
    loadNotes: async (page = 0, size = 10) => {
        try {
            const response = await NoteService.getNoteList({ page, size });
            const convertedNotes = response.content.map(convertNoteInfoToNote);

            set({ notes: convertedNotes });
        } catch (error) {
            console.error('加载笔记失败:', error);
            throw error;
        }
    },

    loadMoreNotes: async () => {
        try {
            const { notes } = get();
            const nextPage = Math.floor(notes.length / 10);
            const response = await NoteService.getNoteList({ page: nextPage, size: 10 });
            const convertedNotes = response.content.map(convertNoteInfoToNote);

            set((state) => ({
                notes: [...state.notes.slice(0, Math.max(0, nextPage - 1) * 10), ...convertedNotes],
            }));
        } catch (error) {
            console.error('加载更多笔记失败:', error);
            throw error;
        }
    },

    refreshNotes: async () => {
        try {
            const response = await NoteService.getNoteList({ page: 0, size: 10 });
            const convertedNotes = response.content.map(convertNoteInfoToNote);

            set({ notes: convertedNotes });
        } catch (error) {
            console.error('刷新笔记失败:', error);
            throw error;
        }
    },

    appendNotes: (newNotes: Note[]) => {
        set((state) => ({
            notes: [...state.notes, ...newNotes],
        }));
    },

    clearNotes: () => {
        set({
            notes: [],
            // lastUpdated: new Date(),
        });
    },
}));

// const generateNoteId = (noteId: string) => {
//     const match = noteId.match(/^N(\d+)$/);
//     if (!match) {
//         return 'N001';
//     }
//
//     let numberPart = parseInt(match[1], 10) + 1;
//     const paddedNumber = numberPart.toString().padStart(3, '0');
//     return `N${paddedNumber}`;
// };

