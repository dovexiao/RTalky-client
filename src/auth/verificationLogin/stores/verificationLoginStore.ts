import { create } from 'zustand';
import { countryManager } from '@/auth/verificationLogin/utils';

interface VerificationLoginState {
    phoneNumber: string;
    isAgreedToTerms: boolean;
    isFormValid: boolean;
    errorMessage: string;
    selectedCallingCode: string;
    selectedCCA2: string;
    selectedSectionLetter: string;
    formattedNumber: string;
    codeDigits: number,
    smsCode: string,
    isCodeComplete: boolean,
    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreedToTerms: (isAgreed: boolean) => void;
    setSelectedCallingCode: (countryCode: string) => void;
    setSelectedCCA2: (cca2: string) => void;
    setSelectedSectionLetter: (letter: string) => void;
    setCodeDigits: (digits: number) => void;
    setSmsCode: (code: string) => void,
    setIsCodeComplete: (isComplete: boolean) => void,
    validateAndFormatPhone: () => boolean;
    resetForm: () => void;
}

export const useVerificationLoginStore = create<VerificationLoginState>((set, get) => ({
    phoneNumber: '',
    isAgreedToTerms: false,
    isFormValid: false,
    errorMessage: '',
    selectedCallingCode: '+86',
    selectedCCA2: 'CN',
    selectedSectionLetter: 'C',
    formattedNumber: '',
    codeDigits: 6,
    smsCode: '',
    isCodeComplete: false,

    setPhoneNumber: (phoneNumber: string) => {
        const { isAgreedToTerms } = get();
        const isValid = phoneNumber !== '' && isAgreedToTerms;
        set({ phoneNumber, isFormValid: isValid });
    },

    setIsAgreedToTerms: (isAgreedToTerms: boolean) => {
        const { phoneNumber } = get();
        const isValid = phoneNumber !== '' && isAgreedToTerms;
        set({ isAgreedToTerms, isFormValid: isValid });
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

    setSmsCode: (code: string) => {
        set({ smsCode: code });
    },

    setIsCodeComplete: (isComplete: boolean) => {
        set({ isCodeComplete: isComplete });
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
        isAgreedToTerms: false,
        isFormValid: false,
        selectedCallingCode: '+86',
        selectedCCA2: 'CN',
        selectedSectionLetter: 'C',
        formattedNumber: '',
        errorMessage: '',
        codeDigits: 6,
        smsCode: '',
        isCodeComplete: false,
    }),
}));
