import { MIN_GRID_ITEMS_PER_PAGE } from '../Constant';
import { calculateResponsiveMovieGrid, useResponsiveMovieGrid } from './useResponsiveMovieGrid';

export function calculateMovieCardsPerPage(listWidth, listHeight) {
    return calculateResponsiveMovieGrid(listWidth, listHeight).itemsPerPage;
}

export function useMovieCardsPerPage(listRef) {
    return useResponsiveMovieGrid(listRef).itemsPerPage;
}

export { useResponsiveMovieGrid, calculateResponsiveMovieGrid };
