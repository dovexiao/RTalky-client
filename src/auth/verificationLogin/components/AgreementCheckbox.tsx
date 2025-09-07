import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckBox, useTheme } from '@ui-kitten/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

const AgreementCheckbox: React.FC = () => {
    const themes = useTheme();
    const isAgreedToTerms = useVerificationLoginStore(state => state.isAgreedToTerms);

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                checked={isAgreedToTerms}
                onChange={(checked: boolean) => {
                    const setIsAgreedToTerms = useVerificationLoginStore.getState().setIsAgreedToTerms;
                    setIsAgreedToTerms(checked);
                }}
            />
            <View style={styles.checkboxContent}>
                <Text style={styles.checkboxText}>
                    我已阅读并同意
                    <Text style={{color: themes['color-primary-500']}}> 用户协议 </Text>
                    和
                    <Text style={{color: themes['color-primary-500']}}> 隐私政策 </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    checkboxContent: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 14,
        color: '#888888',
    },
});

export default AgreementCheckbox;
