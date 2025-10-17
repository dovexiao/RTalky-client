import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { CheckBox, useTheme } from '@ui-kitten/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

const AgreementCheckbox: React.FC = () => {
    const themes = useTheme();
    const isAgreedToTerms = useVerificationLoginStore(state => state.isAgreedToTerms);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                checked={isAgreedToTerms}
                onChange={(checked: boolean) => {
                    const { setIsAgreedToTerms } = useVerificationLoginStore.getState();
                    setIsAgreedToTerms(checked);
                }}
            />
            <View style={styles.checkboxContent}>
                <Text style={styles.checkboxText}>我已阅读并同意 </Text>
                <TouchableOpacity onPress={() => navigation.navigate('UserAgreement')}>
                    <Text style={[styles.checkboxText, {color: themes['color-primary-500']}]}> 用户协议 </Text>
                </TouchableOpacity>
                <Text style={styles.checkboxText}>和</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={[styles.checkboxText, {color: themes['color-primary-500']}]}> 隐私政策 </Text>
                </TouchableOpacity>
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
        // justifyContent: 'center',
    },
    checkboxText: {
        fontSize: 14,
        color: '#888888',
    },
});

export default AgreementCheckbox;
