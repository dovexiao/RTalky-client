import React, { useEffect } from 'react';
import {
    SafeAreaView,
    // ScrollView,
    StatusBar,
    StyleSheet,
    // Text,
    View,
    BackHandler,
} from 'react-native';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { Divider, TopNavigationAction } from '@ui-kitten/components';
import * as CommonIcon from '@/icon';
import {
    // FilterDisplayController,
    NoteList,
} from '../components';
import { NoteLibraryProps } from '../types';
import { useUnifiedTheme } from '@/contexts';
import { BottomActionSheet } from '@/components';
import { useNoteStore } from '@/note/noteLibrary/stores';
import NoteSettingsAction from '@/note/noteLibrary/components/NoteSettingsAction.tsx';
import ActionDialog from "../../../components/dialog/ActionDialog.tsx";

const NoteLibrary: React.FC<NoteLibraryProps> = ({ navigation }) => {

    const { themeColors } = useUnifiedTheme();

    const renderItemAccessory = () => {
        return (
            <TopNavigationAction
                icon={CommonIcon.FileAddIcon}
                onPress={() => {
                    navigation.navigate('AddNoteCover');
                }}
            />
        );
    };

    return (
        <SafeAreaView style={[
            styles.safeArea,
            {
                backgroundColor: themeColors['bg-100'],
            },
        ]}>
            {/*<StatusBar barStyle="dark-content" backgroundColor={'#ffffff'} translucent={false} />*/}
            <View style={[
                styles.statusBar,
                {
                    backgroundColor: themeColors['bg-100'],
                },
            ]} />
            <TopNavigationOpe
                title={'笔记库'}
                renderItemAccessory={renderItemAccessory}
            />
            <Divider />

            {/* 使用封装的筛选控制器组件 */}
            {/*<FilterDisplayController*/}
            {/*    FilterContent={FilterContent}*/}
            {/*    MainContent={NoteList}*/}
            {/*    containerStyle={styles.container}*/}
            {/*/>*/}

            <View style={[
                styles.container,
                { backgroundColor: themeColors['bg-100'] },
            ]}>
                <NoteList />
            </View>
            <NoteSettingsBottomSheet />
            <NoteOperatorsDialog />
        </SafeAreaView>
    );
};

const NoteSettingsBottomSheet = () => {
    const visible = useNoteStore(state => state.noteSettingsVisible);
    const noteId = useNoteStore(state => state.noteSettingsNoteId);

    const { themeColors } = useUnifiedTheme();

    return (
        <BottomActionSheet
            visible={visible}
            onRequestClose={() => {
                useNoteStore.getState().setNoteSettingsVisible(false);
            }}
            contentContainerStyle={{
                backgroundColor: themeColors['bg-200'],
            }}
            keepMounted={true}
        >
            <NoteSettingsAction cardId={noteId}/>
        </BottomActionSheet>
    );
};

const NoteOperatorsDialog = () => {
    const { themeColors } = useUnifiedTheme();
    const visible = useNoteStore(state => state.noteActionDialogVisible);
    const content = useNoteStore(state => state.noteActionDialogContent);
    const onConfirm = useNoteStore(state => state.noteActionDialogOnConfirm);

    return (
        <ActionDialog
            visible={visible}
            onRequestClose={() => {
                useNoteStore.getState().hideNoteActionDialog();
            }}
            onConfirm={onConfirm}
            onHideEnd={() => {
                useNoteStore.getState().resetNoteActionDialog();
            }}
            dialogStyle={{
                backgroundColor: themeColors['bg-200'],
            }}
            contentContainerStyle={{
                backgroundColor: themeColors['bg-200'],
            }}
            footerContainerStyle={{
                backgroundColor: themeColors['bg-200'],
            }}
        >
            {content}
        </ActionDialog>
    )
}

// 筛选内容
// const FilterContent: React.FC = () => {
//     return (
//         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//             <Text>题目名称搜索</Text>
//             <Text>最近题目名称搜索</Text>
//             <Text>题目介绍搜索</Text>
//             <Text>最近题目介绍搜索</Text>
//             <Text>标签名称搜索</Text>
//             <Text>最近标签名称搜索</Text>
//         </ScrollView>
//     );
// };

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    statusBar: {
        height: StatusBar.currentHeight,
        // backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    // container: {
    //     flex: 1,
    //     paddingTop: 16,
    //     // paddingHorizontal: 16,
    // },
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
});

export default NoteLibrary;
