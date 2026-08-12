import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
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

  const formatDate = dateString => {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderNote = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.noteCard,
        pressed && styles.noteCardPressed,
      ]}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}>
      <Text style={styles.noteTitle} numberOfLines={1}>
        {item.title || 'Untitled Note'}
      </Text>

      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={3}>
          {item.content}
        </Text>
      ) : (
        <Text style={styles.emptyContent}>No content</Text>
      )}

      <Text style={styles.noteDate}>
        {formatDate(item.updatedAt || item.createdAt)}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>StashNote</Text>
          <Text style={styles.subtitle}>
            {notes.length === 1 ? '1 note' : `${notes.length} notes`}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.headerAddButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('AddNote')}>
          <Text style={styles.headerAddText}>+</Text>
        </Pressable>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>+</Text>
          </View>

          <Text style={styles.emptyTitle}>Nothing here yet</Text>

          <Text style={styles.emptyText}>
            Create your first note and keep it safely in StashNote.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.emptyButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('AddNote')}>
            <Text style={styles.emptyButtonText}>Create a Note</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={renderNote}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}

      {notes.length > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.floatingButton,
            pressed && styles.floatingButtonPressed,
          ]}
          onPress={() => navigation.navigate('AddNote')}>
          <Text style={styles.floatingButtonText}>+</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 24,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },

  headerAddButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerAddText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 30,
  },

  list: {
    paddingBottom: 110,
  },

  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8E8E5',
  },

  noteCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  noteTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },

  noteContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5F5F5F',
  },

  emptyContent: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
  },

  noteDate: {
    marginTop: 14,
    fontSize: 12,
    color: '#999',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyIconText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '300',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#777',
    textAlign: 'center',
    marginBottom: 22,
  },

  emptyButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  floatingButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },

  floatingButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
});

export default HomeScreen;