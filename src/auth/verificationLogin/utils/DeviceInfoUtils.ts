import { DeviceInfoData } from './DeviceInfoManager';

/**
 * 设备信息工具函数
 */
export class DeviceInfoUtils {
    /**
     * 将设备信息转换为API请求格式（JSON字符串）
     */
    public static toApiFormat(deviceInfo: DeviceInfoData): string {
        return JSON.stringify({
            deviceId: deviceInfo.deviceId,
            deviceModel: deviceInfo.deviceModel,
            osType: deviceInfo.osType,
            osVersion: deviceInfo.osVersion,
            appVersion: deviceInfo.appVersion,
        });
    }
}

export default DeviceInfoUtils;
