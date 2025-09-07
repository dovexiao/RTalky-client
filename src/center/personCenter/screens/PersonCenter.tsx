import React from 'react';
import {
    ScrollView,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SettingsSection, ProfileSection, OtherSection } from '@/center/personCenter/components';

// 个人中心具体内容：仅包含UI和内容相关逻辑
const PersonCenter = () => {

    return (
        <LinearGradient
            style={styles.gradientContainer}
            colors={['#F0F0F0', '#F2F2F2']}
        >
            <ScrollView style={styles.innerContent}>
                {/* 个人信息区域 */}
                <ProfileSection />
                {/*功能项区域*/}
                {/*<ActionsSection />*/}
                {/* 操作项区域 */}
                <SettingsSection />
                {/*其他*/}
                <OtherSection />
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    innerContent: {
        flex: 1,
    },
});

export default PersonCenter;
