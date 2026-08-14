import React from 'react';
import { Text } from 'react-native';

const HighlightedText = ({
    text = '',
    query = '',
    style,
    numberOfLines,
    highlightedStyle,
}) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return (
            <Text
                style={style}
                numberOfLines={numberOfLines}>
                {text}
            </Text>
        );
    }

    const escapedQuery = trimmedQuery.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
    );

    const parts = text.split(
        new RegExp(`(${escapedQuery})`, 'gi'),
    );

    return (
        <Text
            style={style}
            numberOfLines={numberOfLines}>
            {parts.map((part, index) => {
                const isMatch =
                    part.toLowerCase() ===
                    trimmedQuery.toLowerCase();

                return (
                    <Text
                        key={`${part}-${index}`}
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