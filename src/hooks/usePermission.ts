import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import {
    check,
    openSettings,
    PERMISSIONS,
    request,
    RESULTS,
    PermissionStatus,
    Permission,
} from 'react-native-permissions';
import { PermissionRationaleDialog, PermissionSettingsDialog } from './components';
import { useGlobal } from '@/contexts';

type PermissionType = 'camera' | 'photos' | 'microphone' | 'location'; // 扩展支持更多权限类型

interface PermissionConfig {
    permission: PermissionType;
    rationale: {
        title: string;
        message: string;
        positiveButton: string;
    };
    settings: {
        title: string;
        message: string;
        positiveButton: string;
    };
}

interface PermissionState {
    status: PermissionStatus;
    isLoading: boolean;
    isGranted: boolean;
}

const getPermissionConstant = (type: PermissionType): Permission => {
    if (Platform.OS === 'ios') {
        switch (type) {
            case 'camera': return PERMISSIONS.IOS.CAMERA;
            case 'photos': return PERMISSIONS.IOS.PHOTO_LIBRARY;
            case 'microphone': return PERMISSIONS.IOS.MICROPHONE;
            case 'location': return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
            default: return PERMISSIONS.IOS.CAMERA;
        }
    } else {
        switch (type) {
            case 'camera': return PERMISSIONS.ANDROID.CAMERA;
            case 'photos': return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
            case 'microphone': return PERMISSIONS.ANDROID.RECORD_AUDIO;
            case 'location': return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
            default: return PERMISSIONS.ANDROID.CAMERA;
        }
    }
};

/**
 * 自定义权限钩子，用于请求和管理应用权限
 *
 * @param config - 权限配置项
 * @param config.permission - 权限类型，可选值: 'camera' | 'photos' | 'microphone' | 'location'
 * @param config.rationale - 权限请求说明
 * @param config.rationale.title - 权限请求弹窗标题
 * @param config.rationale.message - 权限请求说明文字
 * @param config.rationale.positiveButton - 确认按钮文字
 * @param config.settings - 设置引导配置（可选）
 * @param config.settings.title - 设置引导弹窗标题
 * @param config.settings.message - 设置引导说明文字
 * @param config.settings.positiveButton - 去设置按钮文字
 *
 * @returns 包含权限状态和操作方法的对象
 * @returns status -当前权限状态
 * @returns isLoading -是否正在加载权限状态
 * @returns isGranted -权限是否已授予
 * @returns requestPermission -请求权限的函数
 * @returns checkPermission -检查权限状态的函数
 * @returns permissionType -权限类型
 *
 * @example
 * const { status, requestPermission } = UsePermission({
 *   permission: 'camera',
 *   rationale: {
 *     title: '开启相机权限',
 *     message: 'RTalky 需要相机权限用于拍摄照片更新头像',
 *     positiveButton: '去开启'
 *   },
 *   settings: {
 *     title: '权限被拒绝',
 *     message: '请在设置中允许相机权限，并重启应用以维持最佳',
 *     positiveButton: '去设置'
 *   }
 * });
 *
 * // 使用示例
 * const handleCameraAccess = async () => {
 *   const result = await requestPermission();
 *   if (result === 'granted') {
 *     // 执行相机相关操作
 *   }
 * };
 */

export const usePermission = (config: PermissionConfig) => {
    const [permissionState, setPermissionState] = useState<PermissionState>({
        status: RESULTS.UNAVAILABLE,
        isLoading: false,
        isGranted: false,
    });

    const appStateSubscription = useRef<{ remove: () => void } | null>(null);

    const permissionConstant = useMemo(() => {
        return getPermissionConstant(config.permission);
    }, [config.permission]);

    const { actionDialogRef } = useGlobal();

    // 检查权限状态
    const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
        try {
            if (!permissionConstant) {
                return RESULTS.UNAVAILABLE;
            }

            setPermissionState(prev => ({ ...prev, isLoading: true }));
            const status = await check(permissionConstant);

            setPermissionState({
                status,
                isLoading: false,
                isGranted: status === RESULTS.GRANTED,
            });
            console.log(`${config.permission} 权限状态:`, status);
            return status;
        } catch (error) {
            console.error(`${config.permission} 权限检查失败:`, error);
            setPermissionState({
                status: RESULTS.UNAVAILABLE,
                isLoading: false,
                isGranted: false,
            });
            return RESULTS.UNAVAILABLE;
        }
    }, [permissionConstant, config.permission]);

    // 初始化检查权限
    useEffect(() => {
        // checkPermission();

        return () => {
            if (appStateSubscription.current) {
                appStateSubscription.current.remove();
            }
        };
    }, []);

    // 请求权限
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!permissionConstant) {
            return false;
        }

        setPermissionState( prev =>({
            ...prev,
            isLoading: true,
        }));

        const currentStatus = await checkPermission();

        // 已授权直接返回
        if (currentStatus === RESULTS.GRANTED) {
            return true;
            // return RESULTS.GRANTED;
        }

        // 被永久拒绝时直接引导去设置
        if (currentStatus === RESULTS.BLOCKED) {
            actionDialogRef.current?.hide();
            showSettingsAlert();
            return false;
            // return RESULTS.BLOCKED;
        }

        // 显示权限请求弹窗
        return new Promise<boolean>((resolve) => {
            actionDialogRef.current?.show({
                content: PermissionRationaleDialog({title: config.settings.title, message: config.settings.message}),
                confirmButtonText: config.rationale.positiveButton,
                onConfirm: async () => {
                    const requestResult = await request(permissionConstant);
                    setPermissionState({
                        status: requestResult,
                        isLoading: false,
                        isGranted: requestResult === RESULTS.GRANTED,
                    });

                    // 处理永久拒绝情况
                    if (requestResult === RESULTS.BLOCKED) {
                        showSettingsAlert();
                    }

                    resolve(requestResult === RESULTS.GRANTED);
                },
                onCancel: () => {
                    resolve(false);
                },
            });
        });
    }, [config, permissionConstant]);

    // 显示设置引导弹窗
    const showSettingsAlert = useCallback(() => {
        actionDialogRef.current?.show({
            content: PermissionSettingsDialog({title: config.settings.title, message: config.settings.message}),
            confirmButtonText: config.settings.positiveButton,
            onConfirm: async () => {
                await openSettings().catch(() => console.warn('无法打开设置'));

                // 设置应用状态监听
                if (appStateSubscription.current) {
                    appStateSubscription.current.remove();
                }

                appStateSubscription.current = AppState.addEventListener(
                    'change',
                    async (nextAppState: AppStateStatus) => {
                        if (nextAppState === 'active') {
                            // 用户从设置返回，重新检查权限
                            await checkPermission();

                            // 移除监听
                            if (appStateSubscription.current) {
                                appStateSubscription.current.remove();
                                appStateSubscription.current = null;
                            }
                        }
                    }
                );
            },
        });
    }, [config]);

    return {
        ...permissionState,
        requestPermission,
        checkPermission,
        permissionType: config.permission,
    };
};
