import { post } from '@services/fetch/request.ts';
import { DeviceInfoManager } from '@/auth/verificationLogin/utils';
import { DeviceInfoUtils } from '@/auth/verificationLogin/utils';

enum AuthMethod {
    SMS = 'SMS',
    PASSWORD = 'PASSWORD',
    ONE_CLICK = 'ONE_CLICK',
}

// 登录请求参数
export interface LoginRequest {
    phoneNumber: string;
    authMethod: AuthMethod;
    smsCode?: string;
    password?: string;
    oneClickToken?: string;
    deviceInfo: string;
    agreedToTerms: boolean;
}

// 用户资料信息
export interface UserProfile {
    nickname: string;
    avatar: string;
    bio: string;
}

// 登录数据
export interface LoginData {
    userId: string;
    phoneNumber: string;
    sessionToken: string;
    loginTime: string;
    tokenExpiryTime: string;
    userProfile: UserProfile;
}

// 登录API响应（新的统一格式）
export interface LoginResponse {
    success: true;
    message: string;
    timestamp: string;
    data: LoginData;
}

// 错误响应
export interface ErrorResponse {
    success: false;
    message: string;
    timestamp: string;
}

export class LoginService {
    /**
     * 短信验证码登录
     */
    static async smsLogin(
        phoneNumber: string,
        smsCode: string,
        agreedToTerms: boolean
    ): Promise<LoginResponse> {
        try {
            // 获取设备信息
            const deviceInfo = await DeviceInfoManager.getDeviceInfo();
            const deviceInfoString = DeviceInfoUtils.toApiFormat(deviceInfo);

            const requestData: LoginRequest = {
                phoneNumber,
                authMethod: AuthMethod.SMS,
                smsCode,
                deviceInfo: deviceInfoString,
                agreedToTerms,
            };

            const response = await post<LoginResponse>('/auth/sms-login', requestData);

            return response;
        } catch (error) {
            console.log('短信验证码登录失败:', error);
            throw error;
        }
    }
}
