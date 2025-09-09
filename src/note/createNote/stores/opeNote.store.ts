import { create } from 'zustand';
import { Note } from '../../noteLibrary/types';

interface OpeNoteStore {
    noteId: string;
    noteTitle: string;
    noteContent: string;
    noteIntroduce: string;
    noteTags: string[];
    isOpeDisabled: boolean;
    isOpeHeaderDisabled: boolean;
    isOpeContentDisabled: boolean;

    // 初始化方法
    initialize: (note: Note) => void;

    // 状态更新方法
    setNoteTitle: (title: string) => void;
    setNoteContent: (content: string) => void;
    setNoteIntroduce: (introduce: string) => void;

    // 标签操作
    addTag: (tag: string) => void;
    removeTag: (index: number) => void;

    validateHeader: () => void;
    validateContent: () => void;
    validateForm: () => void;
    reset: () => void;
}

export const useOpeNoteStore = create<OpeNoteStore>((set, get) => ({
    noteId: '',
    noteTitle: '',
    noteContent: '',
    noteIntroduce: '',
    noteTags: [],
    isOpeDisabled: true,
    isOpeHeaderDisabled: true,
    isOpeContentDisabled: true,

    initialize: (note: Note) => {
        set({
            noteId: note.noteId,
            noteTitle: note.title,
            noteIntroduce: note.introduce,
            noteContent: note.content,
            noteTags: note.tags,
            isOpeDisabled: true,
            isOpeHeaderDisabled: true,
            isOpeContentDisabled: true,
        });
        get().validateForm();
    },

    setNoteTitle: (title: string) => {
        set({noteTitle: title});
        get().validateHeader();
    },

    setNoteContent: (content: string) => {
        set({noteContent: content});
        get().validateContent();
    },

    setNoteIntroduce: (introduce: string) => {
        set({noteIntroduce: introduce});
        get().validateHeader();
    },

    addTag: (tag) => {
        if (tag.trim() !== '') {
            set({noteTags: [...get().noteTags, tag.trim()]});
            get().validateForm();
        }
    },

    removeTag: (index) => {
        const newTags = [...get().noteTags];
        newTags.splice(index, 1);
        set({noteTags: newTags});
        get().validateForm();
    },

    validateHeader: () => {
        set({
            isOpeHeaderDisabled: get().noteTitle.trim() === '' || get().noteIntroduce.trim() === '',
        });
    },

    validateContent: () => {
        set({
            isOpeContentDisabled: get().noteContent.trim() === '',
        });
    },

    validateForm: () => {
        set({
            isOpeDisabled: get().noteTitle.trim() === '' || get().noteIntroduce.trim() === '' || get().noteContent.trim() === '',
        });
    },

    reset: () => {
        set({
            noteId: '',
            noteTitle: '',
            noteContent: '',
            noteIntroduce: '',
            noteTags: [],
            isOpeDisabled: true,
            isOpeHeaderDisabled: true,
            isOpeContentDisabled: true,
        });
    },
}));
