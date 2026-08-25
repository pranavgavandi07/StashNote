import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: callback => callback(),
}));

jest.mock('../src/storage/noteStorage', () => ({
    getNotes: jest.fn(),
}));

jest.mock('react-native', () => {
    const ReactLib = require('react');

    const View = ({ children, ...props }) => (
        <div {...props}>{children}</div>
    );

    const Text = ({ children, ...props }) => (
        <span {...props}>{children}</span>
    );

    const Pressable = ({
        children,
        onPress,
        ...props
    }) => (
        <button
            {...props}
            onClick={onPress}>
            {typeof children === 'function'
                ? children({
                    pressed: false,
                })
                : children}
        </button>
    );

    const TextInput = ({
        value,
        onChangeText,
        placeholder,
        ...props
    }) => (
        <input
            {...props}
            value={value}
            placeholder={placeholder}
            onChange={event =>
                onChangeText(event.target.value)
            }
        />
    );

    const ScrollView = ({
        children,
        ...props
    }) => (
        <div {...props}>{children}</div>
    );

    const FlatList = ({
        data = [],
        renderItem,
        keyExtractor,
        ...props
    }) => (
        <div {...props}>
            {data.map((item, index) => (
                <ReactLib.Fragment
                    key={
                        keyExtractor
                            ? keyExtractor(item, index)
                            : index
                    }>
                    {renderItem({
                        item,
                        index,
                    })}
                </ReactLib.Fragment>
            ))}
        </div>
    );

    const StyleSheet = {
        create: styles => styles,
    };

    return {
        View,
        Text,
        Pressable,
        TextInput,
        ScrollView,
        FlatList,
        StyleSheet,
    };
});

import HomeScreen from '../src/screens/HomeScreen';
import { getNotes } from '../src/storage/noteStorage';

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
        .findAllByType('span')
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
                node.props.placeholder ===
                'Search notes...',
        );

        await act(async () => {
            searchInput.props.onChangeText(
                'groceries',
            );
        });

        const textValues = getTextValues(tree);

        expect(textValues).toContain('1 result');
    });
});