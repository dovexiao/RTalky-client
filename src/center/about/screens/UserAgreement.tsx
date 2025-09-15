import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Divider } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';
import { MarkdownRenderer } from '@/note/noteReader/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { userAgreementContent } from '@/center/about/assets';
// import { getMarkdownContent } from '@/utils';

const UserAgreement: React.FC<{}> = () => {
    const { themeColors } = useUnifiedTheme();
    // const termsOfServiceContent = getMarkdownContent('TERMS-OF-SERVICE.md');

    return (
        <View style={[styles.container, { backgroundColor: themeColors['bg-100'] }]}>
            <View style={[
                styles.statusBar,
                { backgroundColor: themeColors['bg-100'] },
            ]} />
            <TopNavigationOpe
                title={'用户协议'}
            />
            <Divider />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <MarkdownRenderer content={userAgreementContent} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: StatusBar.currentHeight,
    },
    topNavigation: {
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
});

export default UserAgreement;
