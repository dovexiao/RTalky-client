// 网络连接状态类型定义
export type ConnectivityState = 'ONLINE' | 'OFFLINE' | 'UNKNOWN';

export interface ConnectivityContext {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    connectionType: string | null;
    lastOnlineTime: number | null;
}

export interface ConnectivityEvent {
    type: 'NETWORK_OFFLINE' | 'NETWORK_ONLINE';
    payload: {
        isConnected: boolean;
        isInternetReachable: boolean | null;
        connectionType: string | null;
        timestamp: number;
    };
}

export interface ConnectivityService {
    start: () => void;
    stop: () => void;
    getCurrentState: () => ConnectivityState;
    isOnline: () => boolean;
    addEventListener: (handler: (event: ConnectivityEvent) => void) => () => void;
    getContext: () => ConnectivityContext;
    isListening: () => boolean;
}
