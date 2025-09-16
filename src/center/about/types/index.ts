export interface PermissionItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    permissionType: 'camera' | 'photos' | 'internet';
}

export enum PermissionStatusText {
    'default-granted' = '默认授权',
    'granted' = '已授权',
    'denied' = '未授权',
    'blocked' = '被拒绝',
    'limited' = '权限受限',
    'unavailable' = '未知'
}
