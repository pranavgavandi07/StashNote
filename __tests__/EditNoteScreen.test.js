import React from 'react';
import { Alert } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import EditNoteScreen from '../src/screens/EditNoteScreen';
import { updateNote } from '../src/storage/noteStorage';

jest.mock('../src/storage/noteStorage', () => ({
    updateNote: jest.fn(),
}));

const mockNavigation = {
    goBack: jest.fn(),
    popTo: jest.fn(),
};

const mockNote = {
    id: 'note-1',
    title: 'Original title',
    content: 'Original content',
    category: 'Personal',
    createdAt: '2026-08-19T10:00:00.000Z',
    updatedAt: '2026-08-19T10:00:00.000Z',
    isFavorite: false,
    isPinned: false,
};

const createScreen = async () => {
    let tree;

    await act(async () => {
        tree = renderer.create(
            <EditNoteScreen
                route={{ params: { note: mockNote } }}
                navigation={mockNavigation}
            />,
        );
    });

    return tree;
};

const getCategoryButton = (tree, category) => {
    const categoryText = tree.root.find(
        node =>
            node.type === 'Text' &&
            node.children.includes(category),
    );

    let currentNode = categoryText;

    while (
        currentNode &&
        typeof currentNode.props.onPress !== 'function'
    ) {
        currentNode = currentNode.parent;
    }

    return currentNode;
};

const getSaveButton = tree =>
    tree.root.find(
        node =>
            typeof node.props.onPress === 'function' &&
            node.findAll(
                child =>
                    child.type === 'Text' &&
                    child.children.includes('Save Changes'),
            ).length > 0,
    );

beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(Alert, 'alert').mockImplementation(
        jest.fn(),
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('EditNoteScreen', () => {
    it('renders the existing note values', async () => {
        const tree = await createScreen();

        const titleInput = tree.root.find(
            node =>
                node.props.placeholder === 'Note title',
        );

        const contentInput = tree.root.find(
            node =>
                node.props.placeholder === 'Start writing...',
        );

        expect(titleInput.props.value).toBe(
            'Original title',
        );

        expect(contentInput.props.value).toBe(
            'Original content',
        );
    });

    it('allows the title and content to be edited', async () => {
        const tree = await createScreen();

        const titleInput = tree.root.find(
            node =>
                node.props.placeholder === 'Note title',
        );

        const contentInput = tree.root.find(
            node =>
                node.props.placeholder === 'Start writing...',
        );

        await act(async () => {
            titleInput.props.onChangeText('Updated title');
            contentInput.props.onChangeText(
                'Updated content',
            );
        });

        const updatedTitleInput = tree.root.find(
            node =>
                node.props.placeholder === 'Note title',
        );

        const updatedContentInput = tree.root.find(
            node =>
                node.props.placeholder === 'Start writing...',
        );

        expect(updatedTitleInput.props.value).toBe(
            'Updated title',
        );

        expect(updatedContentInput.props.value).toBe(
            'Updated content',
        );
    });

    it('allows the category to be changed', async () => {
        const tree = await createScreen();

        const workCategoryButton = getCategoryButton(
            tree,
            'Work',
        );

        expect(workCategoryButton).toBeTruthy();

        await act(async () => {
            workCategoryButton.props.onPress();
        });

        const updatedWorkCategoryButton =
            getCategoryButton(tree, 'Work');

        const styles =
            updatedWorkCategoryButton.props.style({
                pressed: false,
            });

        expect(styles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    backgroundColor: '#171717',
                }),
            ]),
        );
    });

    it('saves the updated note and returns to NoteDetail', async () => {
        updateNote.mockResolvedValue();

        const tree = await createScreen();

        const titleInput = tree.root.find(
            node =>
                node.props.placeholder === 'Note title',
        );

        const contentInput = tree.root.find(
            node =>
                node.props.placeholder === 'Start writing...',
        );

        await act(async () => {
            titleInput.props.onChangeText('Updated title');
            contentInput.props.onChangeText(
                'Updated content',
            );
        });

        const workCategoryButton = getCategoryButton(
            tree,
            'Work',
        );

        await act(async () => {
            workCategoryButton.props.onPress();
        });

        const saveButton = getSaveButton(tree);

        await act(async () => {
            await saveButton.props.onPress();
        });

        expect(updateNote).toHaveBeenCalledTimes(1);

        expect(updateNote).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'note-1',
                title: 'Updated title',
                content: 'Updated content',
                category: 'Work',
                isFavorite: false,
                isPinned: false,
            }),
        );

        expect(mockNavigation.popTo).toHaveBeenCalledWith(
            'NoteDetail',
            expect.objectContaining({
                note: expect.objectContaining({
                    id: 'note-1',
                    title: 'Updated title',
                    content: 'Updated content',
                    category: 'Work',
                }),
            }),
        );
    });

    it('does not save an empty note and shows a validation alert', async () => {
        const tree = await createScreen();

        const titleInput = tree.root.find(
            node =>
                node.props.placeholder === 'Note title',
        );

        const contentInput = tree.root.find(
            node =>
                node.props.placeholder === 'Start writing...',
        );

        await act(async () => {
            titleInput.props.onChangeText('');
            contentInput.props.onChangeText('');
        });

        const saveButton = getSaveButton(tree);

        await act(async () => {
            await saveButton.props.onPress();
        });

        expect(updateNote).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalled();
    });
});