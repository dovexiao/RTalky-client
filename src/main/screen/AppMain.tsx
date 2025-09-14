import React, {useMemo, useRef} from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    // BackHandler,
} from 'react-native';
import { Divider } from '@ui-kitten/components';
import { useGlobal } from '@/contexts';
import { AppMainProps } from '@/main/types';
import { useBackHandler } from '@/hooks';
import PersonCenter from '@/center/personCenter/screens/PersonCenter.tsx';
import { useUnifiedTheme } from '@/contexts';
import {
    ConfirmExit,
    LearnMain,
    PanSwipeResponder,
    TopAvatarColumn,
    SwipeSidebar,
    type SwipeSidebarAPI,
} from '@/main/components';
import RNExitApp from 'react-native-exit-app';

const AppMain: React.FC<AppMainProps> = ({}) => {
    const {
        // swipeSidebarRef,
        actionDialogRef,
        avatarActionsModalRef,
    } = useGlobal();

    const swipeSidebarRef = useRef<SwipeSidebarAPI>(null);

    const { theme, themeColors } = useUnifiedTheme();

    useBackHandler(() => {
        if (swipeSidebarRef.current?.getVisible()) {
            avatarActionsModalRef.current?.hide();

            let timer: NodeJS.Timeout | null = null;
            timer = avatarActionsModalRef.current?.getVisible() ? setTimeout(() => {
                swipeSidebarRef.current?.hide();
                timer && clearTimeout(timer);
            }, 400) : null;

            if (!timer) {
                swipeSidebarRef.current?.hide();
            }

            return true; // 阻止默认行为
        } else {
            actionDialogRef.current?.show({
                content: <ConfirmExit />,
                onConfirm: () => {
                    RNExitApp.exitApp();
                },
            });

            return true; // 阻止默认行为
        }
    });

    const handleRightSwipe = () => {
        swipeSidebarRef.current?.show();
    };

    const handleAvatarPress = () => {
        swipeSidebarRef.current?.show();
    };

    const barStyle = useMemo(() => {
        return theme === 'light' ? 'dark-content' : 'light-content';
    }, [theme]);

    return (
        <SafeAreaView style={[
            styles.safeArea,
            { backgroundColor: themeColors['bg-100'] },
        ]}>
            <StatusBar barStyle={barStyle} backgroundColor={'rgba(255,255,255,0)'} translucent={true} />
            <View style={{
                height: StatusBar.currentHeight,
                backgroundColor: themeColors['bg-100'],
            }} />
            <View style={{
                flex: 1,
                position: 'relative',
                backgroundColor: themeColors['bg-100'],
            }}>
                <TopAvatarColumn onAvatarPress={handleAvatarPress} />
                <Divider/>
                <PanSwipeResponder
                    onSwipeRight={handleRightSwipe}
                    threshold={60} // 自定义滑动阈值
                    minVelocity={0.7} // 自定义最小速度
                >
                    <LearnMain />
                </PanSwipeResponder>
            </View>
            <SwipeSidebar ref={swipeSidebarRef}>
                <PersonCenter />
            </SwipeSidebar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});

export default AppMain;
