import React, {useMemo} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {
    VerificationCodeSection,
} from '../components';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { Divider, Text } from '@ui-kitten/components';
import { useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { VerificationCodeProps } from '@/auth/verificationLogin/types';

const VerificationCode: React.FC<VerificationCodeProps> = ({ navigation }) => {
    const { formattedNumber: internationalFormattedPhone } = useVerificationLoginStore.getState();

    const StatusBarHeight = useMemo(() => {
        // console.log('StatusBar.currentHeight', StatusBar.currentHeight);
        return StatusBar.currentHeight || 36;
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={'rgba(255,255,255,0)'} translucent={true} />
            <View style={{ height: StatusBarHeight, backgroundColor: '#FFFFFF'}} />
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
                {/*<View style={styles.helperContainer}>*/}
                {/*    <TouchableOpacity onPress={() => {*/}
                {/*        bottomActionSheetRef.current?.show(*/}
                {/*            <NoVerificationCodeHelper />*/}
                {/*        );*/}
                {/*    }}>*/}
                {/*        <Text style={styles.helperText}>收不到验证码？</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*    <ResendTimer initialCount={300} />*/}
                {/*</View>*/}
            </View>
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
