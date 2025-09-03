import { create } from 'zustand';

interface VerificationLoginState {
    phoneNumber: string;
    isAgreed: boolean;
    isFormValid: boolean;
    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreed: (isAgreed: boolean) => void;
    resetForm: () => void;
}

export const useVerificationLoginStore = create<VerificationLoginState>((set, get) => ({
    phoneNumber: '',
    isAgreed: false,
    isFormValid: false,

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

    resetForm: () => set({ phoneNumber: '', isAgreed: false, isFormValid: false }),
}));
