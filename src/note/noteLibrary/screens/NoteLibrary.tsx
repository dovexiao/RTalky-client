import React, { useEffect } from 'react';
import {
    SafeAreaView, ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    BackHandler,
} from 'react-native';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { Divider, TopNavigationAction } from '@ui-kitten/components';
import * as CommonIcon from '@/icon';
import { FilterDisplayController, NoteList } from '../components';
import { NoteLibraryProps } from '../types';
import { useGlobal } from '@contexts/GlobalContext.tsx';

const NoteLibrary: React.FC<NoteLibraryProps> = ({ navigation }) => {
    const { bottomActionSheetRef, actionDialogRef } = useGlobal();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (actionDialogRef.current?.getVisible() || bottomActionSheetRef.current?.getVisible()) {
                bottomActionSheetRef.current?.hide();
                actionDialogRef.current?.hide();
                const timer = setTimeout(() => {
                    navigation.goBack();
                    clearTimeout(timer);
                }, 400);
                return true;
            }
        });

        return () => backHandler.remove();
    }, [actionDialogRef, bottomActionSheetRef, navigation]);

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
        <SafeAreaView style={styles.safeArea}>
            {/*<StatusBar barStyle="dark-content" backgroundColor={'#ffffff'} translucent={false} />*/}
            <View style={styles.statusBar} />
            <TopNavigationOpe
                title={'笔记库'}
                renderItemAccessory={renderItemAccessory}
            />
            <Divider />

            {/* 使用封装的筛选控制器组件 */}
            <FilterDisplayController
                FilterContent={FilterContent}
                MainContent={NoteList}
                containerStyle={styles.container}
            />
        </SafeAreaView>
    );
};


// 筛选内容
const FilterContent: React.FC = () => {
    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text>题目名称搜索</Text>
            <Text>最近题目名称搜索</Text>
            <Text>题目介绍搜索</Text>
            <Text>最近题目介绍搜索</Text>
            <Text>标签名称搜索</Text>
            <Text>最近标签名称搜索</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    statusBar: {
        height: StatusBar.currentHeight,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 16,
        // paddingHorizontal: 16,
    },
});

export default NoteLibrary;
