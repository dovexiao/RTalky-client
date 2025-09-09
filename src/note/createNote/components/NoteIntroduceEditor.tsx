import React from 'react';
import { useOpeNoteStore } from '../stores';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '@ui-kitten/components';

export const NoteIntroduceEditor = () => {
    const introduce = useOpeNoteStore(state => state.noteIntroduce);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>笔记介绍</Text>
            <Input
                value={introduce.trim()}
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
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
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
