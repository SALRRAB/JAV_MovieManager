import { useState, useEffect } from 'react';

/** Returns how many fixed-size grid cells fit in the visible list area. */
export function calculateGridItemsPerPage(listWidth, listHeight, cellWidth, cellHeight, minItems = 1) {
    if (listWidth <= 0 || listHeight <= 0) {
        return minItems;
    }
    const cols = Math.max(1, Math.floor(listWidth / cellWidth));
    const rows = Math.max(1, Math.floor(listHeight / cellHeight));
    return cols * rows;
}

export function useGridItemsPerPage(listRef, cellWidth, cellHeight, minItems = 1) {
    const [itemsPerPage, setItemsPerPage] = useState(minItems);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) {
            return;
        }

        const update = () => {
            setItemsPerPage(
                calculateGridItemsPerPage(
                    listElement.clientWidth,
                    listElement.clientHeight,
                    cellWidth,
                    cellHeight,
                    minItems
                )
            );
        };

        const observer = new ResizeObserver(update);
        observer.observe(listElement);
        update();

        return () => observer.disconnect();
    }, [listRef, cellWidth, cellHeight, minItems]);

    return itemsPerPage;
}
