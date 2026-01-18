/**
 * CrowdEase Color Palette
 * Mnou vytvorenej Design System
 */

export const colors = {
  // Hlavni colors
  brand: {
    lightTeal: '#8CDCDB',     // Světlý teal
    teal: '#40B4C6',          // Hlavní teal
    blue: '#3265A7',          // Střední modrá
    navy: '#081639',          // Tmavě modrá (navy)
  },

  // Primary colors
  primary: {
    main: '#40B4C6',          // Teal - hlavní akční barva
    light: '#8CDCDB',         // Světlý teal
    dark: '#3265A7',          // Modrá
  },

  // Tmavé theme colors (Login a Register)
  dark: {
    background: '#081639',    // Navy - pozadí login
    surface: '#0D2147',       // Povrch karet v dark theme
    text: '#FFFFFF',          // Bílý text
    textSecondary: '#8CDCDB', // Světlý teal text
    inputBackground: '#0F2A52', // Pozadí input polí
    inputBorder: '#3265A7',   // Border input polí
  },

  // Svetle theme colors (App screens)
  light: {
    background: '#FFFFFF',    // Bílé pozadí
    surface: '#F5F7FA',       // Šedé pozadí (karty, sekce)
    card: '#FFFFFF',          // Bílé karty
  },

  // Text colors
  text: {
    primary: '#081639',       // Navy text (titulky)
    secondary: '#3265A7',     // Modrý text (popisky)
    tertiary: '#6B7B8A',      // Šedý text
    link: '#40B4C6',          // Teal text (odkazy)
    inverse: '#FFFFFF',       // Bílý text na tmavém pozadí
  },

  // Status colors
  status: {
    success: '#40B4C6',       // Teal 
    error: '#E53935',         // Červená - chyba, odhlášení
    warning: '#FF9800',       // Oranžová - varování
    info: '#3265A7',          // Modrá - info
  },

  // různé barvy pro fotky podniků
  cardPlaceholder: {
    yellow: '#FFF9C4',        // Žlutá
    green: '#C8E6C9',         // Zelená
    purple: '#E1BEE7',        // Fialová
    pink: '#F8BBD9',          // Růžová
    coral: '#FFCCBC',         // Korálová
    blue: '#BBDEFB',          // Modrá
  },

  // Border colors
  border: {
    light: '#E8EDF2',         // Světlý border
    medium: '#3265A7',        // Střední border (modrá)
    dark: '#081639',          // Tmavý border
  },

  // Shadow color
  shadow: 'rgba(8, 22, 57, 0.08)', // Navy shadow

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  // Tab bar
  tabBar: {
    active: '#40B4C6',        // Aktivní tab (teal)
    inactive: '#9BA5B7',      // Neaktivní tab (šedá)
    background: '#FFFFFF',    // Pozadí tab baru
  },
};

export type Colors = typeof colors;

