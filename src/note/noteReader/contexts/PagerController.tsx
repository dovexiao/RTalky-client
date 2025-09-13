import React, {
    createContext,
    useContext, useEffect,
    useRef,
} from 'react';
import { Dimensions, ScrollView } from 'react-native';
import NotePagerContainer, { ContainerAPI } from '../components/NotePagerContainer.tsx';
import ButtonControls from '../components/ButtonControls.tsx';
import NoteDetailContent from '../components/NoteDetailContent.tsx';
import { Note } from '../../noteLibrary/types';
import { useNoteReaderStore } from '../stores';

const { width: screenWidth } = Dimensions.get('window');

interface PagerContextType {
    goNext: () => void;
    goPrev: () => void;
}

const PagerContext = createContext<PagerContextType | null>(null);

interface PagerControllerProps {
    notes: Note[];
    currentNoteId: string;
}

export const PagerController: React.FC<PagerControllerProps> = ({
    notes,
    currentNoteId,
}) => {
    const containerRef = useRef<ContainerAPI>(null);

    const currentPage = useNoteReaderStore((state) => state.currentPage);

    // 翻页控制方法
    const goNext = () => {
        const nextPage = Math.min(currentPage + 1, notes.length - 1);
        containerRef.current?.scrollToPage(nextPage);
    };

    const goPrev = () => {
        const prevPage = Math.max(currentPage - 1, 0);
        containerRef.current?.scrollToPage(prevPage);
    };

    const contextValue: PagerContextType = {
        goNext,
        goPrev,
    };

    const renderItem = ({ item }: { item: Note }) => (
        <ScrollView style={{ flex: 1, width: screenWidth }}>
            <NoteDetailContent note={item} />
        </ScrollView>
    );

    useEffect(() => {
        const { setCurrentPage, setPageCount } = useNoteReaderStore.getState();
        setCurrentPage(notes.findIndex((note) => note.noteId === currentNoteId) || 0);
        setPageCount(notes.length);
    }, [currentNoteId, notes]);

    return (
        <PagerContext.Provider value={contextValue}>
            <NotePagerContainer
                ref={containerRef}
                notes={notes}
                initialScrollIndex={currentPage}
                renderItem={renderItem}
            />
            <ButtonControls />
        </PagerContext.Provider>
    );
};

// Hook 用于访问控制器
export const usePagerController = () => {
    const context = useContext(PagerContext);
    if (!context) {
        throw new Error('usePagerController must be used within PagerController');
    }
    return context;
};
