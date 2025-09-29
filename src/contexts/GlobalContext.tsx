import React, {useCallback, useRef} from 'react';
import {
    BottomActionSheet,
    ActionDialog,
    Toast,
} from '@/global';
import type {
    BottomActionSheetAPI,
    ActionDialogAPI,
    ToastAPI,
} from '@/global';
import {useNavigationStore} from "@navigation/stores";

interface GlobalContextType {
    bottomActionSheetRef: React.RefObject<BottomActionSheetAPI>
    actionDialogRef: React.RefObject<ActionDialogAPI>
    toastShow: ToastAPI['show'];
    toastClean: ToastAPI['hideAll'];
}

const GlobalContext = React.createContext<GlobalContextType | null>(null);

export const GlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const bottomActionSheetRef = useRef<BottomActionSheetAPI>(null);
    const actionDialogRef = useRef<ActionDialogAPI>(null);
    const toastRef = useRef<ToastAPI>(null);

    const isActive = useNavigationStore((state) => state.isActive);

    // 使用 useCallback 动态包装方法调用
    const toastShow = useCallback<NonNullable<GlobalContextType['toastShow']>>((content?, options?) => {
        return toastRef.current?.show?.(content, options);
    }, []);

    const toastClean = useCallback<NonNullable<GlobalContextType['toastClean']>>(() => {
        return toastRef.current?.hideAll?.();
    }, []);

    const globalValue: GlobalContextType = {
        bottomActionSheetRef,
        actionDialogRef,
        toastShow,
        toastClean,
    };

    return (
        <GlobalContext.Provider value={globalValue}>
            {children}
            <BottomActionSheet ref={bottomActionSheetRef} />
            <ActionDialog ref={actionDialogRef} />
            <Toast ref={toastRef} enabled={isActive} />
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within an GlobalProvider');
    }
    return context;
};
