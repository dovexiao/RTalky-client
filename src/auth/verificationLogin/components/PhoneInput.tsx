import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@ui-kitten/components';
import { useVerificationLoginStore } from '../stores/verificationLoginStore';

const PhoneInput: React.FC = () => {
    const phoneNumber = useVerificationLoginStore(state => state.phoneNumber);
    const setPhoneNumber = useVerificationLoginStore(state => state.setPhoneNumber);

    const InputAccessory = () => (
        <View>
            <Text style={styles.countryCode}>+86</Text>
        </View>
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
    countryCode: {
        fontSize: 16,
    },
});

export default PhoneInput;
