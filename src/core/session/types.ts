// 会话状态机类型定义
export type SessionState =
  | 'UNINITIALIZED'      // 未初始化
  | 'INITIALIZING'       // 初始化中
  | 'AUTHENTICATED'      // 已登录
  | 'UNAUTHENTICATED'    // 未登录
  | 'TRANSITIONING';     // 关键过渡中

export type SessionEvent =
    | { type: 'INIT_REQUEST' }
    | { type: 'INIT_SUCCESS'; userProfile: UserProfile }
    | { type: 'INIT_FAIL'; error?: unknown }
    | { type: 'LOGIN_SUCCESS'; userProfile: UserProfile }
    | { type: 'LOGIN_FAIL'; error?: unknown }
    | { type: 'TOKEN_401_DETECTED' }
    | { type: 'LOGOUT_SUCCESS' }
    | { type: 'LOGOUT_FAIL'; error?: unknown }
    | { type: 'TRANSITION_END'; name: 'LOGIN_FLOW' | 'LOGOUT_FLOW' };

export interface UserProfile {
    userId: string;
    nickname: string;
    avatar: string;
    bio: string;
    theme: 'DARK' | 'LIGHT' | 'SYSTEM';
}

export interface SessionContext {
  userProfile?: UserProfile | null; // 用户信息（可空）
  lastError?: unknown;              // 最近错误
  transition?: { name: string; startedAt: number } | null; // 当前过渡
}

export interface SessionStore {
    state: SessionState;
    previousState: SessionState;
    context: SessionContext;
    dispatch: (event: SessionEvent) => void;
    // 选择器
    isLoggedIn: boolean;
    isInitializing: boolean;
    isTransitioning: boolean;
    currentUser: UserProfile | null;
}

export type EffectState = SessionState | null;

export type EffectHandle = { activate: (state: SessionState, context: SessionContext) => void };
