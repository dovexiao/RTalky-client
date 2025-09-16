import React, { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Spinner } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';
import TopNavigationOpe from '@/main/components/TopNavigationOpe.tsx';
import { usePermission } from '@/hooks/usePermission';
import { openSettings, RESULTS } from 'react-native-permissions';
import { CheckmarkIcon, RefreshIcon } from '@/icon';
import { PermissionItem, PermissionStatusText } from '@/center/about/types';
import { permissionList as permissions } from '@/center/about/assets';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppPermissions: React.FC<{}> = () => {
    const { themeColors } = useUnifiedTheme();

    // 相机权限
    const cameraPermission = usePermission({
        permission: 'camera',
        rationale: {
            title: '开启相机权限',
            message: 'RTalky 需要相机权限用于拍摄照片更新用户头像',
            positiveButton: '去开启',
        },
        settings: {
            title: '权限被拒绝',
            message: '请在设置中允许相机权限，并重启应用以维持最佳体验',
            positiveButton: '去设置',
        },
    });

    // 媒体文件权限
    const photosPermission = usePermission({
        permission: 'photos',
        rationale: {
            title: '开启媒体文件权限',
            message: 'RTalky 需要访问媒体文件用于更新用户头像',
            positiveButton: '去开启',
        },
        settings: {
            title: '权限被拒绝',
            message: '请在设置中允许媒体文件权限，并重启应用以维持最佳体验',
            positiveButton: '去设置',
        },
    });

    // 请求权限并更新状态
    const handlePermissionRequest = async (permissionType: 'camera' | 'photos') => {
        try {
            const permission = permissionType === 'camera' ? cameraPermission : photosPermission;
            await permission.requestPermission();
            await permission.checkPermission();
        } catch (error) {
            console.error('权限请求失败:', error);
        }
    };

    // 刷新权限状态
    const refreshPermissionStatus = async (permissionType: 'camera' | 'photos') => {
        try {
            const permission = permissionType === 'camera' ? cameraPermission : photosPermission;
            await permission.checkPermission();
        } catch (error) {
            console.error('权限刷新失败:', error);
        }
    };

    // 打开系统设置
    const handleOpenSettings = async () => {
        try {
            await openSettings();
        } catch (error) {
            console.error('打开设置失败:', error);
        }
    };

    // 初始化权限状态
    useEffect(() => {
        cameraPermission.checkPermission();
        photosPermission.checkPermission();
    }, []);

    const renderPermissionItem = (item: PermissionItem) => {
        const permissionStatus = item.permissionType === 'camera' ? cameraPermission.status :
            item.permissionType === 'photos' ? photosPermission.status :
            item.permissionType === 'internet' ? 'default-granted' : RESULTS.UNAVAILABLE;
        const isGranted = permissionStatus === 'granted' || permissionStatus === 'default-granted';
        const isUnavailable = permissionStatus === 'unavailable';

        return (
            <Card
                key={item.id}
                style={[
                    styles.permissionCard,
                    { backgroundColor: themeColors['bg-200'] },
                ]}
            >
                <View style={styles.permissionItem}>
                    <View style={styles.permissionInfo}>
                        <View style={styles.permissionHeader}>
                            <Icon style={{ marginRight: 8 }}  name={item.icon} size={20} color={themeColors['primary-200']} />
                            <Text style={[styles.permissionTitle, { color: themeColors['text-100'] }]}>
                                {item.title}
                            </Text>
                            <View style={styles.statusContainer}>
                                {isGranted && (
                                    <CheckmarkIcon
                                        style={styles.checkmarkIcon}
                                        width={20}
                                        height={20}
                                        fill={themeColors['color-success-500'] || '#4CAF50'}
                                    />
                                )}
                                {!isUnavailable ? (
                                    <Text style={[
                                        styles.statusText,
                                        {
                                            color: isGranted
                                                ? (themeColors['color-success-500'] || '#4CAF50')
                                                : (themeColors['text-200'] || '#666'),
                                        },
                                    ]}>
                                        {PermissionStatusText[permissionStatus]}
                                    </Text>
                                ) : (
                                    <Spinner />
                                )}
                                {!isGranted && !isUnavailable && (
                                    <TouchableOpacity onPress={() => refreshPermissionStatus(item.permissionType as 'camera' | 'photos')}>
                                        <RefreshIcon
                                            style={styles.refreshIcon}
                                            width={20}
                                            height={20}
                                            fill={themeColors['color-success-500'] || '#4CAF50'}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <Text style={[styles.permissionDescription, { color: themeColors['text-200'] }]}>
                            {item.description}
                        </Text>
                        {!isGranted && (
                            <TouchableOpacity
                                style={[styles.requestButton, { backgroundColor: themeColors['primary-200'] }]}
                                onPress={() => handlePermissionRequest(item.permissionType as 'camera' | 'photos')}
                            >
                                <Text style={[styles.requestButtonText, { color: themeColors['text-100'] }]}>
                                    申请权限
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors['bg-100'] }]}>
            <View style={[
                styles.statusBar,
                { backgroundColor: themeColors['bg-100'] },
            ]} />
            <TopNavigationOpe
                title={'应用权限'}
            />
            <Divider />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.headerSection}>
                        <Text style={[styles.headerTitle, { color: themeColors['text-100'] }]}>
                            权限说明
                        </Text>
                        <Text style={[styles.headerDescription, { color: themeColors['text-200'] }]}>
                            RTalky 需要以下权限来提供完整的功能体验。您可以随时在系统设置中管理这些权限。
                        </Text>
                    </View>

                    <View style={styles.permissionsList}>
                        {permissions.map(renderPermissionItem)}
                    </View>

                    <View style={styles.footerSection}>
                        <Text style={[styles.footerText, { color: themeColors['text-100'] }]}>
                            如需修改权限设置，请前往
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.footerButton,
                                { backgroundColor: themeColors['primary-200'] },
                            ]}
                            onPress={handleOpenSettings}
                        >
                            <Text style={[
                                styles.footerIconButtonText,
                                { color: themeColors['text-100'] },
                            ]}>
                                设置 {'>'} 应用 {'>'} RTalky {'>'} 权限
                            </Text>
                        </TouchableOpacity>
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
        height: StatusBar.currentHeight,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    headerSection: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    headerDescription: {
        fontSize: 14,
        lineHeight: 24,
    },
    permissionsList: {
        marginBottom: 24,
    },
    permissionCard: {
        marginBottom: 12,
        borderRadius: 8,
    },
    permissionItem: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        // marginHorizontal: 4,
    },
    permissionDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    requestButton: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    requestButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        padding: 8,
    },
    footerIconButtonText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        textDecorationLine: 'none',
    },
    footerText: {
        fontSize: 12,
        // textAlign: 'center',
        lineHeight: 18,
        // textDecorationLine: 'underline',
        marginRight: 8,
    },
    checkmarkIcon: {
        marginRight: 2,
    },
    refreshIcon: {
        marginLeft: 4,
    },
});

export default AppPermissions;
