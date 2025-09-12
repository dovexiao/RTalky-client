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

const NoteReader: React.FC<NoteReaderProps> = ({ navigation, route }) => {
    const { noteId } = route.params;
    const notes = useNoteStore(state => state.notes);
    const currentPage = useNoteReaderStore(state => state.currentPage);

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
        <SafeAreaView style={styles.safeArea}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF'}} />
            <TopNavigationOpe
                title={'笔记详情'}
                renderItemAccessory={renderItemAccessory}
            />
            <Divider />

            <PagerController notes={notes} currentNoteId={noteId} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'column',
        // justifyContent: 'center',
        // marginBottom: 8,
    },
    cardId: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginRight: 16,
        color: '#333333',
        // marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // color: '#555555',
        color: '#000000',
        marginBottom: 8,
    },
    introduction: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 8,
    },
    creationInfo: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 16,
    },
    contentContainer: {
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    contentText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },
    tagsContainer: {
        marginVertical: 10,
    },
    tagsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 16,
        color: '#555555',
    },
    footer: {
        justifyContent: 'center',
        // borderTopWidth: 1,
        // borderTopColor: '#EEEEEE',
        // paddingTop: 12,
        marginTop: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        // margin: 8,
        padding: 12,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NoteReader;
