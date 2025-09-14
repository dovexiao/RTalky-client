import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Divider, TopNavigationAction } from '@ui-kitten/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { EditIcon } from '@/icon';
import { useNoteStore } from '@/note/noteLibrary/stores';
import { PagerController } from '../contexts';
import { NoteReaderProps } from '../types';
import { useNoteReaderStore } from '../stores';
import { useUnifiedTheme } from '@/contexts';

const NoteReader: React.FC<NoteReaderProps> = ({ navigation, route }) => {
    const { noteId } = route.params;
    const notes = useNoteStore(state => state.notes);
    const currentPage = useNoteReaderStore(state => state.currentPage);

    const { themeColors } = useUnifiedTheme();

    const renderItemAccessory = () => {
        return (
            <TopNavigationAction
                icon={EditIcon}
                onPress={() => {
                    navigation.navigate('EditNote', { noteId: notes[currentPage].noteId });
                }}
            />
        );
    };

    return (
        <SafeAreaView style={[
            styles.safeArea,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <View style={{
                height: StatusBar.currentHeight,
                backgroundColor: themeColors['bg-100'],
            }} />
            <TopNavigationOpe
                title={'笔记详情'}
                renderItemAccessory={renderItemAccessory}
            />
            <Divider style={{
                backgroundColor: themeColors['bg-100'],
            }} />

            <PagerController notes={notes} currentNoteId={noteId} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});

export default NoteReader;
