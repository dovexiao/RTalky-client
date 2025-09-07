import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@/auth/stores';
import { UserInfoService } from '@/auth/services';
import RandomAvatar from '@/main/components/RandomAvatar.tsx';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import { EditIcon, CameraIcon } from '@/icon';
import EditNicknameAction, { EditNicknameActionAPI } from './EditNicknameAction';
import EditBioAction, { EditBioActionAPI } from './EditBioAction';

export const ProfileSection = () => {
    const nickname = useAuthStore(state => state.nickname);
    const avatar = useAuthStore(state => state.avatar);
    const bio = useAuthStore(state => state.bio);
    const { setNickname, setBio } = useAuthStore.getState();

    const { avatarActionsModalRef, actionDialogRef } = useGlobal();
    const editNicknameActionRef = useRef<EditNicknameActionAPI>(null);
    const editBioActionRef = useRef<EditBioActionAPI>(null);

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
                    } catch (error) {
                        console.error('更新昵称失败:', error);
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
                } catch (error) {
                    console.error('更新简介失败:', error);
                    // 这里可以添加错误提示，比如 Toast
                }
            },
        });
    };

    return (
        <View style={styles.profileSection}>
            {/* 头像区域 */}
            <View style={styles.avatarWrapper}>
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

            {/* 昵称和编辑图标 */}
            <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>
                    {nickname || '暂无昵称'}
                </Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditNickname}
                >
                    <EditIcon width={28} height={28} />
                </TouchableOpacity>
            </View>

            {/* 简介和编辑图标 */}
            <View style={styles.bioRow}>
                <Text style={styles.bio} numberOfLines={2} ellipsizeMode={'tail'}>
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
    );
};

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        paddingVertical: 70,
        paddingBottom: 30,
    },
    // 头像包装器
    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
        // borderWidth: 2,
        // borderColor: '#F3F4F6',
    },
    // 昵称行
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        maxWidth: '80%',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 32,
        textAlign: 'center',
    },
    // 简介行
    bioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '80%',
    },
    bio: {
        fontSize: 16,
        color: '#6B7280',
        marginLeft: 24,
        textAlign: 'left',
    },
    // 编辑按钮
    editButton: {
        padding: 4,
        borderRadius: 4,
        backgroundColor: 'transparent',
        // borderWidth: 1,
        // borderColor: '#E5E7EB',
    },
});
