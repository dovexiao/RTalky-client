import React, { useRef } from 'react';
import {
    AvatarActionsModal,
    SliderVerification,
    BottomActionSheet,
    ActionDialog,
} from '@/global';
import type {
    AvatarActionsModalAPI,
    SliderVerificationAPI,
    BottomActionSheetAPI,
    ActionDialogAPI,
} from '@/global';

interface GlobalContextType {
    sliderVerificationRef: React.RefObject<SliderVerificationAPI>,
    avatarActionsModalRef: React.RefObject<AvatarActionsModalAPI>,
    bottomActionSheetRef: React.RefObject<BottomActionSheetAPI>
    actionDialogRef: React.RefObject<ActionDialogAPI>
}

const GlobalContext = React.createContext<GlobalContextType | null>(null);

export const GlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const sliderVerificationRef = useRef<SliderVerificationAPI>(null);
    const avatarActionsModalRef = useRef<AvatarActionsModalAPI>(null);
    const bottomActionSheetRef = useRef<BottomActionSheetAPI>(null);
    const actionDialogRef = useRef<ActionDialogAPI>(null);


    const globalValue: GlobalContextType = {
        sliderVerificationRef,
        avatarActionsModalRef,
        bottomActionSheetRef,
        actionDialogRef,
    };

    return (
        <GlobalContext.Provider value={globalValue}>
            {children}
            <SliderVerification ref={sliderVerificationRef} />
            <AvatarActionsModal ref={avatarActionsModalRef} />
            <BottomActionSheet ref={bottomActionSheetRef} />
            <ActionDialog ref={actionDialogRef} />
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
