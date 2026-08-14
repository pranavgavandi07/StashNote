import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    deleteNote,
    toggleFavorite,
    togglePinned,
} from '../storage/noteStorage';

const NoteDetailScreen = ({ route, navigation }) => {
    const { note } = route.params;

    const [isFavorite, setIsFavorite] = useState(
        note.isFavorite ?? false,
    );

    const [isPinned, setIsPinned] = useState(
        note.isPinned ?? false,
    );

    const [isUpdatingFavorite, setIsUpdatingFavorite] =
        useState(false);

    const [isUpdatingPinned, setIsUpdatingPinned] =
        useState(false);

    const formatDate = dateString => {
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

    const getCurrentNote = () => ({
        ...note,
        isFavorite,
        isPinned,
    });

    const handleEdit = () => {
        navigation.navigate('EditNote', {
            note: getCurrentNote(),
        });
    };

    const handleToggleFavorite = async () => {
        if (isUpdatingFavorite) {
            return;
        }

        try {
            setIsUpdatingFavorite(true);

            const updatedNotes = await toggleFavorite(note.id);

            const updatedNote = updatedNotes.find(
                item => item.id === note.id,
            );

            if (updatedNote) {
                setIsFavorite(
                    updatedNote.isFavorite ?? false,
                );
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

            const updatedNotes = await togglePinned(note.id);

            const updatedNote = updatedNotes.find(
                item => item.id === note.id,
            );

            if (updatedNote) {
                setIsPinned(
                    updatedNote.isPinned ?? false,
                );
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
                            await deleteNote(note.id);

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

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>‹</Text>
                </Pressable>

                <Text style={styles.screenLabel}>
                    Note
                </Text>

                <View style={styles.topBarActions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            isPinned &&
                            styles.iconButtonActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleTogglePinned}
                        disabled={isUpdatingPinned}>
                        <Text
                            style={[
                                styles.pinIcon,
                                isPinned &&
                                styles.pinIconActive,
                            ]}>
                            📌
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            isFavorite &&
                            styles.iconButtonActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleToggleFavorite}
                        disabled={isUpdatingFavorite}>
                        <Text
                            style={[
                                styles.favoriteIcon,
                                isFavorite &&
                                styles.favoriteIconActive,
                            ]}>
                            {isFavorite ? '★' : '☆'}
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
                            {note.title ||
                                'Untitled Note'}
                        </Text>

                        {isPinned && (
                            <Text
                                style={styles.titlePin}>
                                📌
                            </Text>
                        )}

                        {isFavorite && (
                            <Text
                                style={
                                    styles.titleFavorite
                                }>
                                ★
                            </Text>
                        )}
                    </View>

                    <Text style={styles.date}>
                        {formatDate(
                            note.updatedAt ||
                            note.createdAt,
                        )}
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.noteContent}>
                    {note.content || 'No content'}
                </Text>

                <View style={styles.actions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.editButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleEdit}>
                        <Text
                            style={
                                styles.editButtonText
                            }>
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
                            style={
                                styles.deleteButtonText
                            }>
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

    pinIconActive: {
        opacity: 1,
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

    date: {
        marginTop: 10,
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