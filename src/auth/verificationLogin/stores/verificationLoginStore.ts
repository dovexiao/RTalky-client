import { create } from 'zustand';

interface VerificationLoginState {
    phoneNumber: string;
    isAgreed: boolean;
    isFormValid: boolean;
    selectedCallingCode: string;
    selectedCCA2: string;
    selectedSectionLetter: string;
    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreed: (isAgreed: boolean) => void;
    setSelectedCallingCode: (countryCode: string) => void;
    setSelectedCCA2: (cca2: string) => void;
    setSelectedSectionLetter: (letter: string) => void;
    resetForm: () => void;
}

export const useVerificationLoginStore = create<VerificationLoginState>((set, get) => ({
    phoneNumber: '',
    isAgreed: false,
    isFormValid: false,
    selectedCallingCode: '+86',
    selectedCCA2: 'CN',
    selectedSectionLetter: 'C',

    setPhoneNumber: (phoneNumber: string) => {
        const { isAgreed } = get();
        const isValid = phoneNumber.length === 11 && isAgreed;
        set({ phoneNumber, isFormValid: isValid });
    },

    setIsAgreed: (isAgreed: boolean) => {
        const { phoneNumber } = get();
        const isValid = phoneNumber.length === 11 && isAgreed;
        set({ isAgreed, isFormValid: isValid });
    },

    setSelectedCallingCode: (callingCode: string) => {
        set({ selectedCallingCode: callingCode });
    },

    setSelectedCCA2: (cca2: string) => {
        set({ selectedCCA2: cca2 });
    },

    setSelectedSectionLetter: (letter: string) => {
        set({ selectedSectionLetter: letter });
    },

    resetForm: () => set({ phoneNumber: '', isAgreed: false, isFormValid: false, selectedCallingCode: '+86' }),
}));
