import React from 'react';
import { Icon, TopNavigation, TopNavigationAction, Text, useTheme } from '@ui-kitten/components';
import type { IconElement } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';

interface TopNavigationOpeProps {
    title?: string;
    renderItemAccessory?: () => React.ReactElement;
    onBackPress?: () => void;
}

const BackIcon = (props: any): IconElement => (
    <Icon
        {...props.props}
        name="arrow-back"
        fill={props.tintColor}
    />
);

const TopNavigationOpe: React.FC<TopNavigationOpeProps> = ({ title, renderItemAccessory, onBackPress }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const themes = useTheme();

    const handleGoBack = () => {
        if (onBackPress) {
            // 如果提供了自定义回退逻辑，则使用自定义逻辑
            onBackPress();
        } else {
            // 否则使用默认回退逻辑
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        }
    };

    const renderBackAction = (): React.ReactElement => (
        <TopNavigationAction
            icon={(props) => BackIcon({props, tintColor: themes['color-primary-500']})}
            onPress={handleGoBack}
        />
    );

    const renderTitleAction = (): React.ReactElement => (
        <View style={styles.titleContainer}>
            <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode={'tail'}
            >{title}</Text>
        </View>
    );

    return (
        <TopNavigation
            title={renderTitleAction}
            alignment="center"
            accessoryLeft={renderBackAction}
            accessoryRight={renderItemAccessory}
        />
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        width: '65%',
        alignItems: 'center',
        marginVertical: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TopNavigationOpe;
