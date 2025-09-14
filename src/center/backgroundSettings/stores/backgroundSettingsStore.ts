import { create } from 'zustand';

interface BackgroundSettingsState {
    selectedTheme: 'light' | 'dark';
}

interface BackgroundSettingsActions {
    setSelectedTheme: (theme: 'light' | 'dark') => void;
}

export const useBackgroundSettingsStore = create<BackgroundSettingsState & BackgroundSettingsActions>((set) => ({
    selectedTheme: 'light',

    setSelectedTheme: (theme) => set({selectedTheme: theme}),
}));
