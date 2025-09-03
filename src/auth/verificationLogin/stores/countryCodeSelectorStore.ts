import { create } from 'zustand';
import { countryManager } from '@utils/CountryManager.ts';
import { SectionListData } from 'react-native';
import { Country } from '@/auth/verificationLogin/types';
import generateCountrySectionData from '@/auth/verificationLogin/utils/generateCountrySectionData.ts';

interface CountryCodeSelectorState {
    sections: SectionListData<Country>[];
    activeLetter: string;
    popupLetter: string;
    setSections: (sections: SectionListData<Country>[]) => void;
    setActiveLetter: (letter: string) => void;
    setPopupLetter: (letter: string) => void;
}

export const useCountryCodeSelectorStore = create<CountryCodeSelectorState>((set) => ({
    sections: generateCountrySectionData(countryManager.getAllCountries()),
    activeLetter: '',
    popupLetter: '',

    setSections: (sections: SectionListData<Country>[]) => set({ sections }),
    setActiveLetter: (letter: string) => set({ activeLetter: letter }),
    setPopupLetter: (letter: string) => set({ popupLetter: letter }),
}));
