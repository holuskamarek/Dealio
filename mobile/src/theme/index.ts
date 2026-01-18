/**
 * CrowdEase Theme
 * Official Design System Export
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography, fontSizes, fontWeights, lineHeights, fontFamily } from './typography';
import { spacing, borderRadius, layout } from './spacing';

export const theme = {
  colors,
  typography,
  fontSizes,
  fontWeights,
  lineHeights,
  fontFamily,
  spacing,
  borderRadius,
  layout,
};

export type Theme = typeof theme;

