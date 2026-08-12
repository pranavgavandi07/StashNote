import React from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { deleteNote } from '../storage/noteStorage';

const NoteDetailScreen = ({ route, navigation }) => {
    const { note } = route.params;

    const formatDate = dateString => {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
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

                <Text style={styles.screenLabel}>Note</Text>

                <View style={styles.topBarSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <Text style={styles.title}>
                    {note.title || 'Untitled Note'}
                </Text>

                <Text style={styles.date}>
                    {formatDate(note.updatedAt || note.createdAt)}
                </Text>

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
                        onPress={() =>
                            navigation.navigate('EditNote', { note })
                        }>
                        <Text style={styles.editButtonText}>Edit Note</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>Delete Note</Text>
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

    topBarSpacer: {
        width: 42,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
    },

    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '800',
        color: '#171717',
        letterSpacing: -0.7,
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
        marginTop: 40,
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