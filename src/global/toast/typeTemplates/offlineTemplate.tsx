import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useUnifiedTheme } from '@/contexts';
import { ProgressBar, Text } from '@ui-kitten/components';

type OfflineTemplateProps = {
    text: string;
    duration: number; // 持续时间（毫秒）
};

const OfflineTemplate: React.FC<OfflineTemplateProps> = ({ text, duration }) => {
    const { themeColors } = useUnifiedTheme();
    const progress = useRef(0);
    const [displayProgress, setDisplayProgress] = React.useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress.current = Math.min(elapsed / duration, 1);
            setDisplayProgress(progress.current);

            if (progress.current >= 1) {
                clearInterval(interval);
            }
        }, 16); // 约60fps更新

        return () => clearInterval(interval);
    }, [duration]);

    return (
        <View style={[
            styles.container,
            { backgroundColor: themeColors['color-warning-500'] || 'transparent' },
        ]}>
            <Text style={styles.text}>
                {text}
            </Text>
            <ProgressBar
                progress={displayProgress}
                style={styles.progressBar}
                size={'small'}
                status={'basic'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        lineHeight: 20,
        color: 'white',
    },
    progressBar: {
        width: '100%',
        height: 5,
    },
});

export default OfflineTemplate;
