import React, {
    createContext, useCallback,
    useContext, useEffect,
    useRef,
} from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Note } from '@/note/noteLibrary/types';
import { useNoteReaderStore } from '../stores';
import {
    ButtonControls,
    ContainerAPI,
    // LongPressWrapper,
    NoteDetailContent,
    NotePagerContainer,
    TiltObserver,
    TiltObserverAPI,
} from '@/note/noteReader/components';
import ShakeUnlockButton from '@/note/noteReader/components/ShakeUnlockButton.tsx';
import { useGlobal } from '@/contexts';

const { width: screenWidth } = Dimensions.get('window');

interface PagerContextType {
    goNext: () => void;
    goPrev: () => void;
    resetScrollViewPosition: (noteId: string) => void;
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
    const scrollViewRefs = useRef<Map<string, ScrollView>>(new Map());
    const TiltObserverRef = useRef<TiltObserverAPI>(null);

    const currentPage = useNoteReaderStore((state) => state.currentPage);

    const { toastShow } = useGlobal();

    // 设置 ScrollView 引用
    const setScrollViewRef = useCallback((noteId: string, ref: ScrollView | null) => {
        if (ref) {
            scrollViewRefs.current.set(noteId, ref);
        } else {
            scrollViewRefs.current.delete(noteId);
        }
    }, []);

    // 重置指定 ScrollView 的滚动位置
    const resetScrollViewPosition = useCallback((noteId: string) => {
        const scrollView = scrollViewRefs.current.get(noteId);
        scrollView?.scrollTo({ y: 0, animated: false });
    }, []);

    // 翻页控制方法
    const goNext = useCallback(() => {
        const page = containerRef.current?.getCurrentPage() ?? currentPage;
        console.log('goNext', page);
        if (page >= notes.length - 1) {
            return;
        }
        resetScrollViewPosition(notes[page].noteId);
        const nextPage = Math.min(page + 1, notes.length - 1);
        containerRef.current?.scrollToPage(nextPage);
    }, [currentPage, notes, resetScrollViewPosition]);

    const goPrev = useCallback(() => {
        const page = containerRef.current?.getCurrentPage() ?? currentPage;
        console.log('goPrev', page);
        if (page <= 0) {
            return;
        }
        resetScrollViewPosition(notes[page].noteId);
        const prevPage = Math.max(page - 1, 0);
        containerRef.current?.scrollToPage(prevPage);
    }, [currentPage, notes, resetScrollViewPosition]);

    const contextValue: PagerContextType = {
        goNext,
        goPrev,
        resetScrollViewPosition,
    };

    const renderItem = ({ item }: { item: Note }) => (
        <ScrollView
            ref={(ref) => setScrollViewRef(item.noteId, ref)}
            key={item.noteId}
            style={{ flex: 1, width: screenWidth }}
        >
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
            {/*<LongPressWrapper*/}
            {/*    onLongPressStart={() => {*/}
            {/*        // TiltObserverRef.current?.start();*/}
            {/*    }}*/}
            {/*    onLongPressEnd={() => {*/}
            {/*        // TiltObserverRef.current?.stop();*/}
            {/*    }}*/}
            {/*>*/}
            {/*</LongPressWrapper>*/}
            <ButtonControls />
            <TiltObserver
                ref={TiltObserverRef}
                initialFrequency={1000}
                maxFrequency={200}
                acceleration={100}
                onLeftTilt={goPrev}
                onRightTilt={goNext}
            />
            <ShakeUnlockButton
                longPressDuration={1000}
                onShow={() => {
                    toastShow('请长按锁定按钮持续一秒解锁倾斜翻页服务', { type: 'success' });
                }}
                onUnlock={() => {
                    toastShow('倾斜手机翻页服务已解锁, 请保持手机屏幕朝向自己，顶部向上的正常握持姿势', { type: 'success' });
                    TiltObserverRef.current?.start();
                }}
                onLock={() => {
                    toastShow('倾斜翻页服务已上锁', { type: 'success' });
                    TiltObserverRef.current?.stop();
                }}
            />
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
