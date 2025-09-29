import { useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useAuthStore } from '@/auth/stores/auth.store.ts';
import { navigationRef } from '@navigation/navigationRef.ts';
import { useNavigationStore } from '@navigation/stores';
import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import {useGlobal, useUnifiedTheme} from '@/contexts';
import BootSplash from 'react-native-bootsplash';
import UserAuthManager from '@utils/UserAuthManager.ts';
import { SessionService, UserInfoService, UserProfile } from '@/auth/services';
import { ImageCache } from '@/utils';

export default function SystemWatcher() {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const hasRedirectedRef = useRef(false);

    // 计时器引用
    const offlineTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevIsOnlineRef = useRef<boolean | null>(null);

    // 配置常量
    const OFFLINE_TIMEOUT = 30000; // 30秒无网络后重置路由

    const { resetThemeToDefault, setTheme, setAutoSwitch } = useUnifiedTheme();

    const { toastShow, toastClean } = useGlobal();

    // 重置路由的通用方法
    const resetNavigation = async () => {
        console.log('SessionWatcher: 重置路由');
        if (navigationRef.isReady() && !hasRedirectedRef.current) {

            const {isLoggedIn: isLogin} = useAuthStore.getState();

            if (!isLogin) {
                // 清空toast
                toastClean();

                // 重置应用主题
                resetThemeToDefault();

                // 删除用户信息
                await UserAuthManager.deleteCurrentUserComplete();
            } else {
                const {theme} = useAuthStore.getState();
                if (theme) {
                    switch (theme) {
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
            }

            hasRedirectedRef.current = true; // 幂等，防止并发重复跳转
            navigationRef.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: useNavigationStore.getState().initialRouteName}],
                })
            );
            hasRedirectedRef.current = false;
        }
    };

    // 清除离线计时器
    const clearOfflineTimer = () => {
        if (offlineTimerRef.current) {
            clearTimeout(offlineTimerRef.current);
            offlineTimerRef.current = null;
            console.log('SessionWatcher: 清除离线计时器');
        }
    };

    // 开始离线计时
    const startOfflineTimer = () => {
        clearOfflineTimer(); // 先清除现有计时器
        offlineTimerRef.current = setTimeout(() => {
            console.log('SessionWatcher: 离线超时，重置路由');
            resetNavigation();
        }, OFFLINE_TIMEOUT);
        console.log(`SessionWatcher: 开始离线计时 ${OFFLINE_TIMEOUT}ms`);
    };

    // 监听网络状态变化
    useEffect(() => {
        console.log('SessionWatcher: 开始监听网络状态');

        const unsubscribe: NetInfoSubscription = NetInfo.addEventListener((state: NetInfoState) => {
            console.log('SessionWatcher: 网络状态变化', {
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            });

            const isOnline = state.isConnected && state.isInternetReachable;

            if (isOnline) {
                // 网络恢复，清除计时器
                clearOfflineTimer();
                if (prevIsOnlineRef.current !== null && prevIsOnlineRef.current !== isOnline) {
                    prevIsOnlineRef.current = isOnline;
                    toastShow('网络已恢复', { type: 'success' });
                    console.log('SessionWatcher: 网络已恢复');
                }
            } else {
                // 网络断开，开始计时
                if (prevIsOnlineRef.current !== null && prevIsOnlineRef.current !== isOnline) {
                    prevIsOnlineRef.current = isOnline;
                    toastShow('网络已断开，请检查网络连接。', { type: 'warning', duration: OFFLINE_TIMEOUT });
                    startOfflineTimer();
                    console.log('SessionWatcher: 网络断开，开始计时');
                }
            }
        });

        // 组件卸载时清理
        return () => {
            console.log('SessionWatcher: 清理网络监听和计时器');
            unsubscribe();
            clearOfflineTimer();
        };
    }, []);

    useEffect(() => {
        const { setInitialRouteName, setIsActive } = useNavigationStore.getState();

        const init = async () => {

            const hashSession = await UserAuthManager.hasValidSessionStrict();

            if (!hashSession) {
                return;
            }

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
                toastShow(error?.message ?? error, { type: 'danger', duration: 3000, position: 'bottom' });
            }
        };

        init().finally(async () => {
            console.log('BootSplash is ready to hide');
            await BootSplash.hide({ fade: true });
            const timer = setTimeout(() => {
                setIsActive(true);
                clearTimeout(timer);
            }, 1000);
            console.log('BootSplash has been hidden successfully');
        });
    }, []);

    // 监听登录状态变化
    useEffect(() => {
        console.log('SessionWatcher: 登录状态变化', isLoggedIn);
        if (offlineTimerRef.current) {
            clearOfflineTimer();
        }
        resetNavigation();
    }, [isLoggedIn]);

    return null;
}
