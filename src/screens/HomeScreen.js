import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { getNotes } from '../storage/noteStorage';

import NoteCard from '../components/NoteCard';

import {
  SORT_OPTIONS,
  getDisplayedNotes,
  getResultLabel,
  getSortLabel,
} from '../utils/noteHelpers';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [showFavorites, setShowFavorites] =
    useState(false);

  const [sortOption, setSortOption] = useState(
    SORT_OPTIONS.RECENTLY_UPDATED,
  );

  const [showSortOptions, setShowSortOptions] =
    useState(false);

  const loadNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  const displayedNotes = useMemo(() => {
    return getDisplayedNotes(notes, {
      searchQuery,
      showFavorites,
      sortOption,
    });
  }, [
    notes,
    searchQuery,
    showFavorites,
    sortOption,
  ]);

  const hasSearchQuery = Boolean(
    searchQuery.trim(),
  );

  const getSubtitle = () => {
    if (hasSearchQuery) {
      return getResultLabel(
        displayedNotes.length,
        'result',
        'results',
      );
    }

    if (showFavorites) {
      return getResultLabel(
        displayedNotes.length,
        'favorite',
        'favorites',
      );
    }

    return getResultLabel(
      notes.length,
      'note',
      'notes',
    );
  };

  const handleOpenNote = note => {
    navigation.navigate('NoteDetail', {
      note,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCreateNote = () => {
    navigation.navigate('AddNote');
  };

  const renderNote = ({ item, index }) => {
    const previousNote =
      displayedNotes[index - 1];

    const showOtherNotesDivider =
      !showFavorites &&
      !item.isPinned &&
      index > 0 &&
      previousNote?.isPinned;

    return (
      <NoteCard
        note={item}
        searchQuery={searchQuery}
        showOtherNotesDivider={
          showOtherNotesDivider
        }
        onPress={() => handleOpenNote(item)}
      />
    );
  };

  const renderSortOption = (
    value,
    label,
  ) => {
    const isActive = sortOption === value;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.sortOption,
          isActive &&
          styles.sortOptionActive,
          pressed &&
          styles.sortOptionPressed,
        ]}
        onPress={() => {
          setSortOption(value);
          setShowSortOptions(false);
        }}>
        <Text
          style={[
            styles.sortOptionText,
            isActive &&
            styles.sortOptionTextActive,
          ]}>
          {label}
        </Text>

        {isActive && (
          <Text style={styles.checkmark}>
            ✓
          </Text>
        )}
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    if (notes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>
              +
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            Nothing here yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first note and keep it
            safely in StashNote.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.emptyButton,
              pressed &&
              styles.buttonPressed,
            ]}
            onPress={handleCreateNote}>
            <Text style={styles.emptyButtonText}>
              Create a Note
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.noResultsState}>
        <View style={styles.noResultsIcon}>
          <Text
            style={styles.noResultsIconText}>
            {showFavorites ? '★' : '⌕'}
          </Text>
        </View>

        <Text style={styles.noResultsTitle}>
          {showFavorites
            ? 'No favorite notes'
            : 'No notes found'}
        </Text>

        <Text style={styles.noResultsText}>
          {showFavorites
            ? hasSearchQuery
              ? `No favorite notes match "${searchQuery}".`
              : 'Mark a note as favorite to find it here.'
            : `We couldn't find any notes matching "${searchQuery}".`}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.clearSearchMainButton,
            pressed &&
            styles.buttonPressed,
          ]}
          onPress={() => {
            if (hasSearchQuery) {
              handleClearSearch();
            } else {
              setShowFavorites(false);
            }
          }}>
          <Text
            style={
              styles.clearSearchMainButtonText
            }>
            {hasSearchQuery
              ? 'Clear Search'
              : 'Show All Notes'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>
            StashNote
          </Text>

          <Text style={styles.subtitle}>
            {getSubtitle()}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.headerAddButton,
            pressed &&
            styles.buttonPressed,
          ]}
          onPress={handleCreateNote}>
          <Text style={styles.headerAddText}>
            +
          </Text>
        </Pressable>
      </View>

      {notes.length > 0 && (
        <>
          {/* SEARCH */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>
              ⌕
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search notes..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />

            {hasSearchQuery && (
              <Pressable
                style={({ pressed }) => [
                  styles.clearSearchButton,
                  pressed &&
                  styles.buttonPressed,
                ]}
                onPress={handleClearSearch}>
                <Text
                  style={styles.clearSearchText}>
                  ×
                </Text>
              </Pressable>
            )}
          </View>

          {/* FILTERS */}
          <View style={styles.filterRow}>
            <View style={styles.filterContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.filterButton,
                  !showFavorites &&
                  styles.filterButtonActive,
                  pressed &&
                  styles.buttonPressed,
                ]}
                onPress={() =>
                  setShowFavorites(false)
                }>
                <Text
                  style={[
                    styles.filterButtonText,
                    !showFavorites &&
                    styles.filterButtonTextActive,
                  ]}>
                  All Notes
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.filterButton,
                  showFavorites &&
                  styles.filterButtonActive,
                  pressed &&
                  styles.buttonPressed,
                ]}
                onPress={() =>
                  setShowFavorites(true)
                }>
                <Text
                  style={[
                    styles.filterButtonText,
                    showFavorites &&
                    styles.filterButtonTextActive,
                  ]}>
                  ★ Favorites
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.sortButton,
                pressed &&
                styles.buttonPressed,
              ]}
              onPress={() =>
                setShowSortOptions(
                  previous => !previous,
                )
              }>
              <Text style={styles.sortIcon}>
                ↕
              </Text>
            </Pressable>
          </View>

          {/* SORT MENU */}
          {showSortOptions && (
            <View style={styles.sortMenu}>
              <Text style={styles.sortMenuTitle}>
                Sort Notes
              </Text>

              {renderSortOption(
                SORT_OPTIONS.RECENTLY_UPDATED,
                'Recently Updated',
              )}

              {renderSortOption(
                SORT_OPTIONS.RECENTLY_CREATED,
                'Recently Created',
              )}

              {renderSortOption(
                SORT_OPTIONS.ALPHABETICAL,
                'A → Z',
              )}

              {renderSortOption(
                SORT_OPTIONS.REVERSE_ALPHABETICAL,
                'Z → A',
              )}
            </View>
          )}

          <View style={styles.currentSortRow}>
            <Text style={styles.currentSortText}>
              {getSortLabel(sortOption)}
            </Text>
          </View>
        </>
      )}

      {displayedNotes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedNotes}
          keyExtractor={item => item.id}
          renderItem={renderNote}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.list
          }
          keyboardShouldPersistTaps="handled"
        />
      )}

      {notes.length > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.floatingButton,
            pressed &&
            styles.floatingButtonPressed,
          ]}
          onPress={handleCreateNote}>
          <Text
            style={styles.floatingButtonText}>
            +
          </Text>
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
    paddingBottom: 18,
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

  searchContainer: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  searchIcon: {
    fontSize: 25,
    color: '#777',
    marginRight: 8,
    marginTop: -3,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#171717',
    paddingVertical: 0,
  },

  clearSearchButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  clearSearchText: {
    fontSize: 22,
    lineHeight: 24,
    color: '#555',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ECECE9',
    borderRadius: 12,
    padding: 3,
    marginRight: 8,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#171717',
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },

  filterButtonTextActive: {
    color: '#fff',
  },

  sortButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sortIcon: {
    fontSize: 22,
    color: '#333',
  },

  sortMenu: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E5',
    padding: 6,
    marginBottom: 6,
  },

  sortMenuTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sortOption: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sortOptionActive: {
    backgroundColor: '#F0F0EE',
  },

  sortOptionPressed: {
    opacity: 0.65,
  },

  sortOptionText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  sortOptionTextActive: {
    color: '#171717',
    fontWeight: '700',
  },

  checkmark: {
    fontSize: 17,
    color: '#171717',
    fontWeight: '700',
  },

  currentSortRow: {
    paddingHorizontal: 3,
    marginBottom: 8,
  },

  currentSortText: {
    fontSize: 12,
    color: '#999',
  },

  list: {
    paddingBottom: 110,
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

  noResultsState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  noResultsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAEAE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  noResultsIconText: {
    fontSize: 28,
    color: '#555',
  },

  noResultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },

  noResultsText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#777',
    textAlign: 'center',
    marginBottom: 22,
  },

  clearSearchMainButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
  },

  clearSearchMainButtonText: {
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