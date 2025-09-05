import React, { useRef } from 'react';
import {
    AvatarActionsModal,
    SwipeSidebar,
    SliderVerification,
    BottomActionSheet,
    ActionDialog,
    CountryCodeDialog,
} from '@/global';
import type {
    AvatarActionsModalAPI,
    SwipeSidebarAPI,
    SliderVerificationAPI,
    BottomActionSheetAPI,
    ActionDialogAPI,
    CountryCodeDialogAPI,
} from '@/global';
import PersonCenter from '@/center/personCenter/screens/PersonCenter.tsx';

interface GlobalContextType {
    sliderVerificationRef: React.RefObject<SliderVerificationAPI>,
    swipeSidebarRef: React.RefObject<SwipeSidebarAPI>,
    avatarActionsModalRef: React.RefObject<AvatarActionsModalAPI>,
    bottomActionSheetRef: React.RefObject<BottomActionSheetAPI>
    actionDialogRef: React.RefObject<ActionDialogAPI>
    countryCodeDialogRef: React.RefObject<CountryCodeDialogAPI>
}

const GlobalContext = React.createContext<GlobalContextType | null>(null);

export const GlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const sliderVerificationRef = useRef<SliderVerificationAPI>(null);
    const swipeSidebarRef = useRef<SwipeSidebarAPI>(null);
    const avatarActionsModalRef = useRef<AvatarActionsModalAPI>(null);
    const bottomActionSheetRef = useRef<BottomActionSheetAPI>(null);
    const actionDialogRef = useRef<ActionDialogAPI>(null);
    const countryCodeDialogRef = React.useRef<CountryCodeDialogAPI>(null);


    const globalValue: GlobalContextType = {
        sliderVerificationRef,
        swipeSidebarRef,
        avatarActionsModalRef,
        bottomActionSheetRef,
        actionDialogRef,
        countryCodeDialogRef,
    };

    return (
        <GlobalContext.Provider value={globalValue}>
            {children}
            <SliderVerification ref={sliderVerificationRef} />
            <SwipeSidebar ref={swipeSidebarRef}>
                <PersonCenter />
            </SwipeSidebar>
            <AvatarActionsModal ref={avatarActionsModalRef} />
            <BottomActionSheet ref={bottomActionSheetRef} />
            <ActionDialog ref={actionDialogRef} />
            <CountryCodeDialog ref={countryCodeDialogRef} />
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
