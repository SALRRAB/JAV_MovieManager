// Legacy fixed page sizes kept for name-tag viewers; movie/actor grids now compute per viewport.
export const NAME_TAG_EACH_PAGE = 63
export const MOVIE_CARD_EACH_PAGE_LARGE_SCREEN = 20
export const MOVIE_CARD_EACH_PAGE_SMALL_SCREEN = 4
export const ACTOR_CARD_EACH_PAG = 40

// Base card dimensions used by responsive grid scaling.
export const MOVIE_CARD_WIDTH = 190
export const MOVIE_CARD_HEIGHT = 300
export const MOVIE_CARD_MARGIN = 5
export const MOVIE_CARD_MIN_SCALE = 1
export const MOVIE_CARD_MAX_SCALE = 1.25
export const MOVIE_CARD_CELL_WIDTH = MOVIE_CARD_WIDTH + MOVIE_CARD_MARGIN * 2
export const MOVIE_CARD_CELL_HEIGHT = MOVIE_CARD_HEIGHT + MOVIE_CARD_MARGIN * 2

export const ACTOR_CARD_WIDTH = 190
export const ACTOR_CARD_HEIGHT = 250
export const ACTOR_CARD_MARGIN = 5
export const ACTOR_CARD_CELL_WIDTH = ACTOR_CARD_WIDTH + ACTOR_CARD_MARGIN * 2
export const ACTOR_CARD_CELL_HEIGHT = ACTOR_CARD_HEIGHT + ACTOR_CARD_MARGIN * 2

export const NAME_TAG_BUTTON_WIDTH = 250
export const NAME_TAG_BUTTON_HEIGHT = 60
export const NAME_TAG_BUTTON_MARGIN = 5
export const NAME_TAG_CELL_WIDTH = NAME_TAG_BUTTON_WIDTH + NAME_TAG_BUTTON_MARGIN * 2
export const NAME_TAG_CELL_HEIGHT = NAME_TAG_BUTTON_HEIGHT + NAME_TAG_BUTTON_MARGIN * 2

export const MIN_GRID_ITEMS_PER_PAGE = 1
export const MIN_MOVIE_CARDS_PER_PAGE = MIN_GRID_ITEMS_PER_PAGE