/**
 * Sample React Native App
 * https://github.com/dovexiao/RTalky.git
 *
 * @format
 */

import React, {JSX, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { UnifiedThemeProvider, useUnifiedTheme } from '@contexts/UnifiedThemeContext';
import { AppNavigator } from '@navigation/AppNavigation.tsx';
import { GlobalProvider } from '@contexts/GlobalContext.tsx';
import BootSplash from 'react-native-bootsplash';
import { useNavigationStore } from '@/navigation/stores/navigationStore';
import { SessionService, UserInfoService } from '@/auth/services';
import { useAuthStore, UserProfile } from '@/auth/stores';
import { ImageCache } from '@/utils';

function App(): JSX.Element {
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

    useEffect(() => {
        const init = async () => {
            const { setInitialRouteName } = useNavigationStore.getState();

            try {
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
                    }
                } else {
                    console.log('会话无效，设置初始路由为VerificationLogin');
                }
            } catch (error) {
                console.error('初始化失败:', error);
                // 初始化失败时，默认设置为登录页面
            }
        };

        init().finally(async () => {
            console.log('BootSplash is ready to hide');
            await BootSplash.hide({ fade: true });
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
}

export default App;
