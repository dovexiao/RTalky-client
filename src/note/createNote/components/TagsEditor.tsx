import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {Input, Button, Icon, useTheme} from '@ui-kitten/components';
import { useSpecialTheme } from '@contexts/SpecialThemeContext.tsx';

interface TagsEditorProps {
    title: string;
    tags: string[];
    tagInput: string;
    setTagInput: (text: string) => void;
    onAddTag: () => void;
    onRemoveTag: (index: number) => void;
    onSubmit?: () => void;
    submitButtonText?: string;
}

export const TagsEditor: React.FC<TagsEditorProps> = ({
    title,
    tags,
    tagInput,
    setTagInput,
    onAddTag,
    onRemoveTag,
    onSubmit,
    submitButtonText = '提交',
}) => {
    const { specialThemeColors } = useSpecialTheme();
    const themes = useTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: specialThemeColors['bg-100'] },
        ]}>
            <Text style={[
                styles.title,
                { color: specialThemeColors['text-100'] },
            ]}>
                {title}
            </Text>

            {tags.length > 0 && (
                <View style={[
                    styles.tagsContainer,
                    { backgroundColor: specialThemeColors['bg-100'] },
                ]}>
                    {tags.map((tag, index) => (
                        <View key={index} style={[
                            styles.tag,
                            { backgroundColor: specialThemeColors['bg-200'] },
                        ]}>
                            <Text style={[
                                styles.tagText,
                                { color: specialThemeColors['text-100'] },
                            ]}>
                                {tag}
                            </Text>
                            <TouchableOpacity
                                onPress={() => onRemoveTag(index)}
                            >
                                <Text style={[
                                    styles.removeTagButtonText,
                                    { color: specialThemeColors['text-200'] },
                                ]}>
                                    ×
                                </Text>
                                {/*<View style={styles.removeTagButton}>*/}
                                {/*    <Text style={styles.removeTagButtonText}>×</Text>*/}
                                {/*</View>*/}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <View style={[
                styles.inputContainer,
                { backgroundColor: specialThemeColors['bg-100'] },
            ]}>
                <View style={{
                    flex: 1,
                    backgroundColor: specialThemeColors['bg-100'],
                }}>
                    <Input
                        value={tagInput}
                        onChangeText={setTagInput}
                        multiline={true}
                        textStyle={styles.input}
                        placeholder="输入标签"
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: themes['background-basic-color-2'],
                            borderColor: themes['border-basic-color-4'],
                        },
                    ]}
                    onPress={onAddTag}
                >
                    <Icon
                        style={{ width: 20, height: 20 }}
                        name="plus-outline"
                        fill={themes['text-hint-color']}
                    />
                </TouchableOpacity>
            </View>

            {onSubmit && <Button style={styles.submitButton} onPress={onSubmit}>
                <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            </Button>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        fontSize: 16,
        // lineHeight: 30,
        // color: '#333',
        textAlignVertical: 'top',
    },
    addButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 4,
        backgroundColor: '#F7F9FC',
        padding: 12,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        // marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#333',
    },
    removeTagButton: {
        marginLeft: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeTagButtonText: {
        marginLeft: 4,
        // height: 120,
        fontSize: 16,
        color: '#666',
        // lineHeight: 20,
        // backgroundColor: 'red',
        textAlign: 'center',
    },
    submitButton: {
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});
