import React from 'react';
import renderer, { act } from 'react-test-renderer';

import HomeScreen from '../src/screens/HomeScreen';
import { getNotes } from '../src/storage/noteStorage';

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: callback => callback(),
}));

jest.mock('../src/storage/noteStorage', () => ({
    getNotes: jest.fn(),
}));

const mockNavigation = {
    navigate: jest.fn(),
};

const mockNotes = [
    {
        id: 'note-1',
        title: 'Work meeting',
        content: 'Prepare the project update.',
        category: 'Work',
        createdAt: '2026-08-19T10:00:00.000Z',
        updatedAt: '2026-08-19T10:00:00.000Z',
        isFavorite: false,
        isPinned: false,
    },
    {
        id: 'note-2',
        title: 'Buy groceries',
        content: 'Milk, bread and vegetables.',
        category: 'Personal',
        createdAt: '2026-08-18T10:00:00.000Z',
        updatedAt: '2026-08-18T10:00:00.000Z',
        isFavorite: true,
        isPinned: false,
    },
];

const createScreen = async () => {
    getNotes.mockResolvedValue(mockNotes);

    let tree;

    await act(async () => {
        tree = renderer.create(
            <HomeScreen navigation={mockNavigation} />,
        );

        await Promise.resolve();
    });

    return tree;
};

const getTextValues = tree =>
    tree.root
        .findAllByType('Text')
        .map(node => node.children.join(''));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('HomeScreen', () => {
    it('renders stored notes correctly', async () => {
        const tree = await createScreen();

        const textValues = getTextValues(tree);

        expect(textValues).toContain('Work meeting');
        expect(textValues).toContain('Buy groceries');
    });

    it('updates the result count when searching', async () => {
        const tree = await createScreen();

        const searchInput = tree.root.find(
            node =>
                node.props.placeholder === 'Search notes...',
        );

        await act(async () => {
            searchInput.props.onChangeText('groceries');
        });

        const textValues = getTextValues(tree);

        expect(textValues).toContain('1 result');
    });
});