import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from '@ui-kitten/components';
import { useMainStore } from '@/main/stores/main.store.ts';

export const ActionsSection = () => {
    const navigateRecycleBin = useMainStore(state => state.navigateRecycleBin);

    const menuItems = [
        {
            icon: 'grid-view',
            title: '笔记史',
            color: '#4285F4',
            onPress: () => {
                console.log('笔记');
            },
        },
        {
            icon: 'grid-on',
            title: '题目史',
            color: '#4285F4',
            onPress: () => {
                console.log('书签');
            },
        },
        {
            icon: 'delete',
            title: '回收站',
            color: '#4285F4',
            onPress: () => {
                navigateRecycleBin();
            },
        },
    ];

    return (
        <View style={styles.sectionContainer}>
            {/*<Text style={styles.sectionTitle}>功能</Text>*/}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {
                        item?.onPress?.();
                    }}>
                        <View style={[styles.iconContainer, {backgroundColor: item.color + '15'}]}>
                            <Icon name={item.icon} size={20} color={item.color} />
                        </View>
                        <Text style={styles.menuItemText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
                <View style={{ width: '30%' }} />
                <View style={{ width: '30%' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#787878',
        marginLeft: 15,
        marginBottom: 7,
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // 允许换行
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    menuItem: {
        width: '30%',
        height: 95,
        // aspectRatio: 1,
        // flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#1F2937',
        // fontWeight: '500',
    },
});

