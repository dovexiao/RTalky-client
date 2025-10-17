import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
    View,
    Text,
    // TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    Keyboard,
} from 'react-native';
// import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
// import { Divider } from '@ui-kitten/components';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { VerificationLoginProps } from '@/auth/verificationLogin/types';
import PhoneInput from '../components/PhoneInput';
import VerifyLoginButton from '../components/VerifyLoginButton';
import AgreementCheckbox from '../components/AgreementCheckbox';
import { CountryCodeDialog, CountryCodeDialogAPI } from '@/auth/verificationLogin/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';

const VerificationLogin: React.FC<VerificationLoginProps> = ({ navigation }) => {
    const countryCodeDialogRef = useRef<CountryCodeDialogAPI>(null);

    // 密码登录跳转逻辑
    // const handlePasswordLogin = useCallback(() => {
    //     navigation.navigate('PasswordLogin');
    // }, [navigation]);

    // 显示国家区号选择弹窗
    const handleCountryCodePress = useCallback(() => {
        Keyboard.dismiss();
        countryCodeDialogRef.current?.show();
    }, [countryCodeDialogRef]);

    const headerContent = (
        <View style={styles.logoContainer}>
            <Image
                source={require('@assets/images/logo_ss.png')}
                style={styles.logo}
            />
        </View>
    );

    // const headerContent = useMemo(() => {
    //     return initialRouteName === 'VerificationLogin' ? (
    //         <View style={styles.logoContainer}>
    //             <Image
    //                 source={require('@assets/images/logo_ss.png')}
    //                 style={styles.logo}
    //             />
    //         </View>
    //     ) : (
    //         <>
    //             <TopNavigationOpe />
    //             <Divider />
    //         </>
    //     );
    // }, [initialRouteName]);

    useEffect(() => {
        const { setHideCountryCodeDialogFn } = useVerificationLoginStore.getState();
        setHideCountryCodeDialogFn(() => {
            countryCodeDialogRef.current?.hide();
        });
    }, [countryCodeDialogRef.current]);

    const StatusBarHeight = useMemo(() => {
        // console.log('StatusBar.currentHeight', StatusBar.currentHeight);
        return StatusBar.currentHeight || 36;
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={'rgba(255,255,255,0)'} translucent={true} />
            <View style={{ height: StatusBarHeight, backgroundColor: '#FFFFFF'}} />

            {/* 根据路由条件渲染顶部导航或Logo */}
            {headerContent}

            <View style={styles.container}>
                {/* 标题与说明 */}
                <Text style={styles.title}>RTalky 验证登录</Text>
                <Text style={styles.desc}>未注册的手机号验证通过后将自动注册</Text>

                {/* 手机号输入 */}
                <PhoneInput onCountryCodePress={handleCountryCodePress} />

                {/* 密码登录跳转 */}
                {/*<TouchableOpacity style={styles.passwordLoginContainer} onPress={handlePasswordLogin}>*/}
                {/*    <Icon name={'sync-alt'} size={15} color={'#4285F4'} />*/}
                {/*    <Text style={styles.passwordLoginText}>密码登录</Text>*/}
                {/*</TouchableOpacity>*/}

                {/* 验证并登录按钮 */}
                <VerifyLoginButton />

                {/* 协议勾选 */}
                <AgreementCheckbox />
            </View>
            <CountryCodeDialog ref={countryCodeDialogRef} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    logo: {
        width: 120,
        height: 120,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    desc: {
        fontSize: 14,
        color: '#999',
        marginBottom: 25,
    },
    passwordLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    passwordLoginText: {
        fontSize: 14,
        color: '#4285F4',
        marginLeft: 3,
    },
});

export default VerificationLogin;
