import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import type { ConnectivityState, ConnectivityContext, ConnectivityEvent, ConnectivityService } from './types';

// 网络监听服务类
class ConnectivityMonitor implements ConnectivityService {
    private context: ConnectivityContext = {
        isConnected: true,
        isInternetReachable: true,
        connectionType: null,
        lastOnlineTime: null,
    };

    private unsubscribe: (() => void) | null = null;
    private eventHandlers: ((event: ConnectivityEvent) => void)[] = [];

    constructor() {
        this.handleNetworkStateChange = this.handleNetworkStateChange.bind(this);
    }

    /**
     * 开始监听网络状态
     */
    start(): void {
        if (this.unsubscribe) {
            console.log('[ConnectivityService] 已经在监听中');
            return;
        }

        console.log('[ConnectivityService] 开始监听网络状态');

        // 先获取当前网络状态
        NetInfo.fetch().then(state => {
            this.handleNetworkStateChange(state);
        });

        // 开始监听网络状态变化
        this.unsubscribe = NetInfo.addEventListener(this.handleNetworkStateChange);
    }

    /**
     * 停止监听网络状态
     */
    stop(): void {
        if (this.unsubscribe) {
            console.log('[ConnectivityService] 停止监听网络状态');
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    /**
     * 获取当前连接状态
     */
    getCurrentState(): ConnectivityState {
        // 如果明确连接且网络可达，则在线
        if (this.context.isConnected && this.context.isInternetReachable === true) {
            return 'ONLINE';
        }
        // 如果明确不连接，则离线
        if (!this.context.isConnected) {
            return 'OFFLINE';
        }
        // 其他情况（连接但网络可达性未知，或连接状态未知）
        return 'UNKNOWN';
    }

    /**
     * 判断是否在线
     */
    isOnline(): boolean {
        return this.getCurrentState() === 'ONLINE';
    }

    /**
     * 添加事件监听器
     */
    addEventListener(handler: (event: ConnectivityEvent) => void): () => void {
        this.eventHandlers.push(handler);

        // 返回取消监听的函数
        return () => {
            const index = this.eventHandlers.indexOf(handler);
            if (index > -1) {
                this.eventHandlers.splice(index, 1);
            }
        };
    }

    /**
     * 移除所有事件监听器
     */
    removeEventListener() {
        this.eventHandlers = [];
    }

    /**
     * 获取当前上下文信息
     */
    getContext(): ConnectivityContext {
        return { ...this.context };
    }

    /**
     * 检查是否正在监听
     */
    isListening(): boolean {
        return this.unsubscribe !== null;
    }

    /**
     * 处理网络状态变化
     */
    private handleNetworkStateChange(state: NetInfoState): void {
        try {
            const prevIsOnline = this.isOnline();

            // 更新上下文
            this.context = {
                ...this.context,
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable,
                connectionType: state.type,
            };

            const currentIsOnline = this.isOnline();

            console.log('[ConnectivityService] 网络状态变化:', {
                isConnected: this.context.isConnected,
                isInternetReachable: this.context.isInternetReachable,
                connectionType: this.context.connectionType,
                isOnline: currentIsOnline,
                previousOnline: prevIsOnline,
            });

            // 状态边沿检测
            if (prevIsOnline !== currentIsOnline) {
                if (currentIsOnline) {
                    // 从离线恢复到在线
                    this.handleOnline();
                } else {
                    // 从在线变为离线
                    this.handleOffline();
                }
            }
        } catch (error) {
            console.error('[ConnectivityService] 处理网络状态变化失败:', error);
        }
    }

    /**
     * 处理网络恢复
     */
    private handleOnline(): void {
        console.log('[ConnectivityService] 网络已恢复');

        // 记录恢复时间
        this.context.lastOnlineTime = Date.now();

        // 发布网络恢复事件
        this.emitEvent({
            type: 'NETWORK_ONLINE',
            payload: {
                isConnected: this.context.isConnected,
                isInternetReachable: this.context.isInternetReachable,
                connectionType: this.context.connectionType,
                timestamp: Date.now(),
            },
        });
    }

    /**
     * 处理网络断开
     */
    private handleOffline(): void {
        console.log('[ConnectivityService] 网络已断开');

        // 发布网络断开事件
        this.emitEvent({
            type: 'NETWORK_OFFLINE',
            payload: {
                isConnected: this.context.isConnected,
                isInternetReachable: this.context.isInternetReachable,
                connectionType: this.context.connectionType,
                timestamp: Date.now(),
            },
        });
    }

    /**
     * 发布事件给所有监听器
     */
    private emitEvent(event: ConnectivityEvent): void {
        console.log('[ConnectivityService] 发布事件:', event.type);
        this.eventHandlers.forEach(handler => {
            try {
                handler(event);
            } catch (error) {
                console.error('[ConnectivityService] 事件处理器执行失败:', error);
            }
        });
    }
}

// 创建单例实例
export const connectivityService = new ConnectivityMonitor();
