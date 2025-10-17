import React, { useCallback, useRef } from 'react';
import {
    ActionDialog,
    Toast,
} from '@/global';
import type {
    ActionDialogAPI,
    ToastAPI,
} from '@/global';

interface GlobalContextType {
    actionDialogRef: React.RefObject<ActionDialogAPI>
    toastShow: ToastAPI['show'];
    toastActive: ToastAPI['active'];
    toastClean: ToastAPI['hideAll'];
}

const GlobalContext = React.createContext<GlobalContextType | null>(null);

export const GlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const actionDialogRef = useRef<ActionDialogAPI>(null);
    const toastRef = useRef<ToastAPI>(null);

    // 使用 useCallback 动态包装方法调用
    const toastShow = useCallback<NonNullable<GlobalContextType['toastShow']>>((content?, options?) => {
        return toastRef.current?.show?.(content, options);
    }, []);

    const toastActive = useCallback<NonNullable<GlobalContextType['toastActive']>>(() => {
        return toastRef.current?.active?.();
    }, []);

    const toastClean = useCallback<NonNullable<GlobalContextType['toastClean']>>(() => {
        return toastRef.current?.hideAll?.();
    }, []);

    const globalValue: GlobalContextType = {
        actionDialogRef,
        toastShow,
        toastActive,
        toastClean,
    };

    return (
        <GlobalContext.Provider value={globalValue}>
            {children}
            <ActionDialog ref={actionDialogRef} />
            <Toast ref={toastRef} />
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
