import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { deleteNote } from '../storage/noteStorage';

const NoteDetailScreen = ({ route, navigation }) => {
    const { note } = route.params;

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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {note.title || 'Untitled Note'}
                </Text>

                <Text style={styles.noteContent}>
                    {note.content || 'No content'}
                </Text>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        navigation.navigate('EditNote', { note })
                    }>
                    <Text style={styles.editButtonText}>Edit Note</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete Note</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
    },
    noteContent: {
        fontSize: 17,
        lineHeight: 26,
        color: '#333',
        marginBottom: 30,
    },
    editButton: {
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        borderWidth: 1,
        borderColor: '#d00',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#d00',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NoteDetailScreen;