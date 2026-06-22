import { useState, useEffect } from 'react';
import {
    MOVIE_CARD_WIDTH,
    MOVIE_CARD_HEIGHT,
    MOVIE_CARD_MARGIN,
    MOVIE_CARD_MIN_SCALE,
    MOVIE_CARD_MAX_SCALE,
    MIN_GRID_ITEMS_PER_PAGE
} from '../Constant';

/** Computes columns, rows, and card scale so posters fill the available viewport. */
export function calculateResponsiveMovieGrid(listWidth, listHeight, options = {}) {
    const baseWidth = options.baseWidth ?? MOVIE_CARD_WIDTH;
    const baseHeight = options.baseHeight ?? MOVIE_CARD_HEIGHT;
    const margin = options.margin ?? MOVIE_CARD_MARGIN;
    const minScale = options.minScale ?? MOVIE_CARD_MIN_SCALE;
    const maxScale = options.maxScale ?? MOVIE_CARD_MAX_SCALE;

    const defaultGrid = {
        itemsPerPage: MIN_GRID_ITEMS_PER_PAGE,
        cols: 1,
        rows: 1,
        cardWidth: baseWidth,
        cardHeight: baseHeight,
        scale: 1
    };

    if (listWidth <= 0 || listHeight <= 0) {
        return defaultGrid;
    }

    const minCardWidth = baseWidth * minScale;
    const minCardHeight = baseHeight * minScale;

    const cols = Math.max(1, Math.floor(listWidth / (minCardWidth + margin * 2)));
    const rows = Math.max(1, Math.floor(listHeight / (minCardHeight + margin * 2)));

    const scaleW = (listWidth / cols - margin * 2) / baseWidth;
    const scaleH = (listHeight / rows - margin * 2) / baseHeight;
    // Scale uniformly so cards keep aspect ratio and stay within min/max bounds.
    const scale = Math.min(Math.max(Math.min(scaleW, scaleH), minScale), maxScale);

    return {
        itemsPerPage: cols * rows,
        cols,
        rows,
        cardWidth: baseWidth * scale,
        cardHeight: baseHeight * scale,
        scale
    };
}

export function useResponsiveMovieGrid(listRef) {
    const [grid, setGrid] = useState(() => calculateResponsiveMovieGrid(0, 0));

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) {
            return;
        }

        const update = () => {
            setGrid(calculateResponsiveMovieGrid(
                listElement.clientWidth,
                listElement.clientHeight
            ));
        };

        const observer = new ResizeObserver(update);
        observer.observe(listElement);
        update();

        return () => observer.disconnect();
    }, [listRef]);

    return grid;
}
