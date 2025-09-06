import { create } from 'zustand';
import { countryManager } from '@/auth/verificationLogin/utils';

interface VerificationLoginState {
    phoneNumber: string;
    isAgreed: boolean;
    isFormValid: boolean;
    errorMessage: string;
    selectedCallingCode: string;
    selectedCCA2: string;
    selectedSectionLetter: string;
    formattedNumber: string;
    codeDigits: number,
    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreed: (isAgreed: boolean) => void;
    setSelectedCallingCode: (countryCode: string) => void;
    setSelectedCCA2: (cca2: string) => void;
    setSelectedSectionLetter: (letter: string) => void;
    setCodeDigits: (digits: number) => void;
    validateAndFormatPhone: () => boolean;
    resetForm: () => void;
}

export const useVerificationLoginStore = create<VerificationLoginState>((set, get) => ({
    phoneNumber: '',
    isAgreed: false,
    isFormValid: false,
    errorMessage: '',
    selectedCallingCode: '+86',
    selectedCCA2: 'CN',
    selectedSectionLetter: 'C',
    formattedNumber: '',
    codeDigits: 6,

    setPhoneNumber: (phoneNumber: string) => {
        const { isAgreed } = get();
        const isValid = phoneNumber !== '' && isAgreed;
        set({ phoneNumber, isFormValid: isValid });
    },

    setIsAgreed: (isAgreed: boolean) => {
        const { phoneNumber } = get();
        const isValid = phoneNumber !== '' && isAgreed;
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

    setCodeDigits: (digits: number) => {
        set({ codeDigits: digits });
    },

    validateAndFormatPhone: () => {
        const { phoneNumber, selectedCallingCode } = get();
        const result = countryManager.validatePhoneNumber(selectedCallingCode, phoneNumber);

        if (result.isValid) {
            set({
                formattedNumber: result.formattedNumber || '',
                errorMessage: '',
            });
        } else {
            set({
                formattedNumber: '',
                errorMessage: result.errorMessage || '手机号格式无效',
            });
        }

        return result.isValid;
    },

    resetForm: () => set({
        phoneNumber: '',
        isAgreed: false,
        isFormValid: false,
        selectedCallingCode: '+86',
        selectedCCA2: 'CN',
        selectedSectionLetter: 'C',
        formattedNumber: '',
        errorMessage: '',
    }),
}));
