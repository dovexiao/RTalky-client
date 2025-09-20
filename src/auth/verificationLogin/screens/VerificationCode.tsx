import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {
    VerificationCodeSection,
    NoVerificationCodeHelper,
    ResendTimer,
    ReactiveToast,
} from '@/auth/verificationLogin/components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { Divider, Spinner, Text } from '@ui-kitten/components';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { VerificationCodeProps } from '@/auth/verificationLogin/types';
import { useUnifiedTheme } from '@/contexts';

const VerificationCode: React.FC<VerificationCodeProps> = ({ navigation }) => {
    const { formattedNumber: internationalFormattedPhone } = useVerificationLoginStore.getState();

    const { bottomActionSheetRef } = useGlobal();

    const messageType = useVerificationLoginStore(state => state.codeMessageType);
    const messageText = useVerificationLoginStore(state => state.codeMessageText);

    const { themeColors } = useUnifiedTheme();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={'rgba(255,255,255,0)'} translucent={true} />
            <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF'}} />
            {/* 顶部返回与帮助 */}
            <TopNavigationOpe
                // onBackPress={() => {
                //     navigation.goBack();
                // }}
            />
            <Divider />
            <View style={styles.container}>
                {/* 标题与手机号提示 */}
                <Text style={styles.title}>请输入验证码</Text>
                <Text style={styles.phoneTip}>
                    短信已发送至 <Text style={styles.phoneTipHighlight}>{internationalFormattedPhone}</Text>
                </Text>

                {/* 验证码输入框 */}
                <VerificationCodeSection />

                {/* 辅助操作 */}
                <View style={styles.helperContainer}>
                    <TouchableOpacity onPress={() => {
                        bottomActionSheetRef.current?.show(
                            <NoVerificationCodeHelper />
                        );
                    }}>
                        <Text style={styles.helperText}>收不到验证码？</Text>
                    </TouchableOpacity>
                    <ResendTimer initialCount={300} />
                </View>
            </View>
            <ReactiveToast
                dependencies={{ messageType, messageText }}
                shouldShow={({ messageType: type, messageText: text  }) => type !== 'none' && text !== ''}
                autoClose={({ messageType: type }) => type === 'loading' ? false : 3000}
                position={({ messageType: type }) => type === 'loading' ? 'center' : 'bottom'}
                render={({ messageType: type, messageText: text }) => {
                    return (
                        <>
                            {type === 'loading' ? (
                                <View style={{
                                    backgroundColor: themeColors['color-primary-500'],
                                    width: 120,
                                    // borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    aspectRatio: 1,
                                    gap: 10,
                                }}>
                                    <Spinner size={'large'} status={'control'} />
                                    <Text style={{ color: themeColors['bg-100'] }}>{text}</Text>
                                </View>
                            ) : (
                                <View style={{
                                    backgroundColor: themeColors[`color-${type}-500`] || 'transparent',
                                    padding: 15,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white'}}>{text}</Text>
                                </View>
                            )}
                        </>
                    )
                }}
                onHide={() => {
                    const { setCodeMessageType, setCodeMessageText } = useVerificationLoginStore.getState();
                    setCodeMessageType('none');
                    setCodeMessageText( '');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        // paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginHorizontal: 20,
    },
    phoneTip: {
        fontSize: 14,
        color: '#999',
        marginBottom: 25,
        marginHorizontal: 20,
    },
    phoneTipHighlight: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 16,
    },
    helperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    helperText: {
        fontSize: 14,
        color: '#007AFF',
    },
});

export default VerificationCode;
