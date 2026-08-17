import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    getNotes,
    saveNotes,
    addNote,
    updateNote,
    toggleFavorite,
    togglePinned,
    deleteNote,
} from '../src/storage/noteStorage';

const STORAGE_KEY = '@stashnote_notes';

const sampleNotes = [
    {
        id: '1',
        title: 'First Note',
        content: 'First content',
        category: 'Personal',
        isFavorite: false,
        isPinned: false,
        createdAt: '2026-08-10T10:00:00.000Z',
        updatedAt: '2026-08-10T10:00:00.000Z',
    },
    {
        id: '2',
        title: 'Second Note',
        content: 'Second content',
        category: 'Work',
        isFavorite: true,
        isPinned: false,
        createdAt: '2026-08-11T10:00:00.000Z',
        updatedAt: '2026-08-11T10:00:00.000Z',
    },
];

describe('noteStorage', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    describe('getNotes', () => {
        it('returns an empty array when no notes are stored', async () => {
            const result = await getNotes();

            expect(result).toEqual([]);
        });

        it('returns stored notes', async () => {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(sampleNotes),
            );

            const result = await getNotes();

            expect(result).toEqual(sampleNotes);
        });

        it('returns an empty array when stored data is invalid JSON', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => { });

            try {
                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    'invalid-json',
                );

                const result = await getNotes();

                expect(result).toEqual([]);

                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Failed to load notes:',
                    expect.any(SyntaxError),
                );
            } finally {
                consoleErrorSpy.mockRestore();
            }
        });

        it('returns an empty array when stored data is not an array', async () => {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    id: '1',
                }),
            );

            const result = await getNotes();

            expect(result).toEqual([]);
        });

        it('normalizes older notes with missing fields', async () => {
            const oldNotes = [
                {
                    id: '1',
                    title: 'Old Note',
                    content: 'Old content',
                    createdAt:
                        '2026-08-10T10:00:00.000Z',
                },
            ];

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(oldNotes),
            );

            const result = await getNotes();

            expect(result[0]).toMatchObject({
                id: '1',
                title: 'Old Note',
                content: 'Old content',
                category: 'Personal',
                isFavorite: false,
                isPinned: false,
                createdAt:
                    '2026-08-10T10:00:00.000Z',
                updatedAt:
                    '2026-08-10T10:00:00.000Z',
            });
        });
    });

    describe('saveNotes', () => {
        it('saves notes to AsyncStorage', async () => {
            await saveNotes(sampleNotes);

            expect(
                AsyncStorage.setItem,
            ).toHaveBeenCalledWith(
                STORAGE_KEY,
                JSON.stringify(sampleNotes),
            );
        });

        it('saves an empty array for invalid input', async () => {
            await saveNotes(null);

            expect(
                AsyncStorage.setItem,
            ).toHaveBeenCalledWith(
                STORAGE_KEY,
                JSON.stringify([]),
            );
        });
    });

    describe('addNote', () => {
        it('adds a new note', async () => {
            await saveNotes(sampleNotes);

            const newNote = {
                id: '3',
                title: 'Third Note',
                content: 'Third content',
                category: 'Ideas',
                createdAt:
                    '2026-08-12T10:00:00.000Z',
                updatedAt:
                    '2026-08-12T10:00:00.000Z',
            };

            const result = await addNote(newNote);

            expect(result).toHaveLength(3);

            expect(result[0]).toMatchObject({
                id: '3',
                title: 'Third Note',
                category: 'Ideas',
                isFavorite: false,
                isPinned: false,
            });
        });

        it('adds the new note at the beginning', async () => {
            await saveNotes(sampleNotes);

            const result = await addNote({
                id: '3',
                title: 'Newest Note',
                content: 'New content',
                category: 'Personal',
                createdAt:
                    '2026-08-12T10:00:00.000Z',
            });

            expect(result[0].id).toBe('3');
        });

        it('throws an error for an invalid note', async () => {
            await expect(
                addNote(null),
            ).rejects.toThrow(
                'Cannot add an invalid note.',
            );
        });
    });

    describe('updateNote', () => {
        it('updates an existing note', async () => {
            await saveNotes(sampleNotes);

            const result = await updateNote({
                id: '1',
                title: 'Updated First Note',
                content: 'Updated content',
            });

            const updatedNote = result.find(
                note => note.id === '1',
            );

            expect(updatedNote).toMatchObject({
                id: '1',
                title: 'Updated First Note',
                content: 'Updated content',
                category: 'Personal',
                isFavorite: false,
                isPinned: false,
                createdAt:
                    '2026-08-10T10:00:00.000Z',
            });
        });

        it('throws an error when note ID is missing', async () => {
            await expect(
                updateNote({
                    title: 'Updated Note',
                }),
            ).rejects.toThrow(
                'Cannot update a note without an ID.',
            );
        });

        it('throws an error when the note does not exist', async () => {
            await saveNotes(sampleNotes);

            await expect(
                updateNote({
                    id: '999',
                    title: 'Missing Note',
                }),
            ).rejects.toThrow(
                'Note not found.',
            );
        });

        it('preserves createdAt when updating', async () => {
            await saveNotes(sampleNotes);

            const result = await updateNote({
                id: '1',
                title: 'Changed Title',
                createdAt:
                    '2026-01-01T10:00:00.000Z',
            });

            const updatedNote = result.find(
                note => note.id === '1',
            );

            expect(updatedNote.createdAt).toBe(
                '2026-08-10T10:00:00.000Z',
            );
        });
    });

    describe('toggleFavorite', () => {
        it('toggles a note to favorite', async () => {
            await saveNotes(sampleNotes);

            const result = await toggleFavorite('1');

            const note = result.find(
                item => item.id === '1',
            );

            expect(note.isFavorite).toBe(true);
        });

        it('toggles a favorite note off', async () => {
            await saveNotes(sampleNotes);

            const result = await toggleFavorite('2');

            const note = result.find(
                item => item.id === '2',
            );

            expect(note.isFavorite).toBe(false);
        });

        it('throws an error when the note does not exist', async () => {
            await saveNotes(sampleNotes);

            await expect(
                toggleFavorite('999'),
            ).rejects.toThrow(
                'Note not found.',
            );
        });
    });

    describe('togglePinned', () => {
        it('toggles a note to pinned', async () => {
            await saveNotes(sampleNotes);

            const result = await togglePinned('1');

            const note = result.find(
                item => item.id === '1',
            );

            expect(note.isPinned).toBe(true);
        });

        it('toggles a pinned note off', async () => {
            const pinnedNotes = [
                {
                    ...sampleNotes[0],
                    isPinned: true,
                },
                sampleNotes[1],
            ];

            await saveNotes(pinnedNotes);

            const result = await togglePinned('1');

            const note = result.find(
                item => item.id === '1',
            );

            expect(note.isPinned).toBe(false);
        });

        it('throws an error when the note does not exist', async () => {
            await saveNotes(sampleNotes);

            await expect(
                togglePinned('999'),
            ).rejects.toThrow(
                'Note not found.',
            );
        });
    });

    describe('deleteNote', () => {
        it('deletes an existing note', async () => {
            await saveNotes(sampleNotes);

            const result = await deleteNote('1');

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('2');
        });

        it('removes the deleted note from storage', async () => {
            await saveNotes(sampleNotes);

            await deleteNote('1');

            const storedNotes = await getNotes();

            expect(storedNotes).toHaveLength(1);
            expect(storedNotes[0].id).toBe('2');
        });

        it('throws an error when the note does not exist', async () => {
            await saveNotes(sampleNotes);

            await expect(
                deleteNote('999'),
            ).rejects.toThrow(
                'Note not found.',
            );
        });
    });
});