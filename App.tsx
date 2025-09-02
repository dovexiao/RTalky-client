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

type Theme = 'light' | 'dark';

function App(): JSX.Element {
    const [theme, setTheme] = React.useState<Theme>('light');
    const [customTheme, setCustomTheme] = React.useState(lightTheme);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const nextCustomTheme = theme === 'light' ? darkTheme : lightTheme;
        setTheme(nextTheme);
        // @ts-ignore
        setCustomTheme(nextCustomTheme);
    };

    useEffect(() => {
        const init = async () => {
            // …do multiple sync or async tasks
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
