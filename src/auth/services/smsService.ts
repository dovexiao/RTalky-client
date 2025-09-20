import { post } from '@services/fetch/request.ts';
import { DeviceInfoManager, DeviceInfoUtils } from '../verificationLogin/utils';

/**
 * 发送短信验证码请求参数
 */
export interface SendSmsRequest {
    phoneNumber: string;
    deviceInfo: string;
    agreedToTerms: boolean;
}

/**
 * 发送短信验证码响应
 */
export interface SendSmsResponse {
    success: boolean;
    message?: string;
    timestamp?: string;
    codeDigits?: number;
}

/**
 * 短信服务类
 */
export class SmsService {
    /**
     * 发送短信验证码
     * @param phoneNumber 手机号
     * @param agreedToTerms 是否同意协议
     * @returns 发送结果
     */
    public static async sendSmsCode(
        phoneNumber: string,
        agreedToTerms: boolean
    ): Promise<SendSmsResponse> {
        try {
            // 获取设备信息
            const deviceInfo = await DeviceInfoManager.getDeviceInfo();
            const deviceInfoString = DeviceInfoUtils.toApiFormat(deviceInfo);

            // 构建请求参数
            const requestData: SendSmsRequest = {
                phoneNumber,
                deviceInfo: deviceInfoString,
                agreedToTerms,
            };

            // 发送请求
            const response = await post<SendSmsResponse>('/auth/sms-code', requestData);

            return response;
        } catch (error: any) {
            throw error;
        }
    }
}

export default SmsService;
