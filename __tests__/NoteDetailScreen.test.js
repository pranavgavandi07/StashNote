import React from 'react';
import { Alert } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import NoteDetailScreen from '../src/screens/NoteDetailScreen';

import {
    deleteNote,
    getNotes,
    toggleFavorite,
    togglePinned,
} from '../src/storage/noteStorage';

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn(),
}));

jest.mock('../src/storage/noteStorage', () => ({
    deleteNote: jest.fn(),
    getNotes: jest.fn(),
    toggleFavorite: jest.fn(),
    togglePinned: jest.fn(),
}));

const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
    popToTop: jest.fn(),
};

const mockNote = {
    id: 'note-1',
    title: 'Test note',
    content: 'This is the note content.',
    category: 'Work',
    createdAt: '2026-08-19T10:00:00.000Z',
    updatedAt: '2026-08-19T12:00:00.000Z',
    isFavorite: false,
    isPinned: false,
};

const createScreen = async () => {
    getNotes.mockResolvedValue([mockNote]);

    let tree;

    await act(async () => {
        tree = renderer.create(
            <NoteDetailScreen
                route={{ params: { note: mockNote } }}
                navigation={mockNavigation}
            />,
        );
    });

    return tree;
};

const getButtonByText = (tree, text) => {
    const textNode = tree.root.find(
        node =>
            node.type === 'Text' &&
            node.children.includes(text),
    );

    let currentNode = textNode;

    while (
        currentNode &&
        typeof currentNode.props.onPress !== 'function'
    ) {
        currentNode = currentNode.parent;
    }

    return currentNode;
};

const getFavoriteButton = tree => {
    const favoriteText = tree.root.find(
        node =>
            node.type === 'Text' &&
            node.children.includes('☆'),
    );

    let currentNode = favoriteText;

    while (
        currentNode &&
        typeof currentNode.props.onPress !== 'function'
    ) {
        currentNode = currentNode.parent;
    }

    return currentNode;
};

const getPinButton = tree => {
    const pinTexts = tree.root.findAll(
        node =>
            node.type === 'Text' &&
            node.children.includes('📌'),
    );

    const pinText = pinTexts.find(node => {
        let currentNode = node;

        while (currentNode) {
            if (
                typeof currentNode.props.onPress ===
                'function'
            ) {
                return true;
            }

            currentNode = currentNode.parent;
        }

        return false;
    });

    let currentNode = pinText;

    while (
        currentNode &&
        typeof currentNode.props.onPress !== 'function'
    ) {
        currentNode = currentNode.parent;
    }

    return currentNode;
};

beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Alert, 'alert').mockImplementation(
        jest.fn(),
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('NoteDetailScreen', () => {
    it('renders the note details correctly', async () => {
        const tree = await createScreen();

        const textValues = tree.root
            .findAllByType('Text')
            .map(node => node.children.join(''));

        expect(textValues).toContain('Test note');
        expect(textValues).toContain(
            'This is the note content.',
        );
        expect(textValues).toContain('Work');
        expect(textValues).toContain('Edit Note');
        expect(textValues).toContain('Delete Note');
    });

    it('navigates to EditNote when Edit Note is pressed', async () => {
        const tree = await createScreen();

        const editButton = getButtonByText(
            tree,
            'Edit Note',
        );

        expect(editButton).toBeTruthy();

        await act(async () => {
            editButton.props.onPress();
        });

        expect(mockNavigation.navigate).toHaveBeenCalledWith(
            'EditNote',
            {
                note: mockNote,
            },
        );
    });

    it('toggles the note favorite status', async () => {
        const updatedFavoriteNote = {
            ...mockNote,
            isFavorite: true,
        };

        toggleFavorite.mockResolvedValue([
            updatedFavoriteNote,
        ]);

        const tree = await createScreen();

        const favoriteButton = getFavoriteButton(tree);

        expect(favoriteButton).toBeTruthy();

        await act(async () => {
            await favoriteButton.props.onPress();
        });

        expect(toggleFavorite).toHaveBeenCalledWith(
            'note-1',
        );

        const textValues = tree.root
            .findAllByType('Text')
            .map(node => node.children.join(''));

        expect(textValues).toContain('★');
        expect(textValues).not.toContain('☆');
    });

    it('toggles the note pinned status', async () => {
        const updatedPinnedNote = {
            ...mockNote,
            isPinned: true,
        };

        togglePinned.mockResolvedValue([
            updatedPinnedNote,
        ]);

        const tree = await createScreen();

        const pinButton = getPinButton(tree);

        expect(pinButton).toBeTruthy();

        await act(async () => {
            await pinButton.props.onPress();
        });

        expect(togglePinned).toHaveBeenCalledWith(
            'note-1',
        );

        const textValues = tree.root
            .findAllByType('Text')
            .map(node => node.children.join(''));

        expect(textValues).toContain('📌');
    });

    it('deletes the note after confirmation', async () => {
        deleteNote.mockResolvedValue();

        const tree = await createScreen();

        const deleteButton = getButtonByText(
            tree,
            'Delete Note',
        );

        expect(deleteButton).toBeTruthy();

        await act(async () => {
            deleteButton.props.onPress();
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Note',
            'Are you sure you want to delete this note?',
            expect.any(Array),
        );

        const alertButtons =
            Alert.alert.mock.calls[0][2];

        const confirmDeleteButton =
            alertButtons.find(
                button => button.text === 'Delete',
            );

        expect(confirmDeleteButton).toBeTruthy();

        await act(async () => {
            await confirmDeleteButton.onPress();
        });

        expect(deleteNote).toHaveBeenCalledWith(
            'note-1',
        );

        expect(mockNavigation.popToTop)
            .toHaveBeenCalledTimes(1);
    });
});