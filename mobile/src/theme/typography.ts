/**
 * CrowdEase Typography
 * Official Design System - SF Pro Display
 */

import { TextStyle, Platform } from 'react-native';

// Font family (SF Pro Display on iOS, Roboto on Android)
export const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// Font sizes z design systému
export const fontSizes = {
  xs: 11,       // Tiny
  sm: 13,       // Caption
  md: 15,       // Callout
  lg: 17,       // Body
  xl: 22,       // Heading 3
  '2xl': 28,    // Heading 2
  '3xl': 34,    // Heading 1 (Display)
};

// Font weights
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Line heights z design systému (v px)
export const lineHeights = {
  xs: 15,       // pro xs font
  sm: 18,       // Caption
  md: 20,       // Callout
  lg: 22,       // Body
  xl: 28,       // Heading 3
  '2xl': 34,    // Heading 2
  '3xl': 41,    // Heading 1
};

export const typography = {
  // Heading 1 - Main Page Titles (e.g., "Design System")
  // Size: 34px, Bold, Line Height: 41px
  h1: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['3xl'],
  } as TextStyle,

  // Heading 2 - Section Headers (e.g., "Color Palette")
  // Size: 28px, Semibold, Line Height: 34px
  h2: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['2xl'],
  } as TextStyle,

  // Heading 3 - Card Titles, Modal Headers
  // Size: 22px, Semibold, Line Height: 28px
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.xl,
  } as TextStyle,

  // Body - Standard paragraph text
  // Size: 17px, Regular, Line Height: 22px
  body: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.lg,
  } as TextStyle,

  // Callout - Button labels, Important data points
  // Size: 15px, Medium, Line Height: 20px
  callout: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.md,
  } as TextStyle,

  // Caption - Helper text, timestamps, hex codes
  // Size: 13px, Regular, Line Height: 18px
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.sm,
  } as TextStyle,

  // Tiny - Very small text
  // Size: 11px, Regular, Line Height: 15px
  tiny: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.xs,
  } as TextStyle,

  // Button text - based on Callout style
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.md,
  } as TextStyle,

  // Link text
  link: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.lg,
  } as TextStyle,

  // Input placeholder/value
  input: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.lg,
  } as TextStyle,
};

export type Typography = typeof typography;

