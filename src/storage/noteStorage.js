import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@stashnote_notes';

export const getNotes = async () => {
    try {
        const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);

        if (!storedNotes) {
            return [];
        }

        return JSON.parse(storedNotes);
    } catch (error) {
        console.error('Failed to load notes:', error);
        return [];
    }
};

export const saveNotes = async notes => {
    try {
        await AsyncStorage.setItem(
            NOTES_STORAGE_KEY,
            JSON.stringify(notes),
        );
    } catch (error) {
        console.error('Failed to save notes:', error);
        throw error;
    }
};

export const addNote = async note => {
    const existingNotes = await getNotes();

    const updatedNotes = [note, ...existingNotes];

    await saveNotes(updatedNotes);

    return updatedNotes;
};

export const updateNote = async updatedNote => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.map(note =>
        note.id === updatedNote.id ? updatedNote : note,
    );

    await saveNotes(updatedNotes);

    return updatedNotes;
};

export const deleteNote = async noteId => {
    const existingNotes = await getNotes();

    const updatedNotes = existingNotes.filter(
        note => note.id !== noteId,
    );

    await saveNotes(updatedNotes);

    return updatedNotes;
};