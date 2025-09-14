import React from 'react';
import { useOpeNoteStore } from '../stores';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';

export const NoteTitleEditor = () => {
    const title = useOpeNoteStore(state => state.noteTitle);

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
                笔记标题
            </Text>
            <Input
                value={title}
                onChangeText={(value) => {
                    const setTitle = useOpeNoteStore.getState().setNoteTitle;
                    setTitle(value);
                }}
                textStyle={styles.contentInput}
                multiline={true}
                placeholder="请输入笔记标题"
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
    },
    contentInput: {
        // borderWidth: 1,
        // borderColor: '#E0E0E0',
        // borderRadius: 4,
        // padding: 12,
        minHeight: 50,
        fontSize: 16,
        // lineHeight: 20,
        // color: '#333',
        textAlignVertical: 'top',
    },
});
