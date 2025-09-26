import { create } from 'zustand';
import { UserTheme } from '@/auth/services/loginService.ts';

export type UserProfile = {
    nickname: string;
    avatar: string;
    bio: string;
    theme: UserTheme | null;
};

interface AuthStoreState {
    isLoggedIn: boolean;
    userId: string;
    nickname: string;
    avatar: string;
    bio: string;
    theme: UserTheme | null;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUserId: (userId: string) => void;
    setNickname: (nickname: string) => void;
    setAvatar: (avatar: string) => void;
    setBio: (bio: string) => void;
    setTheme: (theme: UserTheme) => void;
    setUserProfile: (userProfile: UserProfile) => void;
    handleLogin: (userId: string, userProfile: UserProfile) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
    isLoggedIn: false,
    userId: '',
    nickname: '',
    avatar: '',
    bio: '',
    theme: null,

    setIsLoggedIn: (isLoggedIn: boolean) => set(() => ({isLoggedIn})),
    setUserId: (userId: string) => set(() => ({userId})),
    setNickname: (nickname: string) => set(() => ({nickname})),
    setAvatar: (avatar: string) => set(() => ({avatar})),
    setBio: (bio: string) => set(() => ({bio})),
    setTheme: (theme: UserTheme) => set(() => ({theme})),

    setUserProfile: (userProfile: UserProfile) =>
        set(() => ({
            nickname: userProfile.nickname || '',
            avatar: userProfile.avatar || '',
            bio: userProfile.bio || '',
            theme: userProfile.theme || null,
        })),

    handleLogin: (userId: string, userProfile: UserProfile) =>
        set(() => ({
            userId,
            nickname: userProfile.nickname || '',
            // avatar: userProfile.avatar || '',
            bio: userProfile.bio || '',
            theme: userProfile.theme || null,
        })),
}));
