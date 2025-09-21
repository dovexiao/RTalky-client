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
import { ReactiveToast } from '@/auth/verificationLogin/components';
import { Text, View } from 'react-native';
import UserAuthManager from '@utils/UserAuthManager.ts';
import Orientation from 'react-native-orientation-locker';

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
    const { themeColors, setTheme, setAutoSwitch } = useUnifiedTheme();

    const [isLoading, setIsLoading] = React.useState(false);
    const messageType = useNavigationStore(state => state.messageType);
    const messageText = useNavigationStore(state => state.messageText);
    const { setMessageType, setMessageText } = useNavigationStore.getState();

    useEffect(() => {
        const init = async () => {
            const { setInitialRouteName } = useNavigationStore.getState();
            const hashSession = await UserAuthManager.hasValidSessionStrict();

            if (!hashSession) {
                return;
            }

            try {
                setIsLoading(true);

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
                        const userTheme = userInfoResponse.value.data?.theme;
                        if (userTheme) {
                            switch (userTheme) {
                                case 'DARK':
                                    setTheme('dark');
                                    break;
                                case 'LIGHT':
                                    setTheme('light');
                                    break;
                                case 'SYSTEM':
                                    setAutoSwitch(true);
                                    break;
                                default:
                            }
                        }
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
            setIsLoading(false);
            console.log('BootSplash has been hidden successfully');
        });
    }, []);

    return (
        <ApplicationProvider {...eva} theme={themeColors}>
            <GlobalProvider>
                <AppNavigator />
                <ReactiveToast
                    dependencies={{ messageType, messageText }}
                    shouldShow={({ messageType: type, messageText: text  }) => type !== 'none' && text !== '' && !isLoading }
                    autoClose={({ messageType: type }) => type === 'loading' ? false : 3000}
                    position={({ messageType: type }) => type === 'loading' ? 'center' : 'bottom'}
                    render={({ messageType: type, messageText: text }) => {
                        return (
                            <>
                                {type === 'loading' ? (
                                    <View style={{
                                        backgroundColor: themeColors['color-primary-500'],
                                        width: 120,
                                        // borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        aspectRatio: 1,
                                        gap: 10,
                                    }}>
                                        <Spinner size={'large'} status={'control'} />
                                        <Text style={{ color: themeColors['bg-100'] }}>{text}</Text>
                                    </View>
                                ) : (
                                    <View style={{
                                        backgroundColor: themeColors[`color-${type}-500`] || 'transparent',
                                        padding: 15,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{color: 'white'}}>{text}</Text>
                                    </View>
                                )}
                            </>
                        );
                    }}
                    onHide={() => {
                        setMessageType('none');
                        setMessageText( '');
                    }}
                />
            </GlobalProvider>
        </ApplicationProvider>
    );
};

export default App;
