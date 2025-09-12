import React, { forwardRef, useImperativeHandle } from 'react';
import {Dimensions, RefreshControl, StyleSheet} from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedRef,
    runOnJS,
    useAnimatedProps,
} from 'react-native-reanimated';
import { Note } from '../../noteLibrary/types';
import { useNoteReaderStore } from '../stores';

const { width: screenWidth } = Dimensions.get('window');

type ContainerAPI = {
    scrollToPage: (page: number) => void;
    getCurrentPage: () => number;
    setScrollEnabled: (enabled: boolean) => void;
};

interface NotePagerContainerProps {
    notes: Note[];
    initialScrollIndex: number,
    renderItem: ({ item }: { item: Note }) => JSX.Element;
}

const NotePagerContainer = forwardRef<ContainerAPI, NotePagerContainerProps>(
    ({ notes, initialScrollIndex, renderItem }, ref) => {
        const scrollX = useSharedValue(0);
        const flatListRef = useAnimatedRef<Animated.FlatList<Note>>();
        const isScrollEnabled = useSharedValue(true);

        const setCurrentPage = useNoteReaderStore.getState().setCurrentPage;

        // 暴露API给控制层
        useImperativeHandle(ref, () => ({
            scrollToPage: (page: number) => {
                flatListRef.current?.scrollToIndex({
                    index: page,
                    animated: true,
                });
            },
            getCurrentPage: () => {
                return Math.round(scrollX.value / screenWidth);
            },
            setScrollEnabled: (enabled) => {
                isScrollEnabled.value = enabled;
            },
        }));

        const scrollHandler = useAnimatedScrollHandler({
            onScroll: (event) => {
                scrollX.value = event.contentOffset.x;
                const page = Math.round(scrollX.value / screenWidth);
                runOnJS(setCurrentPage)(page);
            },
            onMomentumEnd: (event) => {
                scrollX.value = event.contentOffset.x;
                const page = Math.round(scrollX.value / screenWidth);
                runOnJS(setCurrentPage)(page);
            },
        });

        const animatedProps = useAnimatedProps(() => {
            return {
                scrollEnabled: isScrollEnabled.value,
            };
        });

        return (
            <Animated.FlatList
                ref={flatListRef}
                animatedProps={animatedProps}
                data={notes}
                renderItem={renderItem}
                initialScrollIndex={initialScrollIndex}
                initialNumToRender={10}
                keyExtractor={(item) => item.noteId}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                onMomentumScrollEnd={scrollHandler}
                // scrollEnabled={isScrollEnabled.value}
                style={styles.container}
                getItemLayout={(data, index) => ({
                    length: screenWidth, // 每个item的高度
                    offset: screenWidth * index, // 累加偏移量
                    index,
                })}
                removeClippedSubviews={false}
            />
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default NotePagerContainer;
export type { ContainerAPI };
