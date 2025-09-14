import React, { useCallback } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import {
    Text,
    TopNavigation,
} from '@ui-kitten/components';
import RandomAvatar from './RandomAvatar.tsx';
import { useAuthStore } from '@/auth/stores';

interface TopAvatarColumnProps {
    onAvatarPress: () => void;
}

export const TopAvatarColumn: React.FC<TopAvatarColumnProps> = ({ onAvatarPress }) => {
    // const themes = useTheme();

    // const systemNotificationsUnRead: number = 1;

    // const renderNotification = () : React.ReactElement => (
    //     <TouchableOpacity style={styles.notificationContainer} onPress={() => navigation.navigate('SystemNotification')}>
    //         <Icon name={'bell-outline'} width={33} height={33} fill={themes['color-primary-500']} />
    //         {systemNotificationsUnRead !== 0 && <View style={styles.notificationBadge}>
    //             {/*<Text style={styles.notificationCount}>*/}
    //             {/*    {systemNotificationsUnRead > 99 ? '99+' : systemNotificationsUnRead}*/}
    //             {/*</Text>*/}
    //         </View>}
    //     </TouchableOpacity>
    // )

    const renderTitleAction = (): React.ReactElement => (
        <View style={styles.titleContainer}>
            <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode={'tail'}
            >
                {'工作台'}
            </Text>
        </View>
    );

    const renderAccessoryLeft = useCallback(() => (
        <RenderAvatar onAvatarPress={onAvatarPress} />
    ), [onAvatarPress]);

    return (
        <TopNavigation
            title={renderTitleAction}
            alignment="center"
            accessoryLeft={renderAccessoryLeft}
            // accessoryRight={renderNotification}
        />
    );
};

const RenderAvatar: React.FC<{
    onAvatarPress: () => void;
}> = ({ onAvatarPress }) => {
    const avatar = useAuthStore(state => state.avatar);

    return (
        <View style={[
            styles.container,
        ]}>
            <Pressable onPress={onAvatarPress}>
                {avatar ?
                    <Image
                        source={{ uri: `file://${avatar}` }}
                        style={styles.avatar}
                    /> :
                    <RandomAvatar size={60} />
                }
            </Pressable>
            {/*<View style={styles.userInfo}>*/}
            {/*    <Text style={styles.name}>{'xxx'}</Text>*/}
            {/*    <Text style={styles.title}>{'xxx-xxx-xxx'}</Text>*/}
            {/*</View>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },
    titleContainer: {
        width: '65%',
        alignItems: 'center',
        marginVertical: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30, // Makes the image circular
    },
    userInfo: {
        flex: 1, // Takes available space
        justifyContent: 'center',
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333333', // Darker color for name
        marginBottom: 2,
    },
    title: {
        fontSize: 14,
        color: '#757575', // Grey color for title
    },
    notificationContainer: {
        position: 'relative', // For positioning the badge
        marginLeft: 10, // Space from user info
        padding: 5, // Optional: for easier touch if it were a button
    },
    notificationBadge: {
        position: 'absolute',
        top: 3,
        right: 8,
        backgroundColor: '#f44e4b',
        borderRadius: 12, // Make it circular
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1, // Optional: white border around badge
        borderColor: '#FFFFFF', // Optional: white border around badge
    },
    notificationCount: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
