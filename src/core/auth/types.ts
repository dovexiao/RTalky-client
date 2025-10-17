// HTTP鉴权守卫类型定义
export interface AuthGuardConfig {
    baseURL: string;
    timeout: number;
    enableTokenInjection: boolean;
    enable401Handling: boolean;
    enableRequestCancellation: boolean;
}

export interface RequestContext {
    requestId: string;
    timestamp: number;
    url: string;
    method: string;
    hasToken: boolean;
}
