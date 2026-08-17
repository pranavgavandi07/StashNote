import React from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import HighlightedText from './HighlightedText';

import {
    formatRelativeNoteDate,
    getNoteCategory,
    getNoteDate,
    getNoteTitle,
} from '../utils/noteHelpers';

const NoteCard = ({
    note,
    searchQuery = '',
    onPress,
    showOtherNotesDivider = false,
}) => {
    const title = getNoteTitle(note);
    const category = getNoteCategory(note);

    const date = formatRelativeNoteDate(
        getNoteDate(note),
    );

    const content = note?.content?.trim() || '';

    const hasIndicators =
        note?.isPinned || note?.isFavorite;

    return (
        <View>
            {showOtherNotesDivider && (
                <View style={styles.pinnedDivider}>
                    <View style={styles.pinnedDividerLine} />

                    <Text style={styles.pinnedDividerText}>
                        Other Notes
                    </Text>

                    <View style={styles.pinnedDividerLine} />
                </View>
            )}

            <Pressable
                style={({ pressed }) => [
                    styles.noteCard,
                    pressed && styles.noteCardPressed,
                ]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`Open note: ${title}`}>
                <View style={styles.noteTitleRow}>
                    <HighlightedText
                        text={title}
                        query={searchQuery}
                        style={styles.noteTitle}
                        numberOfLines={1}
                        highlightedStyle={
                            styles.highlightedText
                        }
                    />

                    {hasIndicators && (
                        <View style={styles.noteIndicators}>
                            {note?.isPinned && (
                                <Text
                                    style={[
                                        styles.pinIndicator,
                                        note?.isFavorite &&
                                        styles.indicatorSpacing,
                                    ]}>
                                    📌
                                </Text>
                            )}

                            {note?.isFavorite && (
                                <Text
                                    style={styles.favoriteStar}>
                                    ★
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {content ? (
                    <HighlightedText
                        text={content}
                        query={searchQuery}
                        style={styles.noteContent}
                        numberOfLines={3}
                        highlightedStyle={
                            styles.highlightedText
                        }
                    />
                ) : (
                    <Text style={styles.emptyContent}>
                        No content
                    </Text>
                )}

                <View style={styles.noteFooter}>
                    <Text style={styles.categoryText}>
                        {category}
                    </Text>

                    {date ? (
                        <Text style={styles.noteDate}>
                            {date}
                        </Text>
                    ) : null}
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    pinnedDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 12,
    },

    pinnedDividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E0',
    },

    pinnedDividerText: {
        marginHorizontal: 10,
        fontSize: 11,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },

    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E8E8E5',
    },

    noteCardPressed: {
        opacity: 0.7,
        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    noteTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    noteTitle: {
        flex: 1,
        fontSize: 19,
        fontWeight: '700',
        color: '#171717',
        marginBottom: 8,
    },

    noteIndicators: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },

    indicatorSpacing: {
        marginRight: 6,
    },

    pinIndicator: {
        fontSize: 15,
    },

    favoriteStar: {
        fontSize: 18,
        color: '#171717',
    },

    highlightedText: {
        backgroundColor: '#E8E8E5',
        fontWeight: '800',
        color: '#171717',
    },

    noteContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#5F5F5F',
    },

    emptyContent: {
        fontSize: 15,
        color: '#999',
        fontStyle: 'italic',
    },

    noteFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        backgroundColor: '#F0F0EE',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
    },

    noteDate: {
        fontSize: 12,
        color: '#999',
    },
});

export default NoteCard;