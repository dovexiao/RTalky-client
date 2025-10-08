import { get, post } from '@/services/fetch/request';

// 会话验证响应
export interface SessionValidationResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

// 会话退出响应
export interface SessionLogoutResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export class SessionService {
    /**
     * 检查服务健康状态
     */
    static async healthCheck(): Promise<any> {
        try {
            return await get('/health');
        } catch (error) {
            throw error;
        }
    }

    /**
     * 验证会话令牌
     * 注意：由于axios拦截器会自动从UserAuthManager获取token并设置Authorization头，
     * 所以这里不需要手动传递sessionToken参数
     * @returns 验证结果
     */
    static async validateSession(): Promise<SessionValidationResponse> {
        try {
            const response = await get<SessionValidationResponse>('/auth/validate');
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 退出会话令牌
     * 注意：由于axios拦截器会自动从UserAuthManager获取token并设置Authorization头，
     * 所以这里不需要手动传递sessionToken参数
     * @returns 退出结果
     */
    static async logoutSession(): Promise<SessionLogoutResponse> {
        try {
            const response = await post<SessionLogoutResponse>('/auth/logout');
            return response;
        } catch (error) {
            throw error;
        }
    }
}
