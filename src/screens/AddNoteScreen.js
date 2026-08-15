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

import {
    NOTE_CATEGORIES,
} from '../utils/noteHelpers';

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;

const AddNoteScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [category, setCategory] = useState(
        'Personal',
    );

    const [isSaving, setIsSaving] = useState(false);

    const hasUnsavedChanges =
        title.trim().length > 0 ||
        content.trim().length > 0 ||
        category !== 'Personal';

    const handleBack = () => {
        if (!hasUnsavedChanges) {
            navigation.goBack();
            return;
        }

        Alert.alert(
            'Discard Note?',
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
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle && !trimmedContent) {
            Alert.alert(
                'Empty note',
                'Please enter a title or some content.',
            );

            return;
        }

        try {
            setIsSaving(true);

            const currentDate =
                new Date().toISOString();

            const newNote = {
                id: Date.now().toString(),
                title: trimmedTitle,
                content: trimmedContent,
                category,
                createdAt: currentDate,
                updatedAt: currentDate,
                isFavorite: false,
                isPinned: false,
            };

            await addNote(newNote);

            navigation.goBack();
        } catch (error) {
            console.error(
                'Failed to create note:',
                error,
            );

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
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }>
            {/* TOP BAR */}
            <View style={styles.topBar}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.pressed,
                        isSaving &&
                        styles.backButtonDisabled,
                    ]}
                    onPress={handleBack}
                    disabled={isSaving}>
                    <Text style={styles.backText}>
                        ‹
                    </Text>
                </Pressable>

                <Text style={styles.screenLabel}>
                    New Note
                </Text>

                <View style={styles.topBarSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                    Platform.OS === 'ios'
                        ? 'interactive'
                        : 'on-drag'
                }
                contentContainerStyle={styles.content}>
                {/* TITLE */}
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

                {/* CONTENT */}
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

                {/* CATEGORY */}
                <View style={styles.categorySection}>
                    <Text style={styles.categoryLabel}>
                        Category
                    </Text>

                    <View style={styles.categoryList}>
                        {NOTE_CATEGORIES.map(item => {
                            const isSelected =
                                category === item;

                            return (
                                <Pressable
                                    key={item}
                                    style={({ pressed }) => [
                                        styles.categoryButton,
                                        isSelected &&
                                        styles.categoryButtonActive,
                                        pressed &&
                                        styles.pressed,
                                    ]}
                                    onPress={() =>
                                        setCategory(item)
                                    }>
                                    <Text
                                        style={[
                                            styles.categoryButtonText,
                                            isSelected &&
                                            styles.categoryButtonTextActive,
                                        ]}>
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* SAVE BUTTON */}
                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && styles.pressed,
                        isSaving &&
                        styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}>
                    <Text style={styles.saveButtonText}>
                        {isSaving
                            ? 'Saving...'
                            : 'Save Note'}
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

    backButtonDisabled: {
        opacity: 0.5,
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

    categorySection: {
        marginBottom: 20,
    },

    categoryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
    },

    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    categoryButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E5',
    },

    categoryButtonActive: {
        backgroundColor: '#171717',
        borderColor: '#171717',
    },

    categoryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },

    categoryButtonTextActive: {
        color: '#fff',
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

export default AddNoteScreen;