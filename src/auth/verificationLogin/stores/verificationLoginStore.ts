import { create } from 'zustand';
import { countryManager } from '@/auth/verificationLogin/utils';
import { CellCount } from '@/auth/verificationLogin/types';
import { LoginService, SmsService } from '@/auth/services';
import type { LoginData } from '@/auth/services/loginService.ts';

interface VerificationLoginState {
    phoneNumber: string;
    isAgreedToTerms: boolean;
    isFormValid: boolean;
    errorMessage: string;
    isSendingSms: boolean;

    selectedCallingCode: string;
    selectedCCA2: string;
    selectedSectionLetter: string;
    formattedNumber: string;

    codeDigits: CellCount,
    isCodeCompleted: boolean,

    hideCountryCodeDialogFn: () => void,

    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreedToTerms: (isAgreed: boolean) => void;
    setSelectedCallingCode: (countryCode: string) => void;
    setSelectedCCA2: (cca2: string) => void;
    setSelectedSectionLetter: (letter: string) => void;
    setCodeDigits: (digits: number) => void;
    setIsCodeCompleted: (isComplete: boolean) => void,
    setHideCountryCodeDialogFn: (onHideFn: () => void) => void,

    validateAndFormatPhone: () => boolean;

    onSelectedCallingCode: (callingCode: string, cca2: string, sectionLetters: string) => void,

    sendSmsCode: (onSuccess: () => void) => Promise<void>;

    verificationSmsLogin: (inputCode: string) => Promise<LoginData>;

    resetForm: () => void;
}

export const useVerificationLoginStore = create<VerificationLoginState>((set, get) => ({
    phoneNumber: '',
    isAgreedToTerms: false,
    isFormValid: false,
    errorMessage: '',
    isSendingSms: false,

    selectedCallingCode: '+86',
    selectedCCA2: 'CN',
    selectedSectionLetter: 'C',
    formattedNumber: '',

    codeDigits: 6,
    isCodeCompleted: false,
    hideCountryCodeDialogFn: () => {},

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
        set({ codeDigits: digits as CellCount });
    },

    setIsCodeCompleted: (isComplete: boolean) => {
        set({ isCodeCompleted: isComplete });
    },

    setHideCountryCodeDialogFn: (onHideFn) => {
        set({ hideCountryCodeDialogFn: onHideFn });
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
        console.log('验证结果:', result);

        return result.isValid;
    },

    onSelectedCallingCode: (callingCode, cca2, sectionLetters) => {
        set({
            selectedCallingCode: callingCode,
            selectedCCA2: cca2,
            selectedSectionLetter: sectionLetters,
        });
        get().hideCountryCodeDialogFn();
    },

    sendSmsCode: async (onSuccess) => {
        try {
            set({
                isSendingSms: true,
            });

            const { validateAndFormatPhone } = get();

            const isValid = validateAndFormatPhone();

            // 验证逻辑
            if (!isValid) {
                return;
            }

            const response = await SmsService.sendSmsCode(get().formattedNumber, get().isAgreedToTerms);

            if (response.success && response.codeDigits) {
                set({ codeDigits: response.codeDigits as CellCount });

                onSuccess();
            } else {
                throw new Error(response.message || '发送失败');
            }
        } catch (error) {
            throw error;
        } finally {
            set({ isSendingSms: false });
        }
    },

    verificationSmsLogin: async (inputCode: string) => {
        try {
            const response = await LoginService.smsLogin(
                get().formattedNumber,
                inputCode,
                get().isAgreedToTerms,
            );

            if (response.success) {
                console.log('短信验证码校验成功');
                return response.data;
            } else {
                console.log('验证码校验失败');
                throw new Error(`验证码校验失败, ${response.message}`);
            }
        } catch (error: any) {
            throw error;
        }
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
        isCodeCompleted: false,
        hideCountryCodeDialogFn: () => {},
        isSendingSms: false,
    }),
}));
