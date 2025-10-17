import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef, useMemo } from 'react';
import { createSessionEvents, useSessionStore } from './sessionMachine';
import { ExceptionUtils, ImageCache } from '@/utils';
import { useGlobal, useUnifiedTheme } from '@/contexts';
import { UserInfoService } from '@/auth/services';
import BootSplash from 'react-native-bootsplash';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { ROUTE_NAMES, navigationRef, RootStackParamList } from '@/navigation';
import { EffectHandle, UserProfile, EffectState, SessionContext, SessionState } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 初始化消费组件：获取用户信息 -> 并行应用主题与重置导航 -> 等待二者生效 -> 发布 INIT_SUCCESS
const InitEffect = forwardRef<EffectHandle>((props, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [desiredProfile, setDesiredProfile] = useState<UserProfile | null>(null);

    const { setTheme, setAutoSwitch } = useUnifiedTheme();

    useImperativeHandle(ref, () => ({
        activate: (_state: SessionState, _context: SessionContext) => {
            if (isActive) {
                return;
            }

            setIsActive(true);
        },
    }));

    useEffect(() => {
        if (!isActive) {
            return;
        }

        UserInfoService.getUserInfo().then((response) => {
            if (response.success) {
                const profile: UserProfile = {
                    userId: response.data?.userId ?? '',
                    nickname: response.data?.nickname ?? '',
                    bio: response.data?.bio ?? '',
                    theme: (response.data?.theme ?? 'LIGHT') as UserProfile['theme'],
                    avatar: '',
                };
                ImageCache.saveImageToFile(response.data?.avatar ?? '', 'AVATARS').then((imagePath) => {
                    profile.avatar = imagePath;
                }).catch((error: unknown) => {
                    ExceptionUtils.logError(error, 'SessionInitEffect');
                });
                setDesiredProfile(profile);
            } else {
                ExceptionUtils.logError(response.message, 'SessionInitEffect');
                setDesiredProfile({ userId: '', nickname: '', avatar: '', bio: '', theme: 'LIGHT' });
            }
        }).catch((error: unknown) => {
            ExceptionUtils.logError(error, 'SessionInitEffect');
            setDesiredProfile({ userId: '', nickname: '', avatar: '', bio: '', theme: 'LIGHT' });
        });
    }, [isActive]);

    useEffect(() => {
        if (!isActive || !desiredProfile) {
            return;
        }
        switch (desiredProfile.theme) {
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
        navigationRef.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: ROUTE_NAMES.APP_MAIN }] })
        );
        const events = createSessionEvents();
        useSessionStore.getState().dispatch(events.initSuccess(desiredProfile));
        setIsActive(false);
    }, [isActive, desiredProfile, setTheme, setAutoSwitch]);

    return null;
});

// 登录过渡消费组件
const LoginTransitionEffect = forwardRef<EffectHandle>((props, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [effectContext, setEffectContext] = useState<SessionContext | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { theme, autoSwitch, setTheme, setAutoSwitch } = useUnifiedTheme();

    useImperativeHandle(ref, () => ({
        activate: (_state: SessionState, context: SessionContext) => {
            if (isActive) {
                return;
            }

            setIsActive(true);
            setEffectContext(context);
        },
    }));

    useEffect(() => {
        if (!isActive) {
            return;
        }

        console.log('SessionEffectManager 登录过渡');
        navigation.navigate('TransitionPlaceholder');

        const timer = setTimeout(() => {
            switch (effectContext?.userProfile?.theme) {
                case 'DARK': setTheme('dark'); break;
                case 'LIGHT': setTheme('light'); break;
                case 'SYSTEM': setAutoSwitch(true); break;
                default:
            }
            clearTimeout(timer);
        }, 500);
    }, [isActive, effectContext]);

    const isThemeReady = useMemo(() => {
        switch (effectContext?.userProfile?.theme) {
            case 'DARK': return theme === 'dark';
            case 'LIGHT': return theme === 'light';
            case 'SYSTEM': return autoSwitch;
            default: return false;
        }
    }, [effectContext, theme, autoSwitch]);

    useEffect(() => {
        if (!isActive || !isThemeReady) {
            return;
        }

        try {
            navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ROUTE_NAMES.APP_MAIN }] }));
            const events = createSessionEvents();
            useSessionStore.getState().dispatch(events.transitionEnd('LOGIN_FLOW'));
        } catch (error: unknown) {
            ExceptionUtils.logError(error, 'SessionEffectManager 登录过渡');
        } finally {
            setIsActive(false);
        }
    }, [isActive, isThemeReady]);

    return null;
});

