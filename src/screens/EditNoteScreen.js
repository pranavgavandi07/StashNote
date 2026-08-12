import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { updateNote } from '../storage/noteStorage';

const EditNoteScreen = ({ route, navigation }) => {
    const { note } = route.params;

    const [title, setTitle] = useState(note.title || '');
    const [content, setContent] = useState(note.content || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert('Empty note', 'Please enter a title or some content.');
            return;
        }

        try {
            setIsSaving(true);

            const updatedNote = {
                ...note,
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date().toISOString(),
            };

            await updateNote(updatedNote);

            navigation.popTo('NoteDetail', {
                note: updatedNote,
            });
        } catch (error) {
            Alert.alert(
                'Unable to save',
                'Something went wrong while updating your note.',
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Note</Text>

            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.contentInput}
                placeholder="Write your note..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}>
                <Text style={styles.saveButtonText}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 18,
        marginBottom: 16,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 220,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EditNoteScreen;