import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

/**
 * 设备信息接口
 */
export interface DeviceInfoData {
    deviceId: string;
    deviceModel: string;
    osType: string;
    osVersion: string;
    appVersion: string;
}

/**
 * 设备信息管理器
 */
export class DeviceInfoManager {
    /**
     * 获取设备信息
     */
    public static async getDeviceInfo(): Promise<DeviceInfoData> {
        try {
            const [deviceId, deviceModel, osVersion, appVersion] = await Promise.all([
                DeviceInfo.getUniqueId(),
                Promise.resolve(`${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`),
                Promise.resolve(DeviceInfo.getSystemVersion()),
                Promise.resolve(DeviceInfo.getVersion()),
            ]);

            return {
                deviceId: deviceId || 'unknown',
                deviceModel: deviceModel || 'unknown',
                // osType: Platform.OS,
                osType: '422',
                osVersion: osVersion || 'unknown',
                appVersion: appVersion || '1.0.0',
            };
        } catch (error) {
            console.error('获取设备信息失败:', error);
            return {
                deviceId: 'unknown',
                deviceModel: 'unknown',
                osType: Platform.OS,
                osVersion: 'unknown',
                appVersion: '1.0.0',
            };
        }
    }
}

export default DeviceInfoManager;
