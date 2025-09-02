import { create } from 'zustand';
import { RootStackParamList } from '@/types';

type RouteName = keyof RootStackParamList;

interface NavigationState {
  initialRouteName: RouteName;
  setInitialRouteName: (routeName: RouteName) => void;
  resetInitialRouteName: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  initialRouteName: 'VerificationLogin', // 默认初始路由
  setInitialRouteName: (routeName: RouteName) => set({ initialRouteName: routeName }),
  resetInitialRouteName: () => set({ initialRouteName: 'VerificationLogin' }),
}));
