import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

const VerifyLoginButton: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isFormValid = useVerificationLoginStore(state => state.isFormValid);
    const resetForm = useVerificationLoginStore(state => state.resetForm);

    const handleVerifyLogin = () => {
        if (isFormValid) {
            resetForm();
            navigation.navigate('VerificationCode');
        }
    };

    return (
        <Button
            style={styles.button}
            onPress={handleVerifyLogin}
            disabled={!isFormValid}
        >
            <Text style={styles.buttonText}>验证并登录</Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderWidth: 0,
        marginBottom: 25,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default VerifyLoginButton;