// 退登过渡消费组件
const LogoutTransitionEffect = forwardRef<EffectHandle>((props, ref) => {
    const [isActive, setIsActive] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { theme, autoSwitch, resetThemeToDefault, isDefaultTheme } = useUnifiedTheme();

    useImperativeHandle(ref, () => ({
        activate: (_state: SessionState, _context: SessionContext) => {
            if (isActive) {
                return;
            }

            setIsActive(true);
        },
    }));

    const isThemeReady = useMemo(() => {
        return isDefaultTheme();
    }, [theme, autoSwitch]);

    useEffect(() => {
        if (!isActive) {
            return;
        }

        console.log('SessionEffectManager 登录过渡');
        navigation.navigate('TransitionPlaceholder');

        const timer = setTimeout(() => {
            resetThemeToDefault();
            clearTimeout(timer);
        }, 500);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) {
            return;
        }

        if (isThemeReady) {
            try {
                navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ROUTE_NAMES.LOGIN_LOGIN }] }));
                const events = createSessionEvents();
                useSessionStore.getState().dispatch(events.transitionEnd('LOGOUT_FLOW'));
            } catch (error: unknown) {
                ExceptionUtils.logError(error, 'SessionEffectManager 退登过渡');
            } finally {
                setIsActive(false);
            }
        }
    }, [isActive, isThemeReady]);

    return null;
});

// 启动屏隐藏消费组件
const BootSplashEffect = forwardRef<EffectHandle>((props, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [effectState, setEffectState] = useState<EffectState>(null);
    const [effectContext, setEffectContext] = useState<SessionContext | null>(null);
    const [isRouteReady, setIsRouteReady] = useState(false);

    const { toastShow, toastActive } = useGlobal();
    const { theme, autoSwitch } = useUnifiedTheme();

    useImperativeHandle(ref, () => ({
        activate: (state: SessionState, context: SessionContext) => {
            if (isActive) {
                return;
            }
            console.log('[BootSplashEffect] activate', state, context);

            setIsActive(true);
            setEffectState(state);
            setEffectContext(context);
        },
    }));

    const isThemeReady = useMemo(() => {
        switch (effectContext?.userProfile?.theme) {
            case 'DARK': return theme === 'dark';
            case 'LIGHT': return theme === 'light';
            case 'SYSTEM': return autoSwitch;
            default: return false;
        }
    }, [effectContext, theme, autoSwitch]);

    useEffect(() => {
        console.log('[BootSplashEffect] isRouteReady', isRouteReady);
        // const unsubscribe = navigationRef.current?.addListener('state', (e) => {
        //     // 处理导航状态变化
        //     console.log('[Navigation State Updated]', e.data);
        //     switch (effectState) {
        //         case 'AUTHENTICATED':
        //             setIsRouteReady(e.data.state?.routes?.[0].name === ROUTE_NAMES.APP_MAIN);
        //             break;
        //         case 'UNAUTHENTICATED':
        //             setIsRouteReady(e.data.state?.routes?.[0].name === ROUTE_NAMES.LOGIN_LOGIN);
        //             break;
        //         default:
        //     }
        // });
        // console.log('[BootSplashEffect] addListener', unsubscribe);
        // return unsubscribe?.();

        if (!isActive) {
            return;
        }

        const timer = setInterval(() => {
            console.log('[BootSplashEffect] routes[0].name', navigationRef.current?.getState()?.routes?.[0].name);
            console.log('[BootSplashEffect] effectState', effectState);
            console.log('[BootSplashEffect] isRouteReady', navigationRef.current?.getState()?.routes?.[0].name === ROUTE_NAMES.APP_MAIN);
            switch (effectState) {
                case 'AUTHENTICATED':
                    setIsRouteReady(navigationRef.current?.getState()?.routes?.[0].name === ROUTE_NAMES.APP_MAIN);
                    clearInterval(timer);
                    break;
                case 'UNAUTHENTICATED':
                    setIsRouteReady(navigationRef.current?.getState()?.routes?.[0].name === ROUTE_NAMES.LOGIN_LOGIN);
                    clearInterval(timer);
                    break;
                default:
            }
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, [effectState, isActive]);

    useEffect(() => {
        if (!isActive || isHiding) {
            return;
        }

        setIsHiding(true);

        console.log('[BootSplashEffect]', isThemeReady, isRouteReady);

        if (isThemeReady && isRouteReady || effectState === 'UNAUTHENTICATED') {
            BootSplash.hide({ fade: true }).then(() => {
                toastActive();
                if (effectState === 'UNAUTHENTICATED' && effectContext?.lastError instanceof Error) {
                    toastShow(effectContext.lastError.message, { type: 'danger', position: 'bottom' });
                }
            }).catch((error) => {
                ExceptionUtils.logError(error, 'SessionEffectManager 隐藏启动屏');
            }).finally(() => {
                setIsActive(false);
                setIsRouteReady(false);
                setEffectState(null);
                setEffectContext(null);
            });
        }

        setIsHiding(false);
    }, [isActive, effectContext, effectState, isHiding, isRouteReady, isThemeReady]);

    return null;
});

export const SessionEffectManager = () => {
    const initRef = useRef<EffectHandle | null>(null);
    const loginRef = useRef<EffectHandle | null>(null);
    const logoutRef = useRef<EffectHandle | null>(null);
    const bootSplashRef = useRef<EffectHandle | null>(null);

    // 统一监听状态变化，仅负责激活对应消费组件
    useEffect(() => {
        const unsubscribe = useSessionStore.subscribe(
            (state) => state.state,
            (currentState, previousState) => {
                console.log(`[SessionEffectManager] 状态变化: ${previousState} → ${currentState}`);
                const { context } = useSessionStore.getState();

                if (currentState === 'INITIALIZING' && previousState === 'UNINITIALIZED') {
                    initRef.current?.activate(currentState, context);
                }

                if (currentState === 'TRANSITIONING') {
                    if (previousState === 'AUTHENTICATED') {
                        console.log('[SessionEffectManager] 登出触发');
                        logoutRef.current?.activate(currentState, context);
                    } else if (previousState === 'UNAUTHENTICATED') {
                        console.log('[SessionEffectManager] 登录触发');
                        loginRef.current?.activate(currentState, context);
                    }
                }

                // BootSplash 隐藏触发：UNINITIALIZED->UNAUTHENTICATED 或 INITIALIZING->AUTHENTICATED
                if (currentState === 'UNAUTHENTICATED' && previousState === 'UNINITIALIZED') {
                    console.log('[SessionEffectManager] 启动屏隐藏触发');
                    bootSplashRef.current?.activate(currentState, context);
                }
                if (currentState === 'AUTHENTICATED' && previousState === 'INITIALIZING') {
                    console.log('[SessionEffectManager] 启动屏隐藏触发');
                    bootSplashRef.current?.activate(currentState, context);
                }
            }
        );
        return unsubscribe;
    }, []);

    return (
        <>
            <InitEffect ref={initRef} />
            <LoginTransitionEffect ref={loginRef} />
            <LogoutTransitionEffect ref={logoutRef} />
            <BootSplashEffect ref={bootSplashRef} />
        </>
    );
};
