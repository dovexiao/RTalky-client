import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import CountrySectionList, { CountrySectionListAPI } from './CountrySectionList';
import CountryLetterPopup, { CountryLetterPopupAPI } from './CountryLetterPopup';
import CountryAlphabetNavigator from './CountryAlphabetNavigator';
import { useCountryCodeSelectorStore } from '../stores/countryCodeSelectorStore.ts';

export const CountryCodeSelector = () => {
    const sectionListRef = useRef<CountrySectionListAPI>(null);
    const letterPopupRef = useRef<CountryLetterPopupAPI>(null);

    const onLetterPress = (letter: string) => {
        letterPopupRef.current?.show(letter);
        const sectionIndex = useCountryCodeSelectorStore.getState().sections.findIndex(s => s.title === letter);
        sectionListRef.current?.scrollToSection(sectionIndex);
    };

    return (
        <View style={styles.container}>
            <CountrySectionList ref={sectionListRef} />
            <CountryLetterPopup ref={letterPopupRef} />
            <CountryAlphabetNavigator onLetterPress={onLetterPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default CountryCodeSelector;
