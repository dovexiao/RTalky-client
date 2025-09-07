import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@/auth/stores';
import RandomAvatar from '@/main/components/RandomAvatar.tsx';
import { useGlobal } from '@contexts/GlobalContext.tsx';

export const ProfileSection = () => {
    const avatar = useAuthStore(state => state.avatar);
    const { avatarActionsModalRef } = useGlobal();

    return (
        <View style={styles.profileSection}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => {
                    avatarActionsModalRef.current?.show();
                }}
            >
                {avatar ?
                    <Image
                        source={{
                            uri: avatar,
                        }}
                        style={styles.avatar}
                    /> :
                    <RandomAvatar size={100} />
                }
            </TouchableOpacity>
            <Text style={styles.name}>Dove xiao</Text>
            <Text style={styles.username}>Javascript 开发新人</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingBottom: 40,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
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
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#6B7280',
    },
});
