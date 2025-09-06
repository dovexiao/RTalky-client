import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VerificationCodeInput } from './VerificationCodeInput';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useTheme } from '@ui-kitten/components';

// 导入CellCount类型
type CellCount = 4 | 5 | 6 | 7;

interface VerificationCodeSectionProps {
    onCodeComplete: (code: string) => void;
}

export const VerificationCodeSection: React.FC<VerificationCodeSectionProps> = ({
    onCodeComplete,
}) => {
    const codeDigits = useVerificationLoginStore(state => state.codeDigits);
    const editable = !useVerificationLoginStore(state => state.isCodeComplete);
    const themes = useTheme();

    return (
        <View style={styles.codeInputContainer}>
            <VerificationCodeInput
                cellCount={codeDigits as CellCount}
                onFinish={onCodeComplete}
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
