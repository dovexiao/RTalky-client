import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import CountrySectionList, { CountrySectionListAPI } from './CountrySectionList';
import CountryLetterPopup, { CountryLetterPopupAPI } from './CountryLetterPopup';
import CountryAlphabetNavigator from './CountryAlphabetNavigator';

export const CountryCodeSelector = () => {
    const sectionListRef = useRef<CountrySectionListAPI>(null);
    const letterPopupRef = useRef<CountryLetterPopupAPI>(null);

    const onLetterPress = (letter: string) => {
        letterPopupRef.current?.show(letter);
        sectionListRef.current?.scrollToSection(letter);
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
