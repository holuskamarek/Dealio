/**
 * CrowdEase Spacing System
 */

// Spacing values z design systému (v px)
export const spacing = {
  none: 0,
  xs: 4,        // 4px
  sm: 8,        // 8px
  md: 16,       // 16px
  lg: 24,       // 24px
  xl: 32,       // 32px
  '2xl': 48,    // 48px
  '3xl': 64,    // 64px
};

// Corner radius 
export const borderRadius = {
  none: 0,
  sm: 8,        // Malé prvky
  md: 16,       // Střední prvky
  lg: 24,       // Cards, Modals, Pop-ups
  full: 999,    // Buttons, Input Fields (pill shape)
};

export const layout = {
  // Padding obrazovky
  screenPaddingHorizontal: spacing.md,  // 16px
  screenPaddingVertical: spacing.md,    // 16px

  // Padding karet
  cardPadding: spacing.md,              // 16px
  cardPaddingSmall: spacing.sm,         // 8px

  // Mezery mezi prvky
  sectionGap: spacing.lg,               // 24px mezi sekcemi
  itemGap: spacing.md,                  // 16px mezi položkami
  elementGap: spacing.sm,               // 8px mezi malými prvky

  // Border radius shortcuts
  borderRadius,

  // Velikosti prvků
  buttonHeight: 52,                     // Výška tlačítek
  inputHeight: 52,                      // Výška input polí
  tabBarHeight: 60,                     // Tab bar
  headerHeight: 56,                     // Header

  // Velikosti avatarů
  avatarSm: 40,
  avatarMd: 60,
  avatarLg: 80,
  avatarXl: 100,

  // Velikosti ikon (Nav Bar icons)
  iconSm: 20,
  iconMd: 24,
  iconLg: 28,
  iconXl: 32,
};

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Layout = typeof layout;

