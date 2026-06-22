import { useState, useEffect } from 'react';

/** Keeps pagination slice in sync when item count or page size changes. */
export function useGridPagination(items, numEachPage) {
    const [currentPage, setCurrentPage] = useState(1);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(numEachPage);

    useEffect(() => {
        setCurrentPage(1);
        setMinValue(0);
        setMaxValue(numEachPage);
    }, [items]);

    useEffect(() => {
        setMinValue(prevMin => {
            const page = Math.floor(prevMin / numEachPage);
            const newMin = page * numEachPage;
            setMaxValue(newMin + numEachPage);
            setCurrentPage(page + 1);
            return newMin;
        });
    }, [numEachPage]);

    function handlePageChange(page) {
        setCurrentPage(page);
        setMinValue((page - 1) * numEachPage);
        setMaxValue(page * numEachPage);
    }

    return { currentPage, minValue, maxValue, handlePageChange };
}
