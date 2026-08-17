import React, {
    useCallback,
    useState,
} from 'react';

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
    deleteNote,
    getNotes,
    toggleFavorite,
    togglePinned,
} from '../storage/noteStorage';

import {
    getNoteCategory,
    getNoteDate,
    getNoteTitle,
} from '../utils/noteHelpers';

const NoteDetailScreen = ({ route, navigation }) => {
    const { note: initialNote } = route.params;

    const [currentNote, setCurrentNote] =
        useState(initialNote);

    const [isUpdatingFavorite, setIsUpdatingFavorite] =
        useState(false);

    const [isUpdatingPinned, setIsUpdatingPinned] =
        useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadCurrentNote = async () => {
                try {
                    const notes = await getNotes();

                    const latestNote = notes.find(
                        item => item.id === initialNote.id,
                    );

                    if (!latestNote) {
                        if (isActive) {
                            navigation.goBack();
                        }

                        return;
                    }

                    if (isActive) {
                        setCurrentNote(latestNote);
                    }
                } catch (error) {
                    console.error(
                        'Failed to load current note:',
                        error,
                    );
                }
            };

            loadCurrentNote();

            return () => {
                isActive = false;
            };
        }, [initialNote.id, navigation]),
    );

    const formatFullDate = dateString => {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleEdit = () => {
        navigation.navigate('EditNote', {
            note: currentNote,
        });
    };

    const handleToggleFavorite = async () => {
        if (isUpdatingFavorite) {
            return;
        }

        try {
            setIsUpdatingFavorite(true);

            const updatedNotes = await toggleFavorite(
                currentNote.id,
            );

            const updatedNote = updatedNotes.find(
                item => item.id === currentNote.id,
            );

            if (updatedNote) {
                setCurrentNote(updatedNote);
            }
        } catch (error) {
            console.error(
                'Failed to toggle favorite:',
                error,
            );

            Alert.alert(
                'Unable to update favorite',
                'Something went wrong while updating this note.',
            );
        } finally {
            setIsUpdatingFavorite(false);
        }
    };

    const handleTogglePinned = async () => {
        if (isUpdatingPinned) {
            return;
        }

        try {
            setIsUpdatingPinned(true);

            const updatedNotes = await togglePinned(
                currentNote.id,
            );

            const updatedNote = updatedNotes.find(
                item => item.id === currentNote.id,
            );

            if (updatedNote) {
                setCurrentNote(updatedNote);
            }
        } catch (error) {
            console.error(
                'Failed to toggle pin:',
                error,
            );

            Alert.alert(
                'Unable to update pin',
                'Something went wrong while updating this note.',
            );
        } finally {
            setIsUpdatingPinned(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNote(
                                currentNote.id,
                            );

                            navigation.popToTop();
                        } catch (error) {
                            console.error(
                                'Failed to delete note:',
                                error,
                            );

                            Alert.alert(
                                'Unable to delete',
                                'Something went wrong while deleting your note.',
                            );
                        }
                    },
                },
            ],
        );
    };

    const title = getNoteTitle(currentNote);
    const category = getNoteCategory(currentNote);
    const content = currentNote.content || '';

    const createdDate = formatFullDate(
        currentNote.createdAt,
    );

    const updatedDate = formatFullDate(
        currentNote.updatedAt,
    );

    const displayDate = formatFullDate(
        getNoteDate(currentNote),
    );

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>
                        ‹
                    </Text>
                </Pressable>

                <Text style={styles.screenLabel}>
                    Note
                </Text>

                <View style={styles.topBarActions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            currentNote.isPinned &&
                            styles.iconButtonActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleTogglePinned}
                        disabled={isUpdatingPinned}>
                        <Text style={styles.pinIcon}>
                            📌
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            currentNote.isFavorite &&
                            styles.iconButtonActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleToggleFavorite}
                        disabled={isUpdatingFavorite}>
                        <Text
                            style={[
                                styles.favoriteIcon,
                                currentNote.isFavorite &&
                                styles.favoriteIconActive,
                            ]}>
                            {currentNote.isFavorite
                                ? '★'
                                : '☆'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.editTopButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleEdit}>
                        <Text
                            style={styles.editTopButtonText}>
                            Edit
                        </Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <View style={styles.noteHeader}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>
                            {title}
                        </Text>

                        {currentNote.isPinned && (
                            <Text style={styles.titlePin}>
                                📌
                            </Text>
                        )}

                        {currentNote.isFavorite && (
                            <Text
                                style={
                                    styles.titleFavorite
                                }>
                                ★
                            </Text>
                        )}
                    </View>

                    <View style={styles.noteMeta}>
                        <View style={styles.categoryBadge}>
                            <Text
                                style={styles.categoryText}>
                                {category}
                            </Text>
                        </View>

                        {displayDate ? (
                            <Text style={styles.date}>
                                {displayDate}
                            </Text>
                        ) : null}
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.noteContent}>
                    {content || 'No content'}
                </Text>

                {(createdDate || updatedDate) && (
                    <View style={styles.noteInfoSection}>
                        <Text
                            style={styles.noteInfoTitle}>
                            Note Info
                        </Text>

                        <View style={styles.noteInfoCard}>
                            {createdDate ? (
                                <View
                                    style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }>
                                        Created
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }>
                                        {createdDate}
                                    </Text>
                                </View>
                            ) : null}

                            {updatedDate ? (
                                <View
                                    style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }>
                                        Last updated
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }>
                                        {updatedDate}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                )}

                <View style={styles.actions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.editButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleEdit}>
                        <Text style={styles.editButtonText}>
                            Edit Note
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleDelete}>
                        <Text
                            style={styles.deleteButtonText}>
                            Delete Note
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
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

    topBarActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconButtonActive: {
        backgroundColor: '#171717',
        borderColor: '#171717',
    },

    pinIcon: {
        fontSize: 18,
        textAlign: 'center',
    },

    favoriteIcon: {
        fontSize: 22,
        lineHeight: 22,
        color: '#555',
        textAlign: 'center',
        includeFontPadding: false,
    },

    favoriteIconActive: {
        color: '#fff',
    },

    editTopButton: {
        minWidth: 58,
        height: 40,
        paddingHorizontal: 13,
        borderRadius: 20,
        backgroundColor: '#171717',
        alignItems: 'center',
        justifyContent: 'center',
    },

    editTopButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 50,
    },

    noteHeader: {
        paddingTop: 4,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    title: {
        flex: 1,
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '800',
        color: '#171717',
        letterSpacing: -0.7,
    },

    titlePin: {
        fontSize: 17,
        marginLeft: 8,
        marginTop: 6,
    },

    titleFavorite: {
        fontSize: 20,
        color: '#171717',
        marginLeft: 7,
        marginTop: 4,
    },

    noteMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    categoryBadge: {
        backgroundColor: '#EAEAE7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#555',
    },

    date: {
        fontSize: 13,
        color: '#999',
    },

    divider: {
        height: 1,
        backgroundColor: '#E3E3E0',
        marginVertical: 26,
    },

    noteContent: {
        fontSize: 17,
        lineHeight: 28,
        color: '#3F3F3F',
    },

    noteInfoSection: {
        marginTop: 34,
    },

    noteInfoTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 10,
    },

    noteInfoCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E5',
        borderRadius: 14,
        paddingHorizontal: 16,
    },

    infoRow: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    infoLabel: {
        fontSize: 13,
        color: '#777',
    },

    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3F3F3F',
    },

    actions: {
        marginTop: 44,
    },

    editButton: {
        backgroundColor: '#171717',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 12,
    },

    editButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },

    deleteButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1CFCF',
    },

    deleteButtonText: {
        color: '#B42323',
        fontSize: 15,
        fontWeight: '600',
    },

    pressed: {
        opacity: 0.7,
    },
});

export default NoteDetailScreen;