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
import { UnifiedThemeProvider, useUnifiedTheme } from '@contexts/UnifiedThemeContext';
import { AppNavigator } from '@navigation/AppNavigation.tsx';
import { GlobalProvider } from '@contexts/GlobalContext.tsx';
import Orientation from 'react-native-orientation-locker';

function App(): JSX.Element {
    useEffect(() => {
        // 锁定为竖屏方向
        Orientation.lockToPortrait();

        // 组件卸载时解除锁定（可选）
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <UnifiedThemeProvider>
                <AppContent />
            </UnifiedThemeProvider>
        </>
    );
}

// 分离的 App 内容组件
const AppContent: React.FC = () => {
    const { themeColors } = useUnifiedTheme();

    return (
        <ApplicationProvider {...eva} theme={themeColors}>
            <GlobalProvider>
                <AppNavigator />
            </GlobalProvider>
        </ApplicationProvider>
    );
};

export default App;
