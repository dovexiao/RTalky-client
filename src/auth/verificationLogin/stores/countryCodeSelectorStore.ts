import { create } from 'zustand';
import { countryManager } from '@utils/CountryManager.ts';
import { CountryListItem, SectionIndexMap } from '@/auth/verificationLogin/types';
import generateCountrySectionData, { FlashListData } from '@/auth/verificationLogin/utils/generateCountrySectionData.ts';

interface CountryCodeSelectorState {
    flashListData: CountryListItem[];
    sectionIndexMap: SectionIndexMap;
    activeLetter: string;
    popupLetter: string;
    setFlashListData: (data: FlashListData) => void;
    setActiveLetter: (letter: string) => void;
    setPopupLetter: (letter: string) => void;
}

const initialData = generateCountrySectionData(countryManager.getAllCountries());

export const useCountryCodeSelectorStore = create<CountryCodeSelectorState>((set) => ({
    flashListData: initialData.data,
    sectionIndexMap: initialData.sectionIndexMap,
    activeLetter: '',
    popupLetter: '',

    setFlashListData: (data: FlashListData) => set({
        flashListData: data.data,
        sectionIndexMap: data.sectionIndexMap,
    }),
    setActiveLetter: (letter: string) => set({ activeLetter: letter }),
    setPopupLetter: (letter: string) => set({ popupLetter: letter }),
}));
