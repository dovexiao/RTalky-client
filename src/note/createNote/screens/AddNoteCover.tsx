import React, {useEffect} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
} from 'react-native';
import { Button, Divider } from '@ui-kitten/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { useOpeNoteStore } from '../stores';
import { NoteIntroduceEditor, NoteTitleEditor } from '../components';
import { AddNoteCoverProps } from '../types';
import { useUnifiedTheme } from '@/contexts';

const AddNoteCover: React.FC<AddNoteCoverProps> = ({ navigation }) => {
    const { themeColors } = useUnifiedTheme();

    useEffect(() => {
        const reset = useOpeNoteStore.getState().reset;
        reset();

        return () => {
            reset();
        };
    }, []);

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
                title={'创建新笔记'}
                renderItemAccessory={() => <></>}
            />
            <Divider />

            <View style={[
                styles.container,
                { backgroundColor: themeColors['bg-100'] },
            ]}>
                <ScrollView style={{
                    flex: 1,
                    backgroundColor: themeColors['bg-100'],
                }}>
                    <NoteTitleEditor />

                    <NoteIntroduceEditor />

                    <NextStepButton navigation={navigation}/>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const NextStepButton = ({ navigation }: { navigation: any }) => {
    const isOpeHeaderDisabled = useOpeNoteStore(state => state.isOpeHeaderDisabled);

    const handleNext = () => {
        const state = useOpeNoteStore.getState();
        navigation.navigate('AddNoteContent', {
            note: {
                title: state.noteTitle,
                introduce: state.noteIntroduce,
            },
        });
    };

    return (
        <Button style={styles.nextButton} onPress={handleNext} disabled={isOpeHeaderDisabled}>
            <Text style={styles.nextButtonText}>下一步</Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        paddingBottom: 0,
    },
    nextButton: {
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 10,
        // backgroundColor: '#3366FF',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddNoteCover;
