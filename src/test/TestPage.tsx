import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet, Platform, TextInput, View} from 'react-native';
import type { TextInputProps } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '@ui-kitten/components';
import CountryCodeSelector from "../auth/verificationLogin/components/CountryCodeSelector.tsx";

const styles = StyleSheet.create({
    root: {flex: 1, backgroundColor: '#FFF'},
    title: {textAlign: 'center', fontSize: 30, marginBottom: 20},
    codeFieldRoot: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: '#F7F7F7',
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#000',
    },
});

const autoComplete = Platform.select<TextInputProps['autoComplete']>({
    android: 'sms-otp',
    default: 'one-time-code',
});

const cellWidths = {
    4: 55,
    5: 55,
    6: 50,
    7: 45,
};

const cellHeights = {
    4: 55,
    5: 55,
    6: 50,
    7: 45,
};

const cellMargins = {
    4: 10,
    5: 7,
    6: 4,
    7: 2,
};

const TestPage = () => {
    const cellCount = 5;

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount}) as React.RefObject<TextInput>;
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const themes = useTheme();

    const cellWidth: number = cellWidths[cellCount];
    const cellHeight: number = cellHeights[cellCount];
    const cellMargin: number = cellMargins[cellCount];

    return (
        <SafeAreaView style={styles.root}>
            <CountryCodeSelector />
        </SafeAreaView>
    );
};

export default TestPage;
