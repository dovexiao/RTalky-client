import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { SessionState, SessionEvent, SessionContext, SessionStore, UserProfile } from './types';

// 有效的状态转移规则
const VALID_TRANSITIONS: Record<SessionState, SessionEvent['type'][]> = {
    'UNINITIALIZED': ['INIT_REQUEST', 'INIT_FAIL'],
    'INITIALIZING': ['INIT_SUCCESS'],
    'AUTHENTICATED': ['TOKEN_401_DETECTED', 'LOGOUT_SUCCESS', 'LOGOUT_FAIL'],
    'UNAUTHENTICATED': ['LOGIN_SUCCESS', 'LOGIN_FAIL'],
    'TRANSITIONING': ['TRANSITION_END'],
};

// 状态转移函数
function reduceSessionState(
    currentState: SessionState,
    event: SessionEvent,
    context: SessionContext
): { state: SessionState; context: SessionContext } {
    // 检查是否为有效的状态转移
    const validEvents = VALID_TRANSITIONS[currentState];
    if (!validEvents?.includes(event.type)) {
        console.warn(`[SessionMachine] 无效的状态转移: ${currentState} + ${event.type}`);
        return {state: currentState, context};
    }

    // 根据当前状态和事件类型执行具体的转移逻辑
    switch (event.type) {
        case 'INIT_REQUEST':
            // UNINITIALIZED --[INIT_REQUEST]--> INITIALIZING
            return {
                state: 'INITIALIZING',
                context: { ...context, lastError: null },
            };

        case 'INIT_SUCCESS':
            // INITIALIZING --[INIT_SUCCESS]--> AUTHENTICATED
            return {
                state: 'AUTHENTICATED',
                context: {
                    ...context,
                    userProfile: event.userProfile,
                    lastError: null,
                },
            };

        case 'INIT_FAIL':
            // UNINITIALIZED --[INIT_FAIL]--> UNAUTHENTICATED
            return {
                state: 'UNAUTHENTICATED',
                context: { ...context, lastError: event.error },
            };

        case 'LOGIN_SUCCESS':
            // UNAUTHENTICATED --[LOGIN_SUCCESS]--> TRANSITIONING
            return {
                state: 'TRANSITIONING',
                context: {
                    ...context,
                    userProfile: event.userProfile,
                    lastError: null,
                    transition: { name: 'LOGIN_FLOW', startedAt: Date.now() },
                },
            };

        case 'LOGIN_FAIL':
            // UNAUTHENTICATED --[LOGIN_FAIL]--> UNAUTHENTICATED
            return {
                state: 'UNAUTHENTICATED',
                context: { ...context, lastError: event.error },
            };

        case 'TOKEN_401_DETECTED':
            // AUTHENTICATED --[TOKEN_401_DETECTED]--> TRANSITIONING
            return {
                state: 'TRANSITIONING',
                context: {
                    ...context,
                    userProfile: null,
                    lastError: '会话失效，即将退出登录',
                    transition: { name: 'LOGOUT_FLOW', startedAt: Date.now() },
                },
            };

        case 'LOGOUT_SUCCESS':
            // AUTHENTICATED --[LOGOUT_SUCCESS]--> TRANSITIONING
            return {
                state: 'TRANSITIONING',
                context: {
                    ...context,
                    userProfile: null,
                    lastError: null,
                    transition: { name: 'LOGOUT_FLOW', startedAt: Date.now() },
                },
            };

        case 'LOGOUT_FAIL':
            // AUTHENTICATED --[LOGOUT_FAIL]--> AUTHENTICATED
            return {
                state: 'AUTHENTICATED',
                context: { ...context, lastError: event.error },
            };

        case 'TRANSITION_END':
            // TRANSITIONING --[TRANSITION_END]--> AUTHENTICATED/UNAUTHENTICATED
            const targetState = event.name === 'LOGOUT_FLOW' ? 'UNAUTHENTICATED' : 'AUTHENTICATED';
            return {
                state: targetState,
                context: { ...context, transition: null },
            };

        default:
            console.error('[SessionMachine] 未处理的事件类型:', event);
            return { state: currentState, context };
    }
}

// 创建会话状态机
export const useSessionStore = create<SessionStore>()(
    subscribeWithSelector((set, get) => ({
        state: 'UNINITIALIZED' as SessionState,
        previousState: 'UNINITIALIZED' as SessionState,
        context: { userProfile: null, lastError: null, transition: null } as SessionContext ,

        dispatch: (event: SessionEvent) => {
            const current = get();
            const result = reduceSessionState(current.state, event, current.context);

            set({
                state: result.state,
                previousState: current.state,
                context: result.context,
            });
        },

        // 选择器
        get isLoggedIn() {
            return get().state === 'AUTHENTICATED';
        },

        get isInitializing() {
            return get().state === 'INITIALIZING';
        },

        get isTransitioning() {
            return get().state === 'TRANSITIONING';
        },

        get currentUser() {
            return get().context.userProfile || null;
        },
    }))
);

// 事件创建器 - 方便其他模块使用
export const createSessionEvents = () => ({
    initRequest: () => ({ type: 'INIT_REQUEST' as const }),
    initSuccess: (userProfile: UserProfile) => ({ type: 'INIT_SUCCESS' as const, userProfile }),
    initFail: (error?: unknown) => ({ type: 'INIT_FAIL' as const, error }),
    loginSuccess: (userProfile: UserProfile) => ({ type: 'LOGIN_SUCCESS' as const, userProfile }),
    loginFail: (error?: unknown) => ({ type: 'LOGIN_FAIL' as const, error }),
    token401Detected: () => ({ type: 'TOKEN_401_DETECTED' as const }),
    logoutSuccess: () => ({ type: 'LOGOUT_SUCCESS' as const }),
    logoutFail: (error?: unknown) => ({ type: 'LOGOUT_FAIL' as const, error }),
    transitionEnd: (name: 'LOGIN_FLOW' | 'LOGOUT_FLOW') => ({ type: 'TRANSITION_END' as const, name }),
});
