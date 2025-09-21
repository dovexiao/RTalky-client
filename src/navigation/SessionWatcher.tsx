import { useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useAuthStore } from '@/auth/stores/auth.store.ts';
import { navigationRef } from '@navigation/navigationRef.ts';
import { useNavigationStore } from '@navigation/stores';

export default function SessionWatcher() {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        console.log('SessionWatcher', isLoggedIn, hasRedirectedRef.current);
        if (navigationRef.isReady() && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true; // 幂等，防止并发 401 重复跳转
            navigationRef.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: useNavigationStore.getState().initialRouteName }], // 你的登录入口
                })
            );
            hasRedirectedRef.current = false;
        }
    }, [isLoggedIn]);

    return null;
}
