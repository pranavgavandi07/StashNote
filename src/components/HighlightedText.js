import React from 'react';

import { Text } from 'react-native';

const HighlightedText = ({
    text = '',
    query = '',
    style,
    numberOfLines,
    highlightedStyle,
}) => {
    const value = String(text ?? '');

    const searchQuery =
        String(query ?? '').trim();

    /*
     * No search query:
     * render the text normally.
     */
    if (!searchQuery) {
        return (
            <Text
                style={style}
                numberOfLines={numberOfLines}>
                {value}
            </Text>
        );
    }

    /*
     * Escape special RegExp characters so that
     * searches such as "C++" or "(test)" work safely.
     */
    const escapedQuery = searchQuery.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
    );

    const parts = value.split(
        new RegExp(`(${escapedQuery})`, 'gi'),
    );

    const normalizedQuery =
        searchQuery.toLowerCase();

    return (
        <Text
            style={style}
            numberOfLines={numberOfLines}>
            {parts.map((part, index) => {
                if (!part) {
                    return null;
                }

                const isMatch =
                    part.toLowerCase() ===
                    normalizedQuery;

                return (
                    <Text
                        key={`${index}-${part}`}
                        style={
                            isMatch
                                ? highlightedStyle
                                : undefined
                        }>
                        {part}
                    </Text>
                );
            })}
        </Text>
    );
};

export default HighlightedText;