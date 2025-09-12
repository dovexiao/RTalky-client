import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { LearnBoxProps } from '@/main/types';
import { useSpecialTheme } from '@contexts/SpecialThemeContext.tsx';

const LearnBox: React.FC<LearnBoxProps> = ( {learnBox, index }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { specialThemeColors } = useSpecialTheme();

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: specialThemeColors['bg-200'] },
            ]}
            key={learnBox.id || `module-${index}`}
            onPress={() => {
                navigation.navigate(learnBox.screen as never);
            }}
        >
            <View style={styles.cardContainer}>
                <View style={[
                    styles.icon,
                    { backgroundColor: specialThemeColors['primary-100'],
                }]}>
                    <Icon
                        name={learnBox.icon}
                        fill={specialThemeColors['primary-300']}
                        width={28} height={28}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={[
                            styles.title,
                            { color: specialThemeColors['text-100'] },
                        ]}>
                            {learnBox.title}
                        </Text>
                        <Text style={styles.time}>{learnBox.lastUpdated}</Text>
                    </View>
                    <Text style={[
                        styles.description,
                        { color: specialThemeColors['text-200'] },
                    ]}>
                        {learnBox.description}
                    </Text>
                    <View style={styles.moduleStats}>
                        <View style={[
                            styles.countBadge,
                            { backgroundColor: learnBox.countColor },
                        ]}>
                            <Text style={[
                                styles.countText,
                                { color: learnBox.countTextColor },
                            ]}>
                                {learnBox.count} notes
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    moduleStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 12,
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default LearnBox;
