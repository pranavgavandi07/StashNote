export const NOTE_CATEGORIES = [
    'Personal',
    'Work',
    'Important',
    'Ideas',
];

export const CATEGORIES = [
    'All',
    ...NOTE_CATEGORIES,
];

export const SORT_OPTIONS = {
    RECENTLY_UPDATED: 'recentlyUpdated',
    RECENTLY_CREATED: 'recentlyCreated',
    ALPHABETICAL: 'alphabetical',
    REVERSE_ALPHABETICAL: 'reverseAlphabetical',
};

/*
 * Returns a safe display title for a note.
 */
export const getNoteTitle = note =>
    note?.title?.trim() || 'Untitled Note';

/*
 * Returns the best available date for a note.
 */
export const getNoteDate = note =>
    note?.updatedAt || note?.createdAt || null;

/*
 * Returns a safe category for a note.
 */
export const getNoteCategory = note => {
    const category = note?.category;

    if (NOTE_CATEGORIES.includes(category)) {
        return category;
    }

    return 'Personal';
};

/*
 * Formats a note date for display.
 */
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

/*
 * Formats a recent note date as a relative time.
 *
 * Examples:
 * - Just now
 * - 5 min ago
 * - 2 hours ago
 * - Yesterday
 *
 * Older dates use the normal note date format.
 */
export const formatRelativeNoteDate = dateString => {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const now = new Date();

    const differenceInMilliseconds =
        now.getTime() - date.getTime();

    /*
     * Prevent future timestamps from producing
     * incorrect negative values.
     */
    if (differenceInMilliseconds < 0) {
        return formatNoteDate(dateString);
    }

    const differenceInMinutes =
        Math.floor(
            differenceInMilliseconds / 60000,
        );

    if (differenceInMinutes < 1) {
        return 'Just now';
    }

    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} min ago`;
    }

    const differenceInHours =
        Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
        return differenceInHours === 1
            ? '1 hour ago'
            : `${differenceInHours} hours ago`;
    }

    /*
     * Check calendar days instead of only using
     * a 24-hour difference for "Yesterday".
     */
    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );

    const yesterday = new Date(today);
    yesterday.setDate(
        yesterday.getDate() - 1,
    );

    const noteDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    if (noteDay.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }

    return formatNoteDate(dateString);
};

/*
 * Checks whether a note matches the search query.
 *
 * Search works across:
 * - title
 * - content
 * - category
 */
export const matchesSearch = (
    note,
    searchQuery,
) => {
    const query = String(
        searchQuery ?? '',
    )
        .trim()
        .toLowerCase();

    if (!query) {
        return true;
    }

    const title = (
        note?.title || ''
    ).toLowerCase();

    const content = (
        note?.content || ''
    ).toLowerCase();

    const category = getNoteCategory(note)
        .toLowerCase();

    return (
        title.includes(query) ||
        content.includes(query) ||
        category.includes(query)
    );
};

/*
 * Filters notes by:
 * - search query
 * - favorites
 * - category
 */
export const filterNotes = (
    notes,
    {
        searchQuery = '',
        showFavorites = false,
        selectedCategory = 'All',
    } = {},
) => {
    const safeNotes = Array.isArray(notes)
        ? notes
        : [];

    return safeNotes.filter(note => {
        if (
            showFavorites &&
            !note.isFavorite
        ) {
            return false;
        }

        if (
            selectedCategory !== 'All' &&
            getNoteCategory(note) !==
            selectedCategory
        ) {
            return false;
        }

        return matchesSearch(
            note,
            searchQuery,
        );
    });
};

/*
 * Safely compares two dates.
 *
 * Newer dates come first.
 */
const compareDatesDescending = (
    firstDate,
    secondDate,
) => {
    const first = new Date(
        firstDate || 0,
    ).getTime();

    const second = new Date(
        secondDate || 0,
    ).getTime();

    return second - first;
};

/*
 * Alphabetical comparison.
 *
 * Case-insensitive.
 */
const compareTitlesAscending = (
    first,
    second,
) => {
    return getNoteTitle(first).localeCompare(
        getNoteTitle(second),
        undefined,
        {
            sensitivity: 'base',
        },
    );
};

/*
 * Reverse alphabetical comparison.
 */
const compareTitlesDescending = (
    first,
    second,
) => {
    return getNoteTitle(second).localeCompare(
        getNoteTitle(first),
        undefined,
        {
            sensitivity: 'base',
        },
    );
};

/*
 * Sorts notes according to the selected
 * sort option.
 */
export const sortNotes = (
    notes,
    sortOption = SORT_OPTIONS.RECENTLY_UPDATED,
) => {
    const safeNotes = Array.isArray(notes)
        ? notes
        : [];

    const sortedNotes = [...safeNotes];

    switch (sortOption) {
        case SORT_OPTIONS.RECENTLY_CREATED:
            return sortedNotes.sort(
                (a, b) =>
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
            return sortedNotes.sort(
                (a, b) =>
                    compareDatesDescending(
                        a.updatedAt ||
                        a.createdAt,
                        b.updatedAt ||
                        b.createdAt,
                    ),
            );
    }
};

/*
 * Moves pinned notes before unpinned notes.
 */
export const applyPinPriority = notes => {
    const safeNotes = Array.isArray(notes)
        ? notes
        : [];

    const pinnedNotes = safeNotes.filter(
        note => note.isPinned,
    );

    const unpinnedNotes = safeNotes.filter(
        note => !note.isPinned,
    );

    return [
        ...pinnedNotes,
        ...unpinnedNotes,
    ];
};

/*
 * Determines the final list shown
 * on HomeScreen.
 *
 * Processing order:
 *
 * 1. Favorites filter
 * 2. Category filter
 * 3. Search filter
 * 4. Sort
 * 5. Pin priority
 */
export const getDisplayedNotes = (
    notes,
    {
        searchQuery = '',
        showFavorites = false,
        selectedCategory = 'All',
        sortOption =
        SORT_OPTIONS.RECENTLY_UPDATED,
    } = {},
) => {
    const filteredNotes = filterNotes(
        notes,
        {
            searchQuery,
            showFavorites,
            selectedCategory,
        },
    );

    const sortedNotes = sortNotes(
        filteredNotes,
        sortOption,
    );

    const isAlphabeticalSort =
        sortOption ===
        SORT_OPTIONS.ALPHABETICAL ||
        sortOption ===
        SORT_OPTIONS.REVERSE_ALPHABETICAL;

    /*
     * Pinned notes get priority for normal
     * chronological views.
     *
     * Alphabetical sorting remains purely
     * alphabetical.
     */
    if (
        !isAlphabeticalSort &&
        !showFavorites &&
        selectedCategory === 'All'
    ) {
        return applyPinPriority(
            sortedNotes,
        );
    }

    return sortedNotes;
};

/*
 * Returns the readable label for the
 * current sorting option.
 */
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

/*
 * Creates a simple result/count label.
 */
export const getResultLabel = (
    count,
    singular,
    plural,
) => {
    return `${count} ${count === 1 ? singular : plural
        }`;
};