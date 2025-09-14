import React from'react';
import {
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import type { LearnBox } from '@/main/types';
import LearnBoxFC from '@/main/components/LearnBox.tsx';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { formatTime } from '@/utils';
import { useUnifiedTheme } from '@/contexts';

export const LearnMain = () => {
    const notes = useNoteStore(state => state.notes);
    const lastUpdated = useNoteStore(state => state.lastUpdated);

    const { themeColors } = useUnifiedTheme();

    const learnBoxes: LearnBox[] = [{
        id: '1',
        title: '笔记库',
        description: '写一篇笔记梳理你的学习知识',
        count: notes.length,
        lastUpdated: formatTime(lastUpdated, { format: 'relative' }),
        icon: 'file-text-outline',
        backgroundColor: '#E55A2B',
        countColor: '#FFF3E0',
        countTextColor: '#E55A2B',
        screen: 'NoteLibrary',
// }, {
//     id: '2',
//     title: '题目库',
//     description: '刷一道题目巩固你的学习知识',
//     count: '67 exercises',
//     lastUpdated: 'Today',
//     icon: 'book-open-outline',
//     backgroundColor: '#4F7CFF',
//     countColor: '#E3EDFF',
//     countTextColor: '#4F7CFF',
//     screen: 'QuestionBank',
    }];

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <ScrollView>
                <View style={styles.boxesContainer}>
                    { learnBoxes.map((item, index) => (<LearnBoxFC learnBox={item} index={index} key={item.id}/>)) }
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxesContainer: {
        padding: 20,
        paddingBottom: 10,
    },
});
