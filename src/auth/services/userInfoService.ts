import { get } from '@/services/fetch/request';

// 用户信息数据
export interface UserInfoData {
    userId: string;
    nickname: string;
    bio: string;
    avatar: string;
}

// 用户信息API响应
export interface UserInfoResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: UserInfoData | null;
}

export class UserInfoService {
    /**
     * 获取用户信息
     * 注意：由于axios拦截器会自动从UserAuthManager获取token并设置Authorization头，
     * 所以这里不需要手动传递任何参数
     * @returns 用户信息响应
     */
    static async getUserInfo(): Promise<UserInfoResponse> {
        try {
            // axios拦截器会自动处理Authorization头的设置
            const response = await get<UserInfoResponse>('/auth/user-info');
            return response;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            throw error;
        }
    }
}
