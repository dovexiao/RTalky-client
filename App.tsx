/**
 * Sample React Native App
 * https://github.com/dovexiao/RTalky.git
 *
 * @format
 */

import React, {JSX, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeContext } from '@contexts/ThemeContext';
import { default as lightTheme } from './light-theme.json';
import { default as darkTheme } from './dark-theme.json';
import { AppNavigator } from '@navigation/AppNavigation.tsx';
import { GlobalProvider } from '@contexts/GlobalContext.tsx';
import BootSplash from 'react-native-bootsplash';
import { useNavigationStore } from '@/navigation/stores/navigationStore';
import { SessionService } from '@/auth/services';
import {useAuthStore} from "@/auth/stores";

type Theme = 'light' | 'dark';

function App(): JSX.Element {
    const [theme, setTheme] = React.useState<Theme>('light');
    const [customTheme, setCustomTheme] = React.useState(lightTheme);

    const setInitialRouteName = useNavigationStore(state => state.setInitialRouteName);
    const resetInitialRouteName = useNavigationStore(state => state.resetInitialRouteName);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const nextCustomTheme = theme === 'light' ? darkTheme : lightTheme;
        setTheme(nextTheme);
        // @ts-ignore
        setCustomTheme(nextCustomTheme);
    };

    useEffect(() => {
        const init = async () => {
            try {
                const response = await SessionService.validateSession();

                if (response.success) {
                    console.log('会话有效，设置初始路由为AppMain');
                    setInitialRouteName('AppMain');
                    const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
                    setIsLoggedIn(true);
                } else {
                    console.log('会话无效，设置初始路由为VerificationLogin');
                    setInitialRouteName('VerificationLogin');
                }
            } catch (error) {
                console.error('会话验证失败:', error);
                // 验证失败时，默认设置为登录页面
                resetInitialRouteName();
            }
        };

        init().finally(async () => {
            await BootSplash.hide({ fade: true });
            console.log('BootSplash has been hidden successfully');
        });
    }, []);

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ApplicationProvider {...eva} theme={{...eva[theme], ...customTheme}}>
                    <GlobalProvider>
                        <AppNavigator />
                    </GlobalProvider>
                </ApplicationProvider>
            </ThemeContext.Provider>
        </>

    );
}

export default App;
