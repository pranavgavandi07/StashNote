import {
    NOTE_CATEGORIES,
    CATEGORIES,
    SORT_OPTIONS,
    getNoteTitle,
    getNoteDate,
    getNoteCategory,
    formatNoteDate,
    formatRelativeNoteDate,
    matchesSearch,
    filterNotes,
    sortNotes,
    applyPinPriority,
    getDisplayedNotes,
    getSortLabel,
    getResultLabel,
} from '../src/utils/noteHelpers';

const notes = [
    {
        id: '1',
        title: 'Buy Groceries',
        content: 'Milk and bread',
        category: 'Personal',
        isFavorite: true,
        isPinned: false,
        createdAt: '2026-08-10T10:00:00.000Z',
        updatedAt: '2026-08-12T10:00:00.000Z',
    },
    {
        id: '2',
        title: 'Project Meeting',
        content: 'Discuss StashNote features',
        category: 'Work',
        isFavorite: false,
        isPinned: true,
        createdAt: '2026-08-11T10:00:00.000Z',
        updatedAt: '2026-08-14T10:00:00.000Z',
    },
    {
        id: '3',
        title: 'App Idea',
        content: 'Build a useful mobile application',
        category: 'Ideas',
        isFavorite: true,
        isPinned: false,
        createdAt: '2026-08-09T10:00:00.000Z',
        updatedAt: '2026-08-13T10:00:00.000Z',
    },
];

describe('noteHelpers', () => {
    describe('categories', () => {
        it('contains the expected note categories', () => {
            expect(NOTE_CATEGORIES).toEqual([
                'Personal',
                'Work',
                'Important',
                'Ideas',
            ]);
        });

        it('includes All in the category filter list', () => {
            expect(CATEGORIES).toEqual([
                'All',
                ...NOTE_CATEGORIES,
            ]);
        });
    });

    describe('getNoteTitle', () => {
        it('returns the trimmed note title', () => {
            expect(
                getNoteTitle({
                    title: '  My Note  ',
                }),
            ).toBe('My Note');
        });

        it('returns Untitled Note when title is empty', () => {
            expect(
                getNoteTitle({
                    title: '   ',
                }),
            ).toBe('Untitled Note');
        });

        it('returns Untitled Note when note is missing', () => {
            expect(getNoteTitle(null)).toBe(
                'Untitled Note',
            );
        });
    });

    describe('getNoteDate', () => {
        it('prefers updatedAt over createdAt', () => {
            const note = {
                createdAt: '2026-08-10',
                updatedAt: '2026-08-12',
            };

            expect(getNoteDate(note)).toBe(
                '2026-08-12',
            );
        });

        it('uses createdAt when updatedAt is missing', () => {
            expect(
                getNoteDate({
                    createdAt: '2026-08-10',
                }),
            ).toBe('2026-08-10');
        });

        it('returns null when no date exists', () => {
            expect(getNoteDate({})).toBeNull();
        });
    });

    describe('getNoteCategory', () => {
        it('returns a valid category', () => {
            expect(
                getNoteCategory({
                    category: 'Work',
                }),
            ).toBe('Work');
        });

        it('defaults to Personal for an invalid category', () => {
            expect(
                getNoteCategory({
                    category: 'Unknown',
                }),
            ).toBe('Personal');
        });

        it('defaults to Personal when category is missing', () => {
            expect(getNoteCategory({})).toBe(
                'Personal',
            );
        });
    });

    describe('formatNoteDate', () => {
        it('returns an empty string for a missing date', () => {
            expect(formatNoteDate(null)).toBe('');
        });

        it('returns an empty string for an invalid date', () => {
            expect(
                formatNoteDate('not-a-date'),
            ).toBe('');
        });

        it('formats a valid date', () => {
            expect(
                formatNoteDate(
                    '2026-08-15T10:00:00.000Z',
                ),
            ).toBe('15 Aug');
        });
    });

    describe('formatRelativeNoteDate', () => {
        it('returns an empty string for a missing date', () => {
            expect(
                formatRelativeNoteDate(null),
            ).toBe('');
        });

        it('returns an empty string for an invalid date', () => {
            expect(
                formatRelativeNoteDate('not-a-date'),
            ).toBe('');
        });

        it('returns Just now for a recent date', () => {
            const recentDate = new Date(
                Date.now() - 30 * 1000,
            ).toISOString();

            expect(
                formatRelativeNoteDate(recentDate),
            ).toBe('Just now');
        });

        it('returns minutes ago for a recent date', () => {
            const recentDate = new Date(
                Date.now() - 5 * 60 * 1000,
            ).toISOString();

            expect(
                formatRelativeNoteDate(recentDate),
            ).toBe('5 min ago');
        });

        it('returns 1 hour ago for a one-hour-old date', () => {
            const recentDate = new Date(
                Date.now() - 60 * 60 * 1000,
            ).toISOString();

            expect(
                formatRelativeNoteDate(recentDate),
            ).toBe('1 hour ago');
        });

        it('returns hours ago for an older same-day date', () => {
            const recentDate = new Date(
                Date.now() - 3 * 60 * 60 * 1000,
            ).toISOString();

            expect(
                formatRelativeNoteDate(recentDate),
            ).toBe('3 hours ago');
        });

        it('formats future dates using the normal date format', () => {
            const futureDate = new Date(
                Date.now() + 24 * 60 * 60 * 1000,
            ).toISOString();

            expect(
                formatRelativeNoteDate(futureDate),
            ).toBe(
                formatNoteDate(futureDate),
            );
        });
    });

    describe('matchesSearch', () => {
        it('matches a note title', () => {
            expect(
                matchesSearch(
                    notes[0],
                    'groceries',
                ),
            ).toBe(true);
        });

        it('matches note content', () => {
            expect(
                matchesSearch(
                    notes[1],
                    'stashnote',
                ),
            ).toBe(true);
        });

        it('matches note category', () => {
            expect(
                matchesSearch(
                    notes[2],
                    'ideas',
                ),
            ).toBe(true);
        });

        it('is case-insensitive', () => {
            expect(
                matchesSearch(
                    notes[0],
                    'BUY GROCERIES',
                ),
            ).toBe(true);
        });

        it('returns true for an empty search query', () => {
            expect(
                matchesSearch(notes[0], ''),
            ).toBe(true);
        });

        it('returns false when there is no match', () => {
            expect(
                matchesSearch(
                    notes[0],
                    'unicorn',
                ),
            ).toBe(false);
        });
    });

    describe('filterNotes', () => {
        it('filters favorite notes', () => {
            const result = filterNotes(notes, {
                showFavorites: true,
            });

            expect(result).toHaveLength(2);

            expect(
                result.every(
                    note => note.isFavorite,
                ),
            ).toBe(true);
        });

        it('filters notes by category', () => {
            const result = filterNotes(notes, {
                selectedCategory: 'Work',
            });

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('2');
        });

        it('filters notes by search query', () => {
            const result = filterNotes(notes, {
                searchQuery: 'mobile',
            });

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('3');
        });

        it('combines favorite and category filters', () => {
            const result = filterNotes(notes, {
                showFavorites: true,
                selectedCategory: 'Ideas',
            });

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('3');
        });

        it('returns an empty array for invalid notes', () => {
            expect(
                filterNotes(null),
            ).toEqual([]);
        });
    });

    describe('sortNotes', () => {
        it('sorts by recently updated by default', () => {
            const result = sortNotes(notes);

            expect(
                result.map(note => note.id),
            ).toEqual(['2', '3', '1']);
        });

        it('sorts by recently created', () => {
            const result = sortNotes(
                notes,
                SORT_OPTIONS.RECENTLY_CREATED,
            );

            expect(
                result.map(note => note.id),
            ).toEqual(['2', '1', '3']);
        });

        it('sorts alphabetically', () => {
            const result = sortNotes(
                notes,
                SORT_OPTIONS.ALPHABETICAL,
            );

            expect(
                result.map(note => note.id),
            ).toEqual(['3', '1', '2']);
        });

        it('sorts in reverse alphabetical order', () => {
            const result = sortNotes(
                notes,
                SORT_OPTIONS.REVERSE_ALPHABETICAL,
            );

            expect(
                result.map(note => note.id),
            ).toEqual(['2', '1', '3']);
        });

        it('does not mutate the original notes array', () => {
            const originalOrder = notes.map(
                note => note.id,
            );

            sortNotes(
                notes,
                SORT_OPTIONS.ALPHABETICAL,
            );

            expect(
                notes.map(note => note.id),
            ).toEqual(originalOrder);
        });
    });

    describe('applyPinPriority', () => {
        it('moves pinned notes before unpinned notes', () => {
            const result = applyPinPriority(notes);

            expect(
                result.map(note => note.id),
            ).toEqual(['2', '1', '3']);
        });

        it('returns an empty array for invalid input', () => {
            expect(
                applyPinPriority(null),
            ).toEqual([]);
        });
    });

    describe('getDisplayedNotes', () => {
        it('sorts and then prioritizes pinned notes in the normal view', () => {
            const result = getDisplayedNotes(notes);

            expect(
                result.map(note => note.id),
            ).toEqual(['2', '3', '1']);
        });

        it('keeps alphabetical sorting purely alphabetical', () => {
            const result = getDisplayedNotes(notes, {
                sortOption:
                    SORT_OPTIONS.ALPHABETICAL,
            });

            expect(
                result.map(note => note.id),
            ).toEqual(['3', '1', '2']);
        });

        it('does not apply pin priority to favorites view', () => {
            const result = getDisplayedNotes(notes, {
                showFavorites: true,
            });

            expect(
                result.map(note => note.id),
            ).toEqual(['3', '1']);
        });

        it('filters by category before sorting', () => {
            const result = getDisplayedNotes(notes, {
                selectedCategory: 'Personal',
            });

            expect(
                result.map(note => note.id),
            ).toEqual(['1']);
        });

        it('filters by search query', () => {
            const result = getDisplayedNotes(notes, {
                searchQuery: 'meeting',
            });

            expect(
                result.map(note => note.id),
            ).toEqual(['2']);
        });
    });

    describe('getSortLabel', () => {
        it('returns the correct labels', () => {
            expect(
                getSortLabel(
                    SORT_OPTIONS.RECENTLY_UPDATED,
                ),
            ).toBe('Recently Updated');

            expect(
                getSortLabel(
                    SORT_OPTIONS.RECENTLY_CREATED,
                ),
            ).toBe('Recently Created');

            expect(
                getSortLabel(
                    SORT_OPTIONS.ALPHABETICAL,
                ),
            ).toBe('A → Z');

            expect(
                getSortLabel(
                    SORT_OPTIONS.REVERSE_ALPHABETICAL,
                ),
            ).toBe('Z → A');
        });

        it('defaults to Recently Updated for an unknown option', () => {
            expect(
                getSortLabel('unknown'),
            ).toBe('Recently Updated');
        });
    });

    describe('getResultLabel', () => {
        it('uses the singular label for one result', () => {
            expect(
                getResultLabel(
                    1,
                    'note',
                    'notes',
                ),
            ).toBe('1 note');
        });

        it('uses the plural label for multiple results', () => {
            expect(
                getResultLabel(
                    5,
                    'note',
                    'notes',
                ),
            ).toBe('5 notes');
        });

        it('uses the plural label for zero results', () => {
            expect(
                getResultLabel(
                    0,
                    'note',
                    'notes',
                ),
            ).toBe('0 notes');
        });
    });
});