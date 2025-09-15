import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTagColor } from '@utils/getTagColor.ts';
import { Question } from '../types';
import { RootStackParamList } from '@navigation/types';
import { MoreOpeIcon } from '@/icon';
import { useGlobal } from '@contexts/GlobalContext.tsx';
import QuestionSettingsAction from '@/question/questionBank/components/QuestionSettingsAction.tsx';

interface QuestionCardProps {
    question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { bottomActionSheetRef } = useGlobal();

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QuestionPaginator', { questionId: question.questionId })}>
            <View style={styles.header}>
                <Text style={styles.questionId}>{question.questionId}</Text>
                <Text style={styles.questionType}>{question.type}</Text>
                <TouchableOpacity onPress={() => {
                    bottomActionSheetRef.current?.show(<QuestionSettingsAction cardId={question.questionId}/>);
                }}>
                    <MoreOpeIcon width={25} height={25} color={'#000'} />
                </TouchableOpacity>
            </View>

            {/*<Text style={styles.meta}>*/}
            {/*    创建者: {item.creator} 最近修改: {item.lastModified}*/}
            {/*</Text>*/}

            <Text style={styles.content} numberOfLines={3} ellipsizeMode={'tail'}>{question.content}</Text>

            <View style={styles.tagsContainer}>
                {question.tags.map((tag, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tag,
                            { backgroundColor: getTagColor() },
                        ]}
                    >
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    questionId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        flex: 1,
    },
    questionType: {
        fontSize: 16,
        color: '#555555',
        marginRight: 10,
    },
    meta: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 12,
        lineHeight: 20,
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#555555',
    },
});
