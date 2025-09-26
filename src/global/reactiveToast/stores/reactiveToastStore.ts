import { create } from 'zustand';
import {MessageType} from '@global/reactiveToast/types';

interface ReactiveToastState {
    messageType: MessageType;
    messageText: string;
    isActive: boolean;

    setMessageType: (messageType: MessageType) => void;
    setMessageText: (messageText: string) => void;
    setIsActive: (isActive: boolean) => void;
}

export const useReactiveToastStore = create<ReactiveToastState>((set) => ({
    messageType: 'none',
    messageText: '',
    isActive: false,

    setMessageType: (messageType: MessageType) => set({ messageType }),
    setMessageText: (messageText: string) => set({ messageText }),
    setIsActive: (isActive: boolean) => set({ isActive }),
}));
