import { useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useAuthStore } from '@/auth/login/stores/auth.store';
import { navigationRef } from '@navigation/navigationRef.ts';

export default function SessionWatcher() {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        if (!isLoggedIn && navigationRef.isReady() && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true; // 幂等，防止并发 401 重复跳转
            navigationRef.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'VerificationLogin' }], // 你的登录入口
                })
            );
        }
        if (isLoggedIn) {
            hasRedirectedRef.current = false;
        }
    }, [isLoggedIn]);

    return null;
}
