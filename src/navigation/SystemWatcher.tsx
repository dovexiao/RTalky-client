import { useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useAuthStore } from '@/auth/stores/auth.store.ts';
import { navigationRef } from '@navigation/navigationRef.ts';
import { useNavigationStore } from '@navigation/stores';
import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

export default function SystemWatcher() {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const hasRedirectedRef = useRef(false);

    // 计时器引用
    const offlineTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevIsOnlineRef = useRef<boolean | null>(null);

    // 配置常量
    const OFFLINE_TIMEOUT = 30000; // 30秒无网络后重置路由

    const { setMessageType, setMessageText } = useNavigationStore.getState();

    // 重置路由的通用方法
    const resetNavigation = () => {
        console.log('SessionWatcher: 重置路由');
        if (navigationRef.isReady() && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true; // 幂等，防止并发重复跳转
            navigationRef.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: useNavigationStore.getState().initialRouteName }],
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
                    setMessageType('online');
                    setMessageText('网络已恢复');
                }
                console.log('SessionWatcher: 网络已恢复');
            } else {
                // 网络断开，开始计时
                prevIsOnlineRef.current = isOnline;
                setMessageType('offline');
                setMessageText('网络已断开，请检查网络连接。');
                startOfflineTimer();
                console.log('SessionWatcher: 网络断开，开始计时');
            }
        });

        // 组件卸载时清理
        return () => {
            console.log('SessionWatcher: 清理网络监听和计时器');
            unsubscribe();
            clearOfflineTimer();
        };
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
