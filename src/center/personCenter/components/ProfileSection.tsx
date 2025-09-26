import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useAuthStore } from '@/auth/stores';
import { UserInfoService } from '@/auth/services';
import RandomAvatar from '@/main/components/RandomAvatar.tsx';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import { EditIcon, CameraIcon } from '@/icon';
import EditNicknameAction, { EditNicknameActionAPI } from './EditNicknameAction';
import EditBioAction, { EditBioActionAPI } from './EditBioAction';
import { useUnifiedTheme } from '@/contexts';
import type { AvatarActionsModalAPI } from '@/center/personCenter/components';
import { useReactiveToastStore } from '@global/reactiveToast/stores';

interface ProfileSectionProps {
    avatarActionsModalRef: React.RefObject<AvatarActionsModalAPI>;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ avatarActionsModalRef }) => {
    const nickname = useAuthStore(state => state.nickname);
    const avatar = useAuthStore(state => state.avatar);
    const bio = useAuthStore(state => state.bio);
    const { setNickname, setBio } = useAuthStore.getState();
    const { setMessageType, setMessageText } = useReactiveToastStore.getState();

    const { actionDialogRef } = useGlobal();
    const editNicknameActionRef = useRef<EditNicknameActionAPI>(null);
    const editBioActionRef = useRef<EditBioActionAPI>(null);

    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const isSmallScreen = screenWidth < 600; // Threshold for small screens (portrait phones)

    const { themeColors } = useUnifiedTheme();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const onChange = ({ window }: { window: { width: number, height: number } }) => {
            setScreenWidth(window.width);
        };

        const subscription = Dimensions.addEventListener('change', onChange);

        return () => {
            subscription?.remove(); // 使用返回的 remove 方法
        };
    }, []);

    const handleEditAvatar = () => {
        avatarActionsModalRef.current?.show();
    };

    // 编辑昵称
    const handleEditNickname = () => {
        actionDialogRef.current?.show({
            content: <EditNicknameAction ref={editNicknameActionRef} />,
            onConfirm: async () => {
                const newNickname = editNicknameActionRef.current?.getNickname();
                if (newNickname?.trim()) {
                    try {
                        // 更新服务器
                        await UserInfoService.updateUserInfo({
                            nickname: newNickname.trim(),
                        });
                        // 更新本地状态
                        setNickname(newNickname.trim());
                        setMessageType('success');
                        setMessageText('昵称更新成功');
                    } catch (error) {
                        console.log('更新昵称失败:', error);
                        setMessageType('danger');
                        setMessageText('昵称更新失败');
                        // 这里可以添加错误提示，比如 Toast
                    }
                }
            },
        });
    };

    // 编辑简介
    const handleEditBio = () => {
        actionDialogRef.current?.show({
            content: <EditBioAction ref={editBioActionRef} />,
            onConfirm: async () => {
                const newBio = editBioActionRef.current?.getBio();
                try {
                    // 更新服务器
                    await UserInfoService.updateUserInfo({
                        bio: newBio?.trim() || '',
                    });
                    // 更新本地状态
                    setBio(newBio?.trim() || '');
                    setMessageType('success');
                    setMessageText('简介更新成功');
                } catch (error) {
                    console.error('更新简介失败:', error);
                    setMessageType('danger');
                    setMessageText('简介更新失败');
                    // 这里可以添加错误提示，比如 Toast
                }
            },
        });
    };

    return (
        <View style={[
            styles.profileSection,
            { backgroundColor: themeColors['bg-200'] },
            isSmallScreen ? styles.profileSectionVertical : styles.profileSectionHorizontal,
        ]}>
            {isSmallScreen ? (
                // 小屏幕垂直布局 (参照第一张图片)
                <>
                    {/*头像区域 - 超出容器一点*/}
                    <View style={styles.avatarWrapperVertical}>
                        <View style={styles.avatarContainer}>
                            {avatar ?
                                <Image
                                    source={{ uri: `file://${avatar}` }}
                                    style={styles.avatar}
                                /> :
                                <RandomAvatar size={100} />
                            }
                        </View>
                        {/* 头像编辑图标 */}
                        <TouchableOpacity
                            style={styles.avatarEditButton}
                            onPress={handleEditAvatar}
                        >
                            <CameraIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>

                    {/* 用户信息区域 */}
                    <View style={styles.userInfoVertical}>
                        {/* 昵称和编辑图标 */}
                        <View style={styles.nameRowVertical}>
                            <Text
                                style={[
                                    styles.nameVertical,
                                    { color: themeColors['text-100'] },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {nickname || '暂无昵称'}
                            </Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditNickname}
                            >
                                <EditIcon width={24} height={24} />
                            </TouchableOpacity>
                        </View>

                        {/* 简介和编辑图标 */}
                        <View style={styles.bioRowVertical}>
                            <Text
                                style={[
                                    styles.bioVertical,
                                    { color: themeColors['text-200'] },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {bio || '这个很懒，还没有留下简介'}
                            </Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditBio}
                            >
                                <EditIcon width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            ) : (
                // 大屏幕水平布局 (参照第二张图片)
                <>
                    {/* 头像区域 */}
                    <View style={styles.avatarWrapperHorizontal}>
                        <View style={styles.avatarContainer}>
                            {avatar ?
                                <Image
                                    source={{ uri: `file://${avatar}` }}
                                    style={styles.avatar}
                                /> :
                                <RandomAvatar size={100} />
                            }
                        </View>
                        {/* 头像编辑图标 */}
                        <TouchableOpacity
                            style={styles.avatarEditButton}
                            onPress={() => {
                                avatarActionsModalRef.current?.show();
                            }}
                        >
                            <CameraIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>

                    {/* 用户信息区域 */}
                    <View style={styles.userInfoHorizontal}>
                        {/* 昵称和编辑图标 */}
                        <View style={styles.nameRowHorizontal}>
                            <Text
                                style={[
                                    styles.nameHorizontal,
                                    { color: themeColors['text-100'] },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                            >
                                {nickname || '暂无昵称'}
                            </Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditNickname}
                            >
                                <EditIcon width={24} height={24} />
                            </TouchableOpacity>
                        </View>

                        {/* 简介和编辑图标 */}
                        <View style={styles.bioRowHorizontal}>
                            <Text
                                style={[
                                    styles.bioHorizontal,
                                    { color: themeColors['text-200'] },
                                ]}
                                numberOfLines={2}
                                ellipsizeMode={'tail'}
                            >
                                {bio || '这个很懒，还没有留下简介'}
                            </Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditBio}
                            >
                                <EditIcon width={20} height={20} fill={'#FFFFFF'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // 基础容器样式
    profileSection: {
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 80,
        marginBottom: 30,
        paddingHorizontal: 30,
        paddingVertical: 20,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 4,
    },

    // 小屏幕垂直布局样式
    profileSectionVertical: {
        alignItems: 'flex-start',
        paddingTop: 80,
        paddingBottom: 30,
    },
    avatarWrapperVertical: {
        position: 'absolute',
        top: -30,
        left: 20,
        zIndex: 1,
    },
    userInfoVertical: {
        alignItems: 'flex-start',
        marginTop: 20,
    },
    nameRowVertical: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameVertical: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginRight: 8,
    },
    bioRowVertical: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bioVertical: {
        fontSize: 16,
        lineHeight: 28,
        textAlign: 'left',
        marginRight: 8,
    },

    // 大屏幕水平布局样式
    profileSectionHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatarWrapperHorizontal: {
        position: 'relative',
        marginRight: 40,
    },
    userInfoHorizontal: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRowHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameHorizontal: {
        fontSize: 24,
        fontWeight: '700',
        marginRight: 8,
    },
    bioRowHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bioHorizontal: {
        fontSize: 16,
        lineHeight: 28,
        textAlign: 'left',
        marginRight: 8,
    },

    // 通用头像样式
    avatarContainer: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    // 头像编辑按钮
    avatarEditButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },

    // 编辑按钮
    editButton: {
        // padding: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
});
