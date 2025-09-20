import { get, put } from '@/services/fetch/request';

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

// 更新用户信息请求参数
export interface UpdateUserInfoRequest {
    nickname?: string;
    bio?: string;
    avatar?: string;
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
            throw error;
        }
    }

    /**
     * 更新用户信息
     * 支持部分字段更新，只更新提供的字段
     * 注意：由于axios拦截器会自动从UserAuthManager获取token并设置Authorization头，
     * 所以这里不需要手动传递任何参数
     * @param request 更新用户信息请求参数
     * @returns 更新用户信息响应
     */
    static async updateUserInfo(request: UpdateUserInfoRequest): Promise<UserInfoResponse> {
        try {
            // axios拦截器会自动处理Authorization头的设置
            const response = await put<UserInfoResponse>('/auth/user-info', request);
            return response;
        } catch (error) {
            console.error('更新用户信息失败:', error);
            throw error;
        }
    }
}
