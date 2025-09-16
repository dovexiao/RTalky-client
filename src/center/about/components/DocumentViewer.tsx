import React, { FC, useEffect, useState } from 'react';
import { InteractionManager, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { DocumentViewerProps } from '@/center/about/types';
import { Divider, Spinner } from '@ui-kitten/components';
import { MarkdownRenderer } from '@/note/noteReader/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { useUnifiedTheme } from '@/contexts';

export const DocumentViewer: FC<DocumentViewerProps> = ({ title, content }) => {
    const [isReady, setIsReady] = useState(false);
    const { themeColors } = useUnifiedTheme();

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });

        return () => task.cancel();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themeColors['bg-100'] }]}>
            <View style={[
                styles.statusBar,
                { backgroundColor: themeColors['bg-100'] },
            ]} />
            <TopNavigationOpe title={title} />
            <Divider />
            {isReady ? (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <MarkdownRenderer content={content} />
                </ScrollView>
            ) : (
                <View style={styles.spinnerContainer}>
                    <Spinner />
                </View>
            )}
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
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

