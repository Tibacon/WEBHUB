/**
 * Application-wide constants
 */

// LocalStorage keys
export const STORAGE_KEYS = {
  WIDGETS: 'webhub_widgets',
  THEME: 'webhub_theme',
  BACKGROUND: 'webhub_background'
}

// Widget configuration
export const WIDGET_TYPES = {
  CLOCK: 'clock',
  TODO: 'todo',
  NOTES: 'notes',
  WEATHER: 'weather',
  NEWS: 'news',
  CALENDAR: 'calendar',
  QUOTES: 'quotes',
  CRYPTO: 'crypto'
}

export const WIDGET_TITLES = {
  [WIDGET_TYPES.CLOCK]: 'Horloge',
  [WIDGET_TYPES.TODO]: 'To-Do List',
  [WIDGET_TYPES.NOTES]: 'Notes',
  [WIDGET_TYPES.WEATHER]: 'Météo',
  [WIDGET_TYPES.NEWS]: 'Actualités',
  [WIDGET_TYPES.CALENDAR]: 'Calendrier',
  [WIDGET_TYPES.QUOTES]: 'Citations',
  [WIDGET_TYPES.CRYPTO]: 'Crypto'
}

export const DEFAULT_WIDGET_SIZE = {
  width: 1,
  height: 1
}

export const WIDGET_SIZE_LIMITS = {
  MIN: 1,
  MAX: 4
}

// Grid configuration
export const GRID_CONFIG = {
  ROW_HEIGHT: 250,
  GAP: 16,
  COLUMNS: {
    DESKTOP: 4,
    TABLET: 3,
    MOBILE_LARGE: 2,
    MOBILE: 1
  }
}

// Time intervals
export const INTERVALS = {
  CLOCK_UPDATE: 1000, // 1 second
  WEATHER_REFRESH: 1800000 // 30 minutes
}

// Weather API
export const WEATHER_API = {
  BASE_URL: 'https://wttr.in',
  FORMAT: 'j1'
}

// Default preset backgrounds
export const PRESET_BACKGROUNDS = [
  {
    name: 'Montagne',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
  },
  {
    name: 'Océan',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80'
  },
  {
    name: 'Forêt',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80'
  },
  {
    name: 'Ville',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80'
  }
]
