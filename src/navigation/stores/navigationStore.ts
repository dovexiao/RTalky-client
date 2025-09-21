import { create } from 'zustand';
import { MessageType, RootStackParamList } from '@navigation/types';

export type RouteName = keyof RootStackParamList;

interface NavigationState {
    initialRouteName: RouteName;
    setInitialRouteName: (routeName: RouteName) => void;
    resetInitialRouteName: () => void;

    messageType: MessageType;
    messageText: string;
    setMessageType: (messageType: MessageType) => void;
    setMessageText: (messageText: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    initialRouteName: 'VerificationLogin', // 默认初始路由
    setInitialRouteName: (routeName: RouteName) => set({ initialRouteName: routeName }),
    resetInitialRouteName: () => set({ initialRouteName: 'VerificationLogin' }),

    messageType: 'none',
    messageText: '',
    setMessageType: (messageType: MessageType) => set({ messageType }),
    setMessageText: (messageText: string) => set({ messageText }),
}));
