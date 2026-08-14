export const SORT_OPTIONS = {
    RECENTLY_UPDATED: 'recentlyUpdated',
    RECENTLY_CREATED: 'recentlyCreated',
    ALPHABETICAL: 'alphabetical',
    REVERSE_ALPHABETICAL: 'reverseAlphabetical',
};

export const getNoteTitle = note =>
    note?.title?.trim() || 'Untitled Note';

export const getNoteDate = note =>
    note?.updatedAt || note?.createdAt || null;

export const formatNoteDate = dateString => {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });
};

export const matchesSearch = (note, searchQuery) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
        return true;
    }

    const title = (note?.title || '').toLowerCase();
    const content = (note?.content || '').toLowerCase();

    return (
        title.includes(query) ||
        content.includes(query)
    );
};

export const filterNotes = (
    notes,
    { searchQuery = '', showFavorites = false } = {},
) => {
    return notes.filter(note => {
        if (showFavorites && !note.isFavorite) {
            return false;
        }

        return matchesSearch(note, searchQuery);
    });
};

const compareDatesDescending = (
    firstDate,
    secondDate,
) => {
    const first = new Date(firstDate || 0).getTime();
    const second = new Date(secondDate || 0).getTime();

    return second - first;
};

const compareTitlesAscending = (first, second) => {
    return getNoteTitle(first).localeCompare(
        getNoteTitle(second),
        undefined,
        {
            sensitivity: 'base',
        },
    );
};

const compareTitlesDescending = (first, second) => {
    return getNoteTitle(second).localeCompare(
        getNoteTitle(first),
        undefined,
        {
            sensitivity: 'base',
        },
    );
};

export const sortNotes = (
    notes,
    sortOption = SORT_OPTIONS.RECENTLY_UPDATED,
) => {
    const sortedNotes = [...notes];

    switch (sortOption) {
        case SORT_OPTIONS.RECENTLY_CREATED:
            return sortedNotes.sort((a, b) =>
                compareDatesDescending(
                    a.createdAt,
                    b.createdAt,
                ),
            );

        case SORT_OPTIONS.ALPHABETICAL:
            return sortedNotes.sort(
                compareTitlesAscending,
            );

        case SORT_OPTIONS.REVERSE_ALPHABETICAL:
            return sortedNotes.sort(
                compareTitlesDescending,
            );

        case SORT_OPTIONS.RECENTLY_UPDATED:
        default:
            return sortedNotes.sort((a, b) =>
                compareDatesDescending(
                    a.updatedAt || a.createdAt,
                    b.updatedAt || b.createdAt,
                ),
            );
    }
};

export const applyPinPriority = notes => {
    const pinnedNotes = notes.filter(
        note => note.isPinned,
    );

    const unpinnedNotes = notes.filter(
        note => !note.isPinned,
    );

    return [...pinnedNotes, ...unpinnedNotes];
};

export const getDisplayedNotes = (
    notes,
    {
        searchQuery = '',
        showFavorites = false,
        sortOption = SORT_OPTIONS.RECENTLY_UPDATED,
    } = {},
) => {
    const filteredNotes = filterNotes(notes, {
        searchQuery,
        showFavorites,
    });

    const sortedNotes = sortNotes(
        filteredNotes,
        sortOption,
    );

    // Pin priority exists only in All Notes.
    if (showFavorites) {
        return sortedNotes;
    }

    return applyPinPriority(sortedNotes);
};

export const getSortLabel = sortOption => {
    switch (sortOption) {
        case SORT_OPTIONS.RECENTLY_CREATED:
            return 'Recently Created';

        case SORT_OPTIONS.ALPHABETICAL:
            return 'A → Z';

        case SORT_OPTIONS.REVERSE_ALPHABETICAL:
            return 'Z → A';

        case SORT_OPTIONS.RECENTLY_UPDATED:
        default:
            return 'Recently Updated';
    }
};

export const getResultLabel = (
    count,
    singular,
    plural,
) => {
    return `${count} ${count === 1 ? singular : plural
        }`;
};