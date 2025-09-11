import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuItem } from '@/center/personCenter/types';

// 容器属性
export interface SectionContainerProps {
    title?: string;
    items: MenuItem[];
}

// 主容器组件
export const SectionContainer: React.FC<SectionContainerProps> = ({
    title,
    items,
}) => {
    return (
        <View style={[styles.sectionContainer]}>
            {/* 区域标题 */}
            {title && (
                <Text style={[styles.sectionTitle]}>
                    {title}
                </Text>
            )}

            {/* 区域内容 */}
            <View style={styles.menuContainer}>
                {items.map((item, index) => (
                    <MenuItemComponent
                        key={item.id || index}
                        item={item}
                    />
                ))}
            </View>
        </View>
    );
};

// 菜单项组件
const MenuItemComponent: React.FC<{
    item: MenuItem;
}> = ({ item }) => {

    const handlePress = () => {
        if (item.disabled) {
            return;
        }
        if (item.onPress) {
            item.onPress();
        }
    };

    // 列表布局添加分割线
    return (
        <TouchableOpacity
            style={[
                styles.menuItem,
                // item.disabled && styles.disabledItem,
            ]}
            onPress={handlePress}
            // disabled={item.disabled}
            // activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                    <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <View style={styles.menuItemRight}>
                <Text style={styles.menuItemSubText}>{item.subtitle}</Text>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#787878',
        marginLeft: 15,
        marginBottom: 7,
    },
    menuContainer: {
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        // backgroundColor: '#FFFFFF',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#1F2937',
    },
    menuItemSubText: {
        fontSize: 16,
        color: '#787878',
    },
    disabledItem: {
        opacity: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: 68, // 图标宽度 + 间距
    },
});

export default SectionContainer;

