import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, IconElement, Input } from '@ui-kitten/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

interface PhoneInputProps {
    onCountryCodePress?: () => void;
}

const AlertIcon = (props: any): IconElement => (
    <Icon
        {...props}
        name="alert-circle-outline"
        fill={props.color}
    />
);

const PhoneInput: React.FC<PhoneInputProps> = ({ onCountryCodePress }) => {
    const phoneNumber = useVerificationLoginStore(state => state.phoneNumber);
    const setPhoneNumber = useVerificationLoginStore(state => state.setPhoneNumber);
    const selectedCallingCode = useVerificationLoginStore(state => state.selectedCallingCode);
    const errorMessage = useVerificationLoginStore(state => state.errorMessage);

    const renderAccessory = () => (
        <TouchableOpacity style={styles.countryCodeContainer} onPress={onCountryCodePress}>
            <Text style={styles.countryCode}>{selectedCallingCode}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
    );

    const renderCaption = (): React.ReactElement => {
        return (
            <>
                {errorMessage && <View style={styles.captionContainer}>
                    {AlertIcon(styles.captionIcon)}
                    <Text style={styles.captionText}>
                        {errorMessage}
                    </Text>
                </View>}
            </>
        );
    };

    return (
        <Input
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            size={'large'}
            caption={renderCaption}
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            accessoryLeft={renderAccessory}
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
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    captionIcon: {
        width: 10,
        height: 10,
        marginRight: 5,
        // color: '#A0A0A0',
        color: 'red',
    },
    captionText: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'opensans-regular',
        // color: '#A0A0A0',
        color: 'red',
    },
});

export default PhoneInput;
