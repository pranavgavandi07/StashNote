import React from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import HighlightedText from './HighlightedText';

import {
    formatNoteDate,
    getNoteDate,
    getNoteTitle,
} from '../utils/noteHelpers';

const NoteCard = ({
    note,
    searchQuery = '',
    onPress,
    showOtherNotesDivider = false,
}) => {
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
                onPress={onPress}>
                <View style={styles.noteTitleRow}>
                    <HighlightedText
                        text={getNoteTitle(note)}
                        query={searchQuery}
                        style={styles.noteTitle}
                        numberOfLines={1}
                        highlightedStyle={
                            styles.highlightedText
                        }
                    />

                    <View style={styles.noteIndicators}>
                        {note.isPinned && (
                            <Text style={styles.pinIndicator}>
                                📌
                            </Text>
                        )}

                        {note.isFavorite && (
                            <Text style={styles.favoriteStar}>
                                ★
                            </Text>
                        )}
                    </View>
                </View>

                {note.content ? (
                    <HighlightedText
                        text={note.content}
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

                <Text style={styles.noteDate}>
                    {formatNoteDate(getNoteDate(note))}
                </Text>
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
        transform: [{ scale: 0.99 }],
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
        gap: 5,
    },

    pinIndicator: {
        fontSize: 15,
    },

    favoriteStar: {
        fontSize: 17,
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

    noteDate: {
        marginTop: 14,
        fontSize: 12,
        color: '#999',
    },
});

export default NoteCard;