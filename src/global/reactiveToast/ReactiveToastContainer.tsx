import ReactiveToast from './ReactiveToast';
import {useReactiveToastStore} from '@global/reactiveToast/stores/reactiveToastStore.ts';
import {Text, View} from 'react-native';
import {Spinner} from '@ui-kitten/components';
import React from 'react';
import { useUnifiedTheme } from '@/contexts';

const ReactiveToastContainer = () => {
    const messageType = useReactiveToastStore((state) => state.messageType);
    const messageText = useReactiveToastStore((state) => state.messageText);
    const isActive = useReactiveToastStore((state) => state.isActive);

    const { themeColors } = useUnifiedTheme();

    return (
        <>
            <ReactiveToast
                dependencies={{ messageType, messageText }}
                shouldShow={({ messageType: type, messageText: text  }) => type !== 'none' && text !== '' && isActive }
                autoClose={({ messageType: type }) => {
                    switch (type) {
                        case 'loading':
                            return false;
                        case 'offline':
                            return false;
                        case 'tilt':
                            return 3000;
                        default:
                            return 1500;
                    }
                }}
                position={({ messageType: type }) => {
                    switch (type) {
                        case 'loading':
                            return 'center';
                        case 'offline':
                        case 'online':
                        case 'tilt':
                            return 'top';
                        default:
                            return 'bottom';
                    }
                }}
                render={({ messageType: type, messageText: text }) => {
                    return (
                        <>
                            {type === 'loading' ? (
                                <View style={{
                                    backgroundColor: themeColors['color-primary-500'],
                                    width: 120,
                                    // borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    aspectRatio: 1,
                                    gap: 10,
                                }}>
                                    <Spinner size={'large'} status={'control'} />
                                    <Text style={{ color: themeColors['bg-100'], lineHeight: 20 }}>{text}</Text>
                                </View>
                            ) : type === 'offline' || type === 'online' ? (
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: themeColors[`color-${type === 'online' ? 'success' : 'warning'}-500`] || 'transparent',
                                    padding: 15,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 10,
                                }}>
                                    {type === 'offline' && <Spinner size={'large'} status={'control'}/>}
                                    <Text style={{color: 'white', lineHeight: 20}}>{text}</Text>
                                </View>
                            ) : type === 'tilt' ? (
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: themeColors['color-success-500'] || 'transparent',
                                    padding: 15,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 10,
                                }}>
                                    {type === 'offline' && <Spinner size={'large'} status={'control'}/>}
                                    <Text style={{color: 'white', lineHeight: 20}}>{text}</Text>
                                </View>
                            ) : (
                                <View style={{
                                    backgroundColor: themeColors[`color-${type}-500`] || 'transparent',
                                    padding: 15,
                                    borderRadius: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{color: 'white'}}>{text}</Text>
                                </View>
                            )}
                        </>
                    );
                }}
                onHide={() => {
                    const { setMessageType, setMessageText } = useReactiveToastStore.getState();
                    setMessageType('none');
                    setMessageText( '');
                }}
            />
        </>
    )
};

export default ReactiveToastContainer;
