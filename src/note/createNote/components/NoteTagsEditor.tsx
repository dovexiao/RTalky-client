import React from 'react';
import { useOpeNoteStore } from '../stores';
import { TagsEditor } from './TagsEditor.tsx';

export const NoteTagsEditor = () => {
    const tags = useOpeNoteStore(state => state.noteTags);

    const handleAddTag = (input: string) => {
        const addTag = useOpeNoteStore.getState().addTag;
        if (input.trim() !== '') {
            addTag(input.trim());
        }
    };

    return (
        <TagsEditor
            title="添加标签"
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={(tagIndex) => {
                const removeTag = useOpeNoteStore.getState().removeTag;
                removeTag(tagIndex);
            }}
        />
    );
};
