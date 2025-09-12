import React, {useEffect} from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    BackHandler,
} from 'react-native';
import TopAvatarColumn from '@/main/components/TopAvatarColumn.tsx';
import LearnMain from '@/main/components/LearnMain.tsx';
import { Divider } from '@ui-kitten/components';
import PanSwipeResponder from '@/main/components/PanSwipeResponder.tsx';
import { useGlobal } from '@/contexts/GlobalContext.tsx';
import { AppMainProps } from '@/main/types';
import ConfirmExit from '@/main/components/ConfirmExit.tsx';
import { useMainStore } from '@/main/stores/main.store.ts';
import { useBackHandler } from '@/hooks/useBackHandler';

const AppMain: React.FC<AppMainProps> = ({ navigation }) => {
    const {
        swipeSidebarRef,
        actionDialogRef,
        avatarActionsModalRef,
    } = useGlobal();

    // const setNavigateRecycleBin = useMainStore(state => state.setNavigateRecycleBin);

    // useEffect(() => {
    //     let timer: NodeJS.Timeout | null = null;
    //     setNavigateRecycleBin(() => {
    //         swipeSidebarRef.current?.hide();
    //         timer = setTimeout(() => {
    //             navigation.navigate('RecycleBin');
    //             if (timer) {
    //                 clearTimeout(timer);
    //             }
    //         }, 400);
    //         // navigation.navigate('RecycleBin');
    //     });
    //
    //     return () => {
    //         setNavigateRecycleBin(() => {});
    //         if (timer) {
    //             clearTimeout(timer);
    //         }
    //     };
    // }, [navigation, setNavigateRecycleBin, swipeSidebarRef]);

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
            actionDialogRef.current?.show({ content: <ConfirmExit /> });
            return true; // 阻止默认行为
        }
    });

    const handleRightSwipe = () => {
        swipeSidebarRef.current?.show();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={'rgba(255,255,255,0)'} translucent={true} />
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#ffffff'}} />
            <View style={{ flex: 1, position: 'relative' }}>
                <TopAvatarColumn />
                <Divider/>
                <PanSwipeResponder
                    onSwipeRight={handleRightSwipe}
                    threshold={60} // 自定义滑动阈值
                    minVelocity={0.7} // 自定义最小速度
                >
                    <LearnMain />
                </PanSwipeResponder>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});

export default AppMain;
