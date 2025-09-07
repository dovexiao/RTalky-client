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
import { ThemeContext } from '@contexts/ThemeContext';
import { default as lightTheme } from './light-theme.json';
import { default as darkTheme } from './dark-theme.json';
import { AppNavigator } from '@navigation/AppNavigation.tsx';
import { GlobalProvider } from '@contexts/GlobalContext.tsx';
import BootSplash from 'react-native-bootsplash';
import { useNavigationStore } from '@/navigation/stores/navigationStore';
import { SessionService, UserInfoService } from '@/auth/services';
import { useAuthStore, UserProfile } from '@/auth/stores';
import { ImageCache } from '@/utils';

type Theme = 'light' | 'dark';

function App(): JSX.Element {
    const [theme, setTheme] = React.useState<Theme>('light');
    const [customTheme, setCustomTheme] = React.useState(lightTheme);

    const setInitialRouteName = useNavigationStore(state => state.setInitialRouteName);
    const resetInitialRouteName = useNavigationStore(state => state.resetInitialRouteName);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const nextCustomTheme = theme === 'light' ? darkTheme : lightTheme;
        setTheme(nextTheme);
        // @ts-ignore
        setCustomTheme(nextCustomTheme);
    };

    useEffect(() => {
        const init = async () => {
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
                    setInitialRouteName('VerificationLogin');
                }
            } catch (error) {
                console.error('初始化失败:', error);
                // 初始化失败时，默认设置为登录页面
                resetInitialRouteName();
            }
        };

        init().finally(async () => {
            await BootSplash.hide({ fade: true });
            console.log('BootSplash has been hidden successfully');
        });
    }, []);

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ApplicationProvider {...eva} theme={{...eva[theme], ...customTheme}}>
                    <GlobalProvider>
                        <AppNavigator />
                    </GlobalProvider>
                </ApplicationProvider>
            </ThemeContext.Provider>
        </>

    );
}

export default App;
