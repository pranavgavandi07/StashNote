import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getNotes } from '../storage/noteStorage';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}>
      <Text style={styles.noteTitle}>
        {item.title || 'Untitled Note'}
      </Text>

      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={3}>
          {item.content}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>StashNote</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddNote')}>
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyText}>
            Tap "Add Note" to create your first note.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  noteCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;