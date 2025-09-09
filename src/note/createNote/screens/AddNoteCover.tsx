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

const AddNoteCover: React.FC<AddNoteCoverProps> = ({ navigation }) => {
    useEffect(() => {
        const reset = useOpeNoteStore.getState().reset;
        reset();

        return () => {
            reset();
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#ffffff'}} />
            <TopNavigationOpe
                title={'创建新笔记'}
                navigation={navigation}
                renderItemAccessory={() => <></>}
            />
            <Divider />

            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
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
        backgroundColor: '#F0F0F0',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        paddingBottom: 0,
        backgroundColor: '#FFFFFF',
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
