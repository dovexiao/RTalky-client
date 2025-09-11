// 菜单项类型定义
export interface MenuItem {
    id?: string;
    icon: string;
    title: string;
    subtitle?: string;
    color: string;
    onPress?: () => void;
    disabled?: boolean;
}
