import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const NoteDetailScreen = ({ route }) => {
    const { note } = route.params;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {note.title || 'Untitled Note'}
                </Text>

                <Text style={styles.noteContent}>
                    {note.content || 'No content'}
                </Text>
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
    },
});

export default NoteDetailScreen;