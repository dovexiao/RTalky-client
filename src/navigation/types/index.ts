// 定义整个应用的路由参数类型
import { Note } from '@/note/noteLibrary/types';
import { Question } from '@/question/questionBank/types';

export type RootStackParamList = {
    AppMain: undefined;
    OneTapLogin: undefined;
    VerificationLogin: undefined;
    VerificationCode: undefined;
    PasswordLogin: undefined;
    // 笔记模块
    NoteLibrary: undefined;
    NoteReader: {
        noteId: string;
    };
    AddNoteCover: undefined;
    AddNoteContent: undefined;
    CreateNoteTag: {
        note: Note | null;
    };
    EditNote: {
        noteId: string;
    };
    // 题目模块
    QuestionBank: undefined;
    QuestionPaginator: {
        questionId: string;
    },
    OpeQuestion: {
        type: 'create' | 'update' | '';
        questionId?: string;
    };
    CreateQuestionTags: {
        question: Question | null;
    },
    // 个人中心
    PersonCenter: undefined,
    RecycleBin: undefined;
    BackgroundSettings: undefined;
    // 关于模块
    UserAgreement: undefined;
    PrivacyPolicy: undefined;
    AppPermissions: undefined;
    OpenSourceLicense: undefined;
    AboutRTalky: undefined;
    // 测试模块
    TestPage: undefined;
};
