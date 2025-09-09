import { create } from 'zustand';
import { Note } from '../types';
import { notes } from '../assets';

interface NoteStore {
    notes: Note[],
    createNote: (note: Note) => void;
    updateNote: (note: any) => void;
    deleteNote: (noteId: string) => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
    notes: notes as Note[],
    createNote: (note: Note) => {
        // const newQuestionId = generateNoteId(get().notes[get().notes.length - 1].noteId);
        set((state) => ({
            // notes: [...state.notes, { ...note, noteId: newQuestionId }],
            notes: [...state.notes, { ...note }],
        }));
    },
    updateNote: (note: any) => {
        set((state) => ({
            notes: state.notes.map((n) => (n.noteId === note.noteId ? {...n, ...note} : n)),
        }));
    },
    deleteNote: (noteId: string) => {
        set((state) => ({
            notes: state.notes.filter((n) => n.noteId !== noteId),
        }));
    },
}));

const generateNoteId = (noteId: string) => {
    const match = noteId.match(/^N(\d+)$/);
    if (!match) {
        return 'N001';
    }

    let numberPart = parseInt(match[1], 10) + 1;
    const paddedNumber = numberPart.toString().padStart(3, '0');
    return `N${paddedNumber}`;
};

