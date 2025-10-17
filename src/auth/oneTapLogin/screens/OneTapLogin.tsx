import { Button, CheckBox, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

const OneTapLogin = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={'#FFFFFF'} />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@assets/images/logo_ss.png')}
                        style={styles.logo}
                    />
                </View>
                <PhoneDisplay />
                <OneTapLoginButton />
                <AgreementCheckbox />
                <OtherLogin />
            </View>
        </SafeAreaView>
    );
};

{/* 手机号展示区域 */}
const PhoneDisplay = () => {
    return (
        <View style={styles.phoneContainer}>
            <Text style={styles.phoneText}>173****4003</Text>
            <Text style={styles.authText}>认证服务由 阿里云号码认证 提供</Text>
        </View>
    );
};

const AgreementCheckbox = () => {
    const themes = useTheme();

    // const isChecked = useRegisterStore(state => state.isChecked);
    // const setIsChecked = useRegisterStore(state => state.setIsChecked);

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                // checked={isChecked}
                // onChange={nextChecked => setIsChecked(nextChecked)}
            />
            <View style={styles.checkboxContent}>
                <Text style={styles.checkboxText}>
                    我已阅读并同意
                    <Text style={{ color: themes['color-primary-500'] }}> 用户协议 </Text>
                    和
                    <Text style={{ color: themes['color-primary-500'] }}> 隐私政策 </Text>
                </Text>
            </View>
        </View>
    );
};

const OneTapLoginButton = () => {
    // const isChecked = useRegisterStore(state => state.isChecked);
    // const validateForm = useRegisterStore(state => state.validateForm);
    // const resetForm = useRegisterStore(state => state.resetForm);

    const handleRegister = () => {
        // if (validateForm()) {
        //     resetForm();
        // }
    };

    return (
        <Button
            style={styles.button}
            onPress={handleRegister}
            // disabled={!isChecked}
        >
            <Text style={styles.buttonText}>一键登录</Text>
        </Button>
    );
};

const OtherLogin = () => {
    const themes = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleOtherLogin = () => {
        navigation.navigate('VerificationLogin');
    };

    return (
        <TouchableOpacity
            style={styles.otherLoginContainer}
            onPress={handleOtherLogin}
        >
            <Text style={[
                styles.otherLoginText,
                { color: themes['color-primary-500'],
                }]}
            >
                登录其他账号
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginVertical: 90,
    },
    logo: {
        width: 120,
        height: 120,
    },
    phoneContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    phoneText: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    authText: {
        fontSize: 14,
        color: '#999',
    },
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
    button: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderWidth: 0,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    otherLoginContainer: {
        marginTop: 80,
    },
    otherLoginText: {
        fontSize: 16,
    },
});

export default OneTapLogin;
