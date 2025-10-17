import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import { Note } from '../types';
import { MoreOpeIcon } from '@/icon';
import { useUnifiedTheme } from '@/contexts';
import { useNoteStore } from '@/note/noteLibrary/stores';

interface NoteCardProps {
    note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { themeColors } = useUnifiedTheme();

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: themeColors['bg-200'] },
            ]}
            onPress={() => navigation.navigate('NoteReader', { noteId: note.noteId })}
        >
            <View style={styles.header}>
                <Text style={[
                    styles.cardId,
                    { color: themeColors['text-100'] },
                ]}>
                    {note.displayId}
                </Text>
                <Text
                    style={[
                        styles.title,
                        { color: themeColors['text-200'] },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                >
                    {note.title}
                </Text>
                {/*<TopNavigationAction icon={MoreOpeIcon} onPress={() => {*/}
                {/*    bottomActionSheetRef.current?.show(<SettingsActionModal />);*/}
                {/*}} />*/}
                <TouchableOpacity onPress={() => {
                    const { setNoteSettingsVisible: setVisible, setNoteSettingsNoteId: setNoteId } = useNoteStore.getState();
                    setVisible(true);
                    setNoteId(note.noteId);
                }}>
                    <MoreOpeIcon width={25} height={25} color={'#000'} />
                </TouchableOpacity>
            </View>

            <Text
                style={[
                    styles.introduce,
                    {
                        backgroundColor: themeColors['bg-100'],
                        color: themeColors['text-200'],
                    },
                ]}
                numberOfLines={2}
                ellipsizeMode={'tail'}
            >
                {note.introduce}
            </Text>

            <View style={styles.tagsContainer}>
                {note.tags.map((tag, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tag,
                            { backgroundColor: themeColors['bg-300'] },
                        ]}
                    >
                        <Text style={[
                            styles.tagText,
                            { color: themeColors['text-200'] },
                        ]}>
                            {tag}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cardId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        flex: 1,
    },
    icon: {
        fontSize: 16,
    },
    introduce: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 12,
        lineHeight: 20,
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 8,
    },
    meta: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 12,
        lineHeight: 20,
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxHeight: 25,
        overflow: 'hidden',
        // marginTop: 8,
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        // marginRight: 8,
        // marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        lineHeight: 16,
        color: '#555555',
    },
});
