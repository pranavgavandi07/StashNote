import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { updateNote } from '../storage/noteStorage';

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;

const EditNoteScreen = ({ route, navigation }) => {
    const { note } = route.params;

    const [title, setTitle] = useState(note.title || '');
    const [content, setContent] = useState(note.content || '');
    const [isSaving, setIsSaving] = useState(false);

    const hasUnsavedChanges =
        title !== (note.title || '') ||
        content !== (note.content || '');

    const handleBack = () => {
        if (!hasUnsavedChanges) {
            navigation.goBack();
            return;
        }

        Alert.alert(
            'Discard Changes?',
            'You have unsaved changes. Are you sure you want to leave?',
            [
                {
                    text: 'Keep Editing',
                    style: 'cancel',
                },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => navigation.goBack(),
                },
            ],
        );
    };

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert(
                'Empty note',
                'Please enter a title or some content.',
            );
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.topBar}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={handleBack}>
                    <Text style={styles.backText}>‹</Text>
                </Pressable>

                <Text style={styles.screenLabel}>Edit Note</Text>

                <View style={styles.topBarSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === 'ios' ? 'interactive' : 'on-drag'
                }
                contentContainerStyle={styles.content}>
                <View style={styles.inputHeader}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Note title"
                        placeholderTextColor="#A0A0A0"
                        value={title}
                        onChangeText={setTitle}
                        returnKeyType="next"
                        maxLength={TITLE_MAX_LENGTH}
                    />

                    <Text style={styles.characterCount}>
                        {title.length}/{TITLE_MAX_LENGTH}
                    </Text>
                </View>

                <View style={styles.inputHeader}>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Start writing..."
                        placeholderTextColor="#A0A0A0"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                        maxLength={CONTENT_MAX_LENGTH}
                    />

                    <Text style={styles.characterCount}>
                        {content.length}/{CONTENT_MAX_LENGTH}
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && styles.pressed,
                        isSaving && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}>
                    <Text style={styles.saveButtonText}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F5',
    },

    topBar: {
        height: 72,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E5',
    },

    backText: {
        fontSize: 32,
        lineHeight: 34,
        color: '#171717',
        marginTop: -3,
    },

    screenLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#777',
    },

    topBarSpacer: {
        width: 42,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
    },

    inputHeader: {
        marginBottom: 14,
    },

    titleInput: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8E8E5',
        paddingHorizontal: 18,
        paddingVertical: 17,
        fontSize: 22,
        fontWeight: '700',
        color: '#171717',
    },

    contentInput: {
        minHeight: 280,
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8E8E5',
        paddingHorizontal: 18,
        paddingVertical: 17,
        fontSize: 17,
        lineHeight: 26,
        color: '#3F3F3F',
    },

    characterCount: {
        alignSelf: 'flex-end',
        marginTop: 6,
        marginRight: 4,
        fontSize: 11,
        color: '#999',
    },

    saveButton: {
        backgroundColor: '#171717',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 6,
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },

    pressed: {
        opacity: 0.7,
    },
});

export default EditNoteScreen;