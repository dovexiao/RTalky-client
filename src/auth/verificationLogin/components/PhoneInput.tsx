import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '@ui-kitten/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

interface PhoneInputProps {
    onCountryCodePress?: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onCountryCodePress }) => {
    const phoneNumber = useVerificationLoginStore(state => state.phoneNumber);
    const setPhoneNumber = useVerificationLoginStore(state => state.setPhoneNumber);
    const selectedCallingCode = useVerificationLoginStore(state => state.selectedCallingCode);

    const InputAccessory = () => (
        <TouchableOpacity style={styles.countryCodeContainer} onPress={onCountryCodePress}>
            <Text style={styles.countryCode}>{selectedCallingCode}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
    );

    return (
        <Input
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            size={'large'}
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            accessoryLeft={InputAccessory}
        />
    );
};

const styles = StyleSheet.create({
    phoneInput: {
        borderRadius: 8,
        marginBottom: 15,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    countryCode: {
        fontSize: 16,
        marginRight: 4,
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#666',
    },
});

export default PhoneInput;
