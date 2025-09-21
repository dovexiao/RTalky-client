import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Linking, Alert, Image } from 'react-native';
import { Divider, Text, Button, Card } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';
import TopNavigationOpe from '@/main/components/TopNavigationOpe';
import { GithubIcon } from '@/icon';

const AboutRTalky: React.FC = () => {
    const { themeColors } = useUnifiedTheme();

    const handleOpenGithub = async () => {
        try {
            await Linking.openURL('https://github.com/dovexiao/RTalky-client/tree/dev');
        } catch (error) {
            Alert.alert('错误', '无法打开GitHub页面');
        }
    };

    const handleOpenEmail = async () => {
        try {
            await Linking.openURL('mailto:dovexiao728@gmail.com');
        } catch (error) {
            Alert.alert('错误', '无法打开邮件应用');
        }
    };

    const StatusBarHeight = useMemo(() => {
        console.log('StatusBar.currentHeight', StatusBar.currentHeight);
        return StatusBar.currentHeight || 36;
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: themeColors['bg-100'] }]}>
            <View style={{
                height: StatusBarHeight,
                backgroundColor: themeColors['bg-100'],
            }} />
            <TopNavigationOpe title={'关于RTalky'} />
            <Divider />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* 应用Logo和基本信息 */}
                    <Card style={[styles.logoCard, { backgroundColor: themeColors['bg-200'] }]}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('@assets/images/logo_ss.png')}
                                style={[
                                    styles.logo,
                                    { borderColor: themeColors['primary-200'] },
                                ]}
                            />
                            <Text style={[styles.appName, { color: themeColors['text-100'] }]}>RTalky</Text>
                            <Text style={[styles.version, { color: themeColors['text-200'] }]}>版本 0.0.1</Text>
                        </View>
                    </Card>

                    {/* 应用描述 */}
                    <Card style={[styles.descriptionCard, { backgroundColor: themeColors['bg-200'] }]}>
                        <Text style={[styles.descriptionTitle, { color: themeColors['text-100'] }]}>
                            应用介绍
                        </Text>
                        <Text style={[styles.descriptionText, { color: themeColors['text-200'] }]}>
                            RTalky 是一款开源的笔记记录、同步与管理移动应用程序。您可以使用本应用创建、编辑、存储和同步您的文本、图片等笔记内容，让您的想法和灵感得到更好的记录和管理。
                        </Text>
                    </Card>

                    {/* 开发者信息 */}
                    <Card style={[styles.developerCard, { backgroundColor: themeColors['bg-200'] }]}>
                        <Text style={[styles.sectionTitle, { color: themeColors['text-100'] }]}>
                            开发者信息
                        </Text>
                        <View style={styles.developerInfo}>
                            <Text style={[styles.developerLabel, { color: themeColors['text-200'] }]}>开发：</Text>
                            <Text style={[styles.developerValue, { color: themeColors['text-100'] }]}>肖嘉峰</Text>
                        </View>
                        <View style={styles.developerInfo}>
                            <Text style={[styles.developerLabel, { color: themeColors['text-200'] }]}>邮箱：</Text>
                            <Text style={[styles.developerValue, { color: themeColors['primary-100'] }]}>dovexiao728@gmail.com</Text>
                        </View>
                    </Card>

                    {/* 版权信息 */}
                    <Card style={[styles.copyrightCard, { backgroundColor: themeColors['bg-200'] }]}>
                        <Text style={[styles.copyrightText, { color: themeColors['text-200'] }]}>
                            © 2025 肖嘉峰. 保留所有权利。
                        </Text>
                        <Text style={[styles.copyrightText, { color: themeColors['text-200'] }]}>
                            本应用为开源软件，遵循 Apache 2.0 许可证。
                        </Text>
                    </Card>

                    {/* 操作按钮 */}
                    <View style={styles.buttonContainer}>
                        <Button
                            style={[styles.button, { backgroundColor: themeColors['primary-100'] }]}
                            onPress={handleOpenGithub}
                            accessoryLeft={GithubIcon}
                        >
                            <Text style={[styles.buttonText, { color: themeColors['text-100'] }]}>
                                查看源码
                            </Text>
                        </Button>

                        <Button
                            style={[styles.button, styles.secondaryButton, { borderColor: themeColors['primary-300'] }]}
                            onPress={handleOpenEmail}
                        >
                            <Text style={[styles.buttonText, { color: themeColors['text-100'] }]}>
                                联系开发者
                            </Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: StatusBar.currentHeight || 0,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    logoCard: {
        marginBottom: 16,
        padding: 24,
        alignItems: 'center',
        borderRadius: 16,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 8,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    version: {
        fontSize: 16,
    },
    descriptionCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    developerCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    developerInfo: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    developerLabel: {
        fontSize: 16,
        width: 55,
    },
    developerValue: {
        fontSize: 16,
        flex: 1,
    },
    copyrightCard: {
        marginBottom: 16,
        padding: 16,
        alignItems: 'center',
        borderRadius: 16,
    },
    copyrightText: {
        fontSize: 14,
        lineHeight: 26,
        textAlign: 'center',
        // marginBottom: 4,
    },
    buttonContainer: {
        gap: 14,
    },
    button: {
        borderRadius: 8,
        marginBottom: 4,
    },
    secondaryButton: {
        marginTop: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AboutRTalky;
