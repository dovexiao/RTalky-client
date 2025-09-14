import React from 'react';
import { useOpeNoteStore } from '../stores';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';

export const NoteIntroduceEditor = () => {
    const introduce = useOpeNoteStore(state => state.noteIntroduce);

    const { themeColors } = useUnifiedTheme();

    return (
        <View style={[
            styles.section,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <Text style={[
                styles.sectionTitle,
                { color: themeColors['text-100'] },
            ]}>
                笔记介绍
            </Text>
            <Input
                value={introduce}
                onChangeText={(value) => {
                    const setIntroduce = useOpeNoteStore.getState().setNoteIntroduce;
                    setIntroduce(value);
                }}
                textStyle={styles.contentInput}
                multiline={true}
                placeholder="请输入笔记介绍"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        // color: '#333',
    },
    contentInput: {
        // borderWidth: 1,
        // borderColor: '#E0E0E0',
        // borderRadius: 4,
        // padding: 12,
        minHeight: 100,
        fontSize: 16,
        // lineHeight: 22,
        // color: '#333',
        textAlignVertical: 'top',
    },
});
