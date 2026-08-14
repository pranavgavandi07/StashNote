import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@stashnote_notes';

/**
 * Creates a safe, consistent note object.
 *
 * This also keeps older notes compatible if they
 * don't have isFavorite or isPinned yet.
 */
const normalizeNote = note => {
    if (!note || typeof note !== 'object') {
        return null;
    }

    return {
        ...note,
        isFavorite: note.isFavorite ?? false,
        isPinned: note.isPinned ?? false,
    };
};

/**
 * Loads all notes from AsyncStorage.
 */
export const getNotes = async () => {
    try {
        const storedNotes = await AsyncStorage.getItem(
            NOTES_STORAGE_KEY,
        );

        if (!storedNotes) {
            return [];
        }

        const parsedNotes = JSON.parse(storedNotes);

        if (!Array.isArray(parsedNotes)) {
            return [];
        }

        return parsedNotes
            .map(normalizeNote)
            .filter(Boolean);
    } catch (error) {
        console.error(
            'Failed to load notes:',
            error,
        );

        return [];
    }
};

/**
 * Saves the complete notes array.
 */
export const saveNotes = async notes => {
    try {
        const safeNotes = Array.isArray(notes)
            ? notes
                .map(normalizeNote)
                .filter(Boolean)
            : [];

        await AsyncStorage.setItem(
            NOTES_STORAGE_KEY,
            JSON.stringify(safeNotes),
        );
    } catch (error) {
        console.error(
            'Failed to save notes:',
            error,
        );

        throw error;
    }
};

/**
 * Adds a new note to the beginning of the list.
 */
export const addNote = async note => {
    const existingNotes = await getNotes();

    const newNote = normalizeNote(note);

    if (!newNote) {
        throw new Error(
            'Cannot add an invalid note.',
        );
    }

    const updatedNotes = [
        newNote,
        ...existingNotes,
    ];

    await saveNotes(updatedNotes);

    return updatedNotes;
};

/**
 * Updates an existing note while preserving
 * favorite and pin state when not provided.
 */
export const updateNote = async updatedNote => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.map(note => {
        if (note.id !== updatedNote?.id) {
            return note;
        }

        return normalizeNote({
            ...note,
            ...updatedNote,

            isFavorite:
                updatedNote.isFavorite ??
                note.isFavorite,

            isPinned:
                updatedNote.isPinned ??
                note.isPinned,
        });
    });

    await saveNotes(updatedNotes);

    return updatedNotes;
};

/**
 * Toggles the favorite state of a note.
 */
export const toggleFavorite = async noteId => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.map(note => {
        if (note.id !== noteId) {
            return note;
        }

        return {
            ...note,
            isFavorite: !note.isFavorite,
        };
    });

    await saveNotes(updatedNotes);

    return updatedNotes;
};

/**
 * Toggles the pinned state of a note.
 */
export const togglePinned = async noteId => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.map(note => {
        if (note.id !== noteId) {
            return note;
        }

        return {
            ...note,
            isPinned: !note.isPinned,
        };
    });

    await saveNotes(updatedNotes);

    return updatedNotes;
};

/**
 * Deletes a note by ID.
 */
export const deleteNote = async noteId => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.filter(
        note => note.id !== noteId,
    );

    await saveNotes(updatedNotes);

    return updatedNotes;
};