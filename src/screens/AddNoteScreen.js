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
import { addNote } from '../storage/noteStorage';

const AddNoteScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert('Empty note', 'Please enter a title or some content.');
            return;
        }

        try {
            setIsSaving(true);

            const newNote = {
                id: Date.now().toString(),
                title: title.trim(),
                content: content.trim(),
                createdAt: new Date().toISOString(),
            };

            await addNote(newNote);

            navigation.goBack();
        } catch (error) {
            Alert.alert(
                'Unable to save',
                'Something went wrong while saving your note.',
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
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>‹</Text>
                </Pressable>

                <Text style={styles.screenLabel}>New Note</Text>

                <View style={styles.topBarSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Note title"
                    placeholderTextColor="#A0A0A0"
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                    maxLength={100}
                />

                <TextInput
                    style={styles.contentInput}
                    placeholder="Start writing..."
                    placeholderTextColor="#A0A0A0"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && styles.pressed,
                        isSaving && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}>
                    <Text style={styles.saveButtonText}>
                        {isSaving ? 'Saving...' : 'Save Note'}
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
        marginBottom: 14,
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
        marginBottom: 20,
    },

    saveButton: {
        backgroundColor: '#171717',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
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

export default AddNoteScreen;