import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    CancelTokenSource,
} from 'axios';
import type { AuthGuardConfig, RequestContext } from './types';
import { UserAuthManager, ExceptionUtils } from '@/utils';
import Config from 'react-native-config';
import { useSessionStore, createSessionEvents } from '../session';

// HTTP鉴权守卫服务类
class AuthGuard {
    private readonly api: AxiosInstance;
    private config: AuthGuardConfig;
    private isHandling401 = false; // 401处理并发锁
    private pendingRequests = new Map<string, CancelTokenSource>();

    constructor(config: AuthGuardConfig) {
        this.config = config;
        this.api = this.createAxiosInstance();
        this.setupInterceptors();
    }

    /**
     * 创建axios实例
     */
    private createAxiosInstance(): AxiosInstance {
        return axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
        });
    }

    /**
     * 设置拦截器
     */
    private setupInterceptors(): void {
        // 请求拦截器
        this.api.interceptors.request.use(
            this.handleRequest.bind(this),
            this.handleRequestError.bind(this)
        );

        // 响应拦截器
        this.api.interceptors.response.use(
            this.handleResponse.bind(this),
            this.handleResponseError.bind(this)
        );
    }

    /**
     * 获取axios实例（供外部使用）
     */
    getAxiosInstance(): AxiosInstance {
        return this.api;
    }

    /**
     * 处理请求拦截
     */
    private async handleRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        try {
            // 生成请求ID
            const requestId = this.generateRequestId();
            const cancelTokenSource = axios.CancelToken.source();

            // 设置取消令牌
            config.cancelToken = cancelTokenSource.token;
            (config as any).requestId = requestId;

            // 存储请求上下文
            const requestContext: RequestContext = {
                requestId,
                timestamp: Date.now(),
                url: config.url || '',
                method: config.method?.toUpperCase() || 'GET',
                hasToken: false,
            };

            // 注入token（如果启用）
            if (this.config.enableTokenInjection) {
                const token = await this.getCurrentToken();
                if (token && config.headers) {
                    config.headers.set('Authorization', `Bearer ${token ?? ''}`);

                    // 设置默认内容类型
                    config.headers.set('Content-Type', 'application/json');
                    // 设置接受的响应类型
                    config.headers.set('Accept', 'application/json');
                    // 设置用户代理
                    config.headers.set('User-Agent', `${Config.APP_NAME} (${Config.APP_VERSION})`);

                    requestContext.hasToken = true;
                }
            }

            // 存储取消令牌
            this.pendingRequests.set(requestId, cancelTokenSource);

            console.log('[AuthGuard] 请求信息:', requestContext);

            return config;
        } catch (error) {
            ExceptionUtils.logError(error, 'AuthGuard 请求拦截器错误');
            throw error;
        }
    }

    /**
     * 处理请求错误
     */
    private handleRequestError(error: AxiosError): Promise<AxiosError> {
        ExceptionUtils.logError(error, 'AuthGuard 请求错误');
        return Promise.reject(error);
    }

    /**
     * 处理响应拦截
     */
    private handleResponse(response: AxiosResponse): AxiosResponse {
        // 请求完成，移除取消令牌
        const requestId = (response.config as any)?.requestId;
        if (requestId) {
            this.pendingRequests.delete(requestId);
        }

        console.log('[AuthGuard] 响应信息:', {
            requestId,
            status: response.status,
            url: response.config.url,
        });

        return response;
    }

    /**
     * 处理响应错误
     */
    private async handleResponseError(error: AxiosError): Promise<AxiosError> {
        try {
            // 请求完成，移除取消令牌
            const requestId = (error.config as any)?.requestId;
            if (requestId) {
                this.pendingRequests.delete(requestId);
            }

            console.log('[AuthGuard] 错误响应信息:', {
                requestId,
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
            });

            // 处理 401 错误
            if (error.response?.status === 401 && this.config.enable401Handling) {
                await this.handle401Error();
            }

            return Promise.reject(error);
        } catch (handlingError) {
            ExceptionUtils.logError(handlingError, 'AuthGuard 响应错误处理错误');
            return Promise.reject(error);
        }
    }

    /**
     * 处理 401 错误
     */
    private async handle401Error(): Promise<void> {
        // 401 幂等处理：如果已经在处理中，直接返回
        if (this.isHandling401) {
            console.log('[AuthGuard] 401 已在处理中，跳过重复处理');
            return;
        }

        // 设置锁，开始处理
        this.isHandling401 = true;
        console.log('[AuthGuard] 开始处理401错误');

        try {
            // 取消所有进行中的请求
            const pendingCount = this.pendingRequests.size;
            if (pendingCount > 0) {
                console.log(`[AuthGuard] 取消 ${pendingCount} 个进行中的请求`);
                this.pendingRequests.forEach((source, requestId) => {
                    source.cancel('Token expired, request cancelled');
                    this.pendingRequests.delete(requestId);
                });
            }

            // 发布401检测事件到状态机
            const events = createSessionEvents();
            useSessionStore.getState().dispatch(events.token401Detected());

        } catch (error: unknown) {
            ExceptionUtils.logError(error, 'AuthGuard 401处理错误');
        } finally {
            this.isHandling401 = false;
        }
    }

    /**
     * 生成请求ID
     */
    private generateRequestId(): string {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * 获取当前token
     */
    private async getCurrentToken(): Promise<string | null> {
        try {
            return await UserAuthManager.getCurrentSessionToken();
        } catch (error) {
            ExceptionUtils.logError(error, 'AuthGuard 获取token错误');
            return null;
        }
    }
}

// 创建默认配置的守卫实例
const createAuthGuard = (config: Partial<AuthGuardConfig> = {}): AuthGuard => {
    const defaultConfig: AuthGuardConfig = {
        baseURL: Config.API_URL,
        timeout: 10000,
        enableTokenInjection: true,
        enable401Handling: true,
        enableRequestCancellation: true,
        ...config,
    };

    return new AuthGuard(defaultConfig);
};

// 创建默认配置的守卫实例
const authGuardInstance = createAuthGuard();

// 导出axios实例供直接使用
export const axiosApi = authGuardInstance.getAxiosInstance();
