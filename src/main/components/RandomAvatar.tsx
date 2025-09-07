import React, { useRef } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import {useAuthStore} from "@/auth/stores";

// 固定的颜色调色板 - 偏深但不太深，使用不太常用的颜色色谱
const AVATAR_COLORS = [
    '#8B5A8C', // 深紫色
    '#6B7C93', // 蓝灰色
    '#8B6F47', // 深棕色
    '#7A8471', // 橄榄绿
    '#8B6B8B', // 深紫罗兰
    '#6B8B8B', // 深青灰色
    '#8B7D6B', // 深米色
    '#7A6B8B', // 深蓝紫色
    '#8B8B6B', // 深黄绿色
    '#6B8B6B', // 深绿色
    '#8B6B6B', // 深灰褐色
    '#7A8B6B', // 深草绿色
    '#6B6B8B', // 深蓝灰色
    '#8B7A6B', // 深土黄色
    '#7A6B6B', // 深红褐色
] as const;

/**
 * 根据用户ID生成固定的颜色
 * 使用简单的哈希算法确保同一用户始终获得相同颜色
 */
function getAvatarColor(userId?: string): string {
    if (!userId) {
        // 如果没有userId，使用时间戳作为种子
        const timestamp = Date.now();
        const index = timestamp % AVATAR_COLORS.length;
        return AVATAR_COLORS[index];
    }

    // 简单的字符串哈希算法
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }

    // 确保索引为正数
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

type RandomAvatarProps = {
    size: number;
    text?: string; // 可选的显示文本，默认为"用户"
};

const RandomAvatar: React.FC<RandomAvatarProps> = ({
    size,
    text = '用户',
}) => {
    // 使用useRef确保颜色在组件生命周期内保持不变
    const userId = useAuthStore.getState().userId;
    const avatarColor = useRef(getAvatarColor(userId)).current;

    return (
        <View style={[
            styles.teamAvatar,
            {
                backgroundColor: avatarColor,
                width: size,
                height: size,
                borderRadius: Math.floor(size / 2),
            },
        ]}>
            <Text style={[styles.teamNumber, { fontSize: Math.floor(size / 2) }]}>
                {text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    teamAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamNumber: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default RandomAvatar;
