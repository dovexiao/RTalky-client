import { create } from 'zustand';

interface BackgroundSettingsState {
    selectedTheme: 'light' | 'dark' | '';
}

interface BackgroundSettingsActions {
    setSelectedTheme: (theme: 'light' | 'dark') => void;
    initialize: (theme: 'light' | 'dark') => void;
    reset: () => void;
}

export const useBackgroundSettingsStore = create<BackgroundSettingsState & BackgroundSettingsActions>((set) => ({
    selectedTheme: '',

    setSelectedTheme: (theme) => set({selectedTheme: theme}),
    initialize: (theme) => set({selectedTheme: theme}),
    reset: () => set({selectedTheme: ''}),
}));
