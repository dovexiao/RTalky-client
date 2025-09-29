import { create } from 'zustand';
import { RootStackParamList } from '@navigation/types';

export type RouteName = keyof RootStackParamList;

interface NavigationState {
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
    initialRouteName: RouteName;
    setInitialRouteName: (routeName: RouteName) => void;
    resetInitialRouteName: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    isActive: false,
    setIsActive: (isActive: boolean) => set({ isActive }),
    initialRouteName: 'VerificationLogin', // 默认初始路由
    setInitialRouteName: (routeName: RouteName) => set({ initialRouteName: routeName }),
    resetInitialRouteName: () => set({ initialRouteName: 'VerificationLogin' }),
}));
