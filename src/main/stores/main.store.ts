import { create } from 'zustand';

interface MainStore {}

export const useMainStore = create<MainStore>((set) => ({}));
