import { create } from 'zustand';
import { countryManager } from '@/auth/verificationLogin/utils';
import { CellCount } from '@/auth/verificationLogin/types';
import { LoginService, SmsService } from '@/auth/services';
import UserAuthManager from '@utils/UserAuthManager.ts';
import { useNavigationStore } from '@navigation/stores';
import { useAuthStore } from '@/auth/stores';
import { ImageCache } from '@/utils';

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
    isCodeComplete: boolean,

    hideCountryCodeDialogFn: () => void,

    setPhoneNumber: (phoneNumber: string) => void;
    setIsAgreedToTerms: (isAgreed: boolean) => void;
    setSelectedCallingCode: (countryCode: string) => void;
    setSelectedCCA2: (cca2: string) => void;
    setSelectedSectionLetter: (letter: string) => void;
    setCodeDigits: (digits: number) => void;
    setIsCodeComplete: (isComplete: boolean) => void,
    setHideCountryCodeDialogFn: (onHideFn: () => void) => void,

    validateAndFormatPhone: () => boolean;

    onSelectedCallingCode: (callingCode: string, cca2: string, sectionLetters: string) => void,

    sendSmsCode: (onSuccess: () => void) => Promise<void>;

    handleCodeComplete: (inputCode: string) => Promise<void>;

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
    isCodeComplete: false,
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

    setIsCodeComplete: (isComplete: boolean) => {
        set({ isCodeComplete: isComplete });
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
        const { setMessageType, setMessageText } = useNavigationStore.getState();

        try {
            setMessageType('loading');

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

            setMessageType('success');
            setMessageText('短信验证码已发送');
        }
    },

    handleCodeComplete: async (inputCode: string) => {
        set({ isCodeComplete: true });

        console.log('登录校验中');

        const { setMessageType, setMessageText } = useNavigationStore.getState();

        setMessageType('loading');
        setMessageText('登录校验中...');

        try {
            const response = await LoginService.smsLogin(
                get().formattedNumber,
                inputCode,
                get().isAgreedToTerms,
            );

            if (response.success) {
                console.log('校验完成');

                setMessageType('success');
                setMessageText('验证成功');

                if (UserAuthManager) {
                    console.log('校验完成初始化中');

                    setMessageType('loading');
                    setMessageText('初始化中...');

                    await UserAuthManager.saveUserAuthComplete(
                        response.data.userId,
                        {
                            phoneNumber: response.data.phoneNumber,
                            sessionToken: response.data.sessionToken,
                        },
                    );
                    const { setInitialRouteName } = useNavigationStore.getState();
                    const { handleLogin, setAvatar, setIsLoggedIn } = useAuthStore.getState();

                    setInitialRouteName('AppMain');

                    handleLogin(response.data.userId, response.data.userProfile);
                    const imagePath = await ImageCache.saveImageToFile(response.data.userProfile.avatar, 'AVATARS');
                    setAvatar(imagePath);

                    setIsLoggedIn(true);

                    setMessageType('none');
                    setMessageText('');
                } else {
                    console.log('初始化失败');
                    throw new Error('初始化失败, 相关服务缺失');
                }
            } else {
                console.log('验证码校验失败');
                throw new Error(`验证码校验失败, ${response.message}`);
            }
        } catch (error: any) {
            console.log(error?.message ?? error);

            setMessageType('danger');
            setMessageText(error?.message ?? error);
        } finally {
            set({ isCodeComplete: false });
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
        isCodeComplete: false,
        hideCountryCodeDialogFn: () => {},
        isSendingSms: false,
    }),
}));
