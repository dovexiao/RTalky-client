import React, { useState } from 'react';
import { useOpeNoteStore } from '../stores';
import { TagsEditor } from './TagsEditor.tsx';

export const NoteTagsEditor = () => {
    const tags = useOpeNoteStore(state => state.noteTags);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = () => {
        const addTag = useOpeNoteStore.getState().addTag;
        if (tagInput.trim() !== '') {
            addTag(tagInput.trim());
            setTagInput('');
        }
    };

    return (
        <TagsEditor
            title="添加标签"
            tags={tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={(tagIndex) => {
                const removeTag = useOpeNoteStore.getState().removeTag;
                removeTag(tagIndex);
            }}
        />
    );
};
