import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@ui-kitten/components';
import { useCountryCodeSelectorStore, useVerificationLoginStore } from '@/auth/verificationLogin/stores';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

interface CountryAlphabetNavigatorProps {
    onLetterPress?: (letter: string) => void;
}

const CountryAlphabetNavigator: React.FC<CountryAlphabetNavigatorProps> = ({ onLetterPress }) => {
    const themes = useTheme();
    const sectionIndexMap = useCountryCodeSelectorStore(state => state.sectionIndexMap);
    const activeLetter = useCountryCodeSelectorStore(state => state.activeLetter);
    const selectedLetter = useVerificationLoginStore(state => state.selectedSectionLetter);

    const handleLetterPress = (letter: string) => {
        // 如果有数据才触发点击事件
        const hasData = sectionIndexMap[letter] !== undefined;
        if (hasData && onLetterPress) {
            onLetterPress(letter);
        }
    };

    return (
        <View style={[
            styles.alphabetContainer,
            { transform: [{ translateY: '-50%' }] },
        ]}>
            {ALPHABET.map(letter => {
                const isActive = letter === activeLetter;
                const isSelected = letter === selectedLetter;
                const hasData = sectionIndexMap[letter] !== undefined;

                return (
                    <TouchableOpacity
                        key={letter}
                        onPress={() => handleLetterPress(letter)}
                        disabled={!hasData}
                        style={styles.letterButton}
                    >
                        <Text style={[
                            styles.letterText,
                            isSelected && [styles.activeLetter, { color: themes['color-primary-300'] }],
                            isActive && [styles.activeLetter, { color: themes['color-primary-500'] }],
                            !hasData && styles.disabledLetter,
                        ]}>
                            {letter}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    alphabetContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 15,
    },
    letterButton: {
        paddingVertical: 1,
        paddingHorizontal: 5,
    },
    letterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
    },
    activeLetter: {
        fontSize: 18,
    },
    disabledLetter: {
        color: '#ddd',
    },
});

export default CountryAlphabetNavigator;
