import React from 'react';
import {
    SafeAreaView, StatusBar,
    StyleSheet, View,
} from 'react-native';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { Divider } from '@ui-kitten/components';
import { RecycleBinProps } from '@/center/recycleBin/types';
import {TabProvider} from '@/center/recycleBin/contexts/TabContext.tsx';

const RecycleBin: React.FC<RecycleBinProps> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF'}} />
            <TopNavigationOpe
                title={'回收站'}
            />
            <Divider />
            <TabProvider />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default RecycleBin;
