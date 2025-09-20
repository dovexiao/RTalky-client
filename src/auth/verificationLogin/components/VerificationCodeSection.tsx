import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VerificationCodeInput } from './VerificationCodeInput';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useTheme } from '@ui-kitten/components';

export const VerificationCodeSection = () => {
    const { codeDigits, handleCodeComplete } = useVerificationLoginStore.getState();
    const editable = !useVerificationLoginStore(state => state.isCodeComplete);

    const themes = useTheme();

    return (
        <View style={styles.codeInputContainer}>
            <VerificationCodeInput
                cellCount={codeDigits}
                onFinish={handleCodeComplete}
                activeColor={themes['color-primary-500']}
                editable={editable}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    codeInputContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
});
