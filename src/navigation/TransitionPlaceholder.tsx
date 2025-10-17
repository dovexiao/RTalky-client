import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export const TransitionPlaceholder = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={true}
                color="#FF983F"
                size="large"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
