import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
// import BootSplash from 'react-native-bootsplash';
import AppLogin from '@/auth/login/screens/AppLogin.tsx';
// import AppRegister from '@/auth/register/screens/AppRegister.tsx';
import AppMain from '@/main/screen/AppMain.tsx';
import TestPage from '@/test/TestPage.tsx';
import QuestionBank from '@/question/questionBank/screens/QuestionBank.tsx';
import QuestionPaginator from '@/question/questionPaginator/screens/QuestionPaginator.tsx';
import OpeQuestion from '@/question/opeQuestion/screens/OpeQuestion.tsx';
import CreateQuestionTags from '@/question/opeQuestion/screens/CreateQuestionTags.tsx';
import NoteLibrary from '@/note/noteLibrary/screens/NoteLibrary.tsx';
import NoteReader from '@/note/noteReader/screens/NoteReader.tsx';
import EditNote from '@/note/editNote/screens/EditNote.tsx';
import CreateNoteTag from '@/note/createNote/screens/CreateNoteTag.tsx';
import AddNoteCover from '@/note/createNote/screens/AddNoteCover.tsx';
import AddNoteContent from '@/note/createNote/screens/AddNoteContent.tsx';
import RecycleBin from '@/center/recycleBin/screens/RecycleBin.tsx';
import PersonCenter from '@/center/personCenter/screens/PersonCenter.tsx';
import OneTapLogin from '@/auth/oneTapLogin/screens/OneTapLogin.tsx';
import VerificationLogin from '@/auth/verificationLogin/screens/VerificationLogin.tsx';
import VerificationCode from '@/auth/verificationLogin/screens/VerificationCode.tsx';
import PasswordLogin from '@/auth/passwordLogin/screens/PasswordLogin.tsx';
import { useNavigationStore } from './navigationStore';
import { navigationRef } from '@navigation/navigationRef.ts';
import SessionWatcher from './SessionWatcher';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const AppStackNavigator = () => {
    const { initialRouteName } = useNavigationStore();

    return (
        <Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
            <Screen name="AppLogin" component={AppLogin} />
            <Screen name="OneTapLogin" component={OneTapLogin} />
            <Screen name="VerificationLogin" component={VerificationLogin} />
            <Screen name="VerificationCode" component={VerificationCode} />
            <Screen name="PasswordLogin" component={PasswordLogin} />
            {/*<Screen name="AppRegister" component={AppRegister} />*/}
            <Screen name="AppMain" component={AppMain} />
            {/* 题目模块 */}
            <Screen name="QuestionBank" component={QuestionBank} />
            <Screen name="QuestionPaginator" component={QuestionPaginator} initialParams={{ questionId: '' }} />
            <Screen name="OpeQuestion" component={OpeQuestion} initialParams={{ type: '', questionId: '' }} />
            <Screen name="CreateQuestionTags" component={CreateQuestionTags} initialParams={{ question: null }} />
            {/*/!* 笔记模块 *!/*/}
            <Screen name="NoteLibrary" component={NoteLibrary} />
            <Screen name="NoteReader" component={NoteReader} initialParams={{ noteId: '' }} />
            <Screen name="AddNoteCover" component={AddNoteCover} />
            <Screen name="AddNoteContent" component={AddNoteContent} />
            <Screen name="CreateNoteTag" component={CreateNoteTag} initialParams={{ note: null }} />
            <Screen name="EditNote" component={EditNote} />
            {/*个人中心*/}
            <Screen name="PersonCenter" component={PersonCenter} />
            <Screen name="RecycleBin" component={RecycleBin} />
            {/*/!* 测试页面 *!/*/}
            <Screen name="TestPage" component={TestPage} />
        </Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                // BootSplash.hide({ fade: true });
            }}
        >
            <SessionWatcher />
            <AppStackNavigator />
        </NavigationContainer>
    );
};
