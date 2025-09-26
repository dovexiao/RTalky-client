/**
 * Sample React Native App
 * https://github.com/dovexiao/RTalky.git
 *
 * @format
 */

import React, {JSX, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Spinner } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { UnifiedThemeProvider, useUnifiedTheme } from '@contexts/UnifiedThemeContext';
import { AppNavigator } from '@navigation/AppNavigation.tsx';
import { GlobalProvider } from '@contexts/GlobalContext.tsx';
import BootSplash from 'react-native-bootsplash';
import { useNavigationStore } from '@/navigation/stores/navigationStore';
import { SessionService, UserInfoService } from '@/auth/services';
import { useAuthStore, UserProfile } from '@/auth/stores';
import { ImageCache } from '@/utils';
import UserAuthManager from '@utils/UserAuthManager.ts';
import Orientation from 'react-native-orientation-locker';
import { useReactiveToastStore } from "@global/reactiveToast/stores";

function App(): JSX.Element {
    useEffect(() => {
        // 锁定为竖屏方向
        Orientation.lockToPortrait();

        // 组件卸载时解除锁定（可选）
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <UnifiedThemeProvider>
                <AppContent />
            </UnifiedThemeProvider>
        </>
    );
}

// 分离的 App 内容组件
const AppContent: React.FC = () => {
    const { themeColors } = useUnifiedTheme();

    const { setMessageType, setMessageText, setIsActive } = useReactiveToastStore.getState();

    useEffect(() => {
        const init = async () => {
            const { setInitialRouteName } = useNavigationStore.getState();
            const hashSession = await UserAuthManager.hasValidSessionStrict();

            if (!hashSession) {
                return;
            }

            try {
                setIsActive(false);

                // 并行执行会话验证和用户信息获取
                const [sessionResponse, userInfoResponse] = await Promise.allSettled([
                    SessionService.validateSession(),
                    UserInfoService.getUserInfo(),
                ]);

                // 检查会话验证结果
                const isSessionValid = sessionResponse.status === 'fulfilled' && sessionResponse.value.success;

                if (isSessionValid) {
                    console.log('会话有效，设置初始路由为AppMain');
                    setInitialRouteName('AppMain');

                    // 设置登录状态
                    const { setIsLoggedIn } = useAuthStore.getState();
                    setIsLoggedIn(true);

                    // 处理用户信息（如果获取成功）
                    if (userInfoResponse.status === 'fulfilled' && userInfoResponse.value.success) {
                        const { setUserId, setUserProfile, setAvatar } = useAuthStore.getState();
                        setUserId(userInfoResponse.value.data?.userId ?? '');
                        setUserProfile(userInfoResponse.value.data as UserProfile);
                        const imagePath = await ImageCache.saveImageToFile(userInfoResponse.value.data?.avatar ?? '', 'AVATARS');
                        setAvatar(imagePath);
                        console.log('获取用户信息成功:', JSON.stringify({...userInfoResponse.value.data, avatar: imagePath}));
                    } else {
                        console.log('获取用户信息失败:',
                            userInfoResponse.status === 'fulfilled'
                                ? userInfoResponse.value.message
                                : '网络错误'
                        );
                        throw new Error(`获取用户信息失败: ${
                            userInfoResponse.status === 'fulfilled'
                                ? userInfoResponse.value.message
                                : '网络错误'
                        }`);
                    }
                } else {
                    console.log('会话无效，设置初始路由为VerificationLogin');
                    throw new Error('会话无效，请重新登录');
                }
            } catch (error: any) {
                console.log('初始化失败:', error);
                // 初始化失败时，默认设置为登录页面
                setMessageType('danger');
                setMessageText(error?.message ?? error);
            }
        };

        init().finally(async () => {
            console.log('BootSplash is ready to hide');
            await BootSplash.hide({fade: true});
            setIsActive(true);
            console.log('BootSplash has been hidden successfully');
        });
    }, []);

    return (
        <ApplicationProvider {...eva} theme={themeColors}>
            <GlobalProvider>
                <AppNavigator />
            </GlobalProvider>
        </ApplicationProvider>
    );
};

export default App;
