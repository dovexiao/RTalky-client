import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@ui-kitten/components';

interface FilterDisplayControllerProps {
    FilterContent: React.ComponentType;
    MainContent: React.ComponentType;
    renderHeader?: (toggleFilter: () => void, isFilterVisible: boolean) => React.ReactNode;
    gradientColors?: string[];
    containerStyle?: any;
}

export const FilterDisplayController: React.FC<FilterDisplayControllerProps> = ({
    FilterContent,
    MainContent,
    renderHeader,
    gradientColors = ['#6BCF7F', '#42A5F5'],
    containerStyle,
}: FilterDisplayControllerProps): React.ReactElement => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    // 默认头部渲染
    const defaultRenderHeader = () => (
        <View style={styles.header}>
            <View style={styles.statsContainer}>
                <Pressable
                    style={styles.statsButton}
                    onPress={toggleFilter}
                >
                    <Icon
                        name="settings-outline"
                        fill="#FFFFFF"
                        width={20}
                        height={20}
                    />
                    <Text style={styles.statsText}>
                        {isFilterVisible ? '确定' : '筛选'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={gradientColors}
            style={[styles.container, containerStyle]}
        >
            {/* 头部区域 */}
            {renderHeader ? renderHeader(toggleFilter, isFilterVisible) : defaultRenderHeader()}

            {/* 筛选区域 */}
            {isFilterVisible && (
                <View style={styles.filterContentContainer}>
                    <FilterContent />
                </View>
            )}

            {/* 主内容区域 */}
            <View style={[styles.mainContentContainer, { display: !isFilterVisible ? 'flex' : 'none' }]}>
                <MainContent />
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statsText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    filterContentContainer: {
        flex: 1,
        // backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    mainContentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
});
