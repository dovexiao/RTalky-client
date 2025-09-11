import React, { useRef } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet, View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
} from 'react-native-reanimated';
import {
    AccountSecuritySection,
    ProfileSection,
    OtherSection,
    GeneralSettingsSection,
    AboutRTalkySection,
} from '@/center/personCenter/components';
import { TopNavigation } from '@ui-kitten/components';

// 个人中心具体内容：仅包含UI和内容相关逻辑
const PersonCenter = () => {
    const scrollY = useSharedValue(0);
    const profileSectionRef = useRef<View>(null);
    // 根据ProfileSection的实际高度调整，考虑到marginVertical: 90, marginBottom: 30
    const profileSectionHeight: number = 280;

    // 滚动事件处理
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            console.log(event.contentOffset.y);
        },
    });

    // ProfileSection透明度动画样式
    const profileSectionAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [profileSectionHeight * 0.5, profileSectionHeight],
            [1, 0],
            'clamp'
        );

        return {
            opacity,
        };
    });

    // 顶部设置和StatusBar透明度动画样式
    const topBarAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [profileSectionHeight * 0.5, profileSectionHeight],
            [0, 1],
            'clamp'
        );

        const display = scrollY.value > 0 ? 'flex' : 'none';

        return {
            opacity,
            display,
        };
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 顶部设置和StatusBar - 绝对定位，初始隐藏 */}
            <Animated.View
                style={[
                    styles.topBarContainer,
                    topBarAnimatedStyle,
                ]}
            >
                <View style={styles.statusBar} />
                <TopNavigation
                    title={'设置'}
                    alignment="center"
                />
            </Animated.View>

            <LinearGradient
                style={styles.gradientContainer}
                colors={['#F0F0F0', '#F2F2F2']}
            >
                <Animated.ScrollView
                    style={styles.innerContent}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                >
                    {/* 个人信息区域 - 带透明度动画 */}
                    <Animated.View
                        ref={profileSectionRef}
                        style={profileSectionAnimatedStyle}
                    >
                        <ProfileSection />
                    </Animated.View>

                    {/* 账号安全项区域 */}
                    <AccountSecuritySection />
                    {/* 通用设置项区域 */}
                    <GeneralSettingsSection />
                    {/*关于RTalky项区域*/}
                    <AboutRTalkySection />
                    {/*其他*/}
                    <OtherSection />
                </Animated.ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // 顶部设置和StatusBar容器 - 绝对定位
    topBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    statusBar: {
        height: StatusBar.currentHeight,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    gradientContainer: {
        flex: 1,
    },
    innerContent: {
        flex: 1,
        paddingTop: 20,
    },
});

export default PersonCenter;
