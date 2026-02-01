/**
 * CrowdEase Button Component
 * Varianty: primary, secondary, text
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius, layout } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: layout.buttonHeight,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? colors.primary.light : colors.primary.main,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.transparent,
          borderWidth: 2,
          borderColor: isDisabled ? colors.primary.light : colors.primary.main,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: colors.transparent,
          height: 'auto' as any,
          paddingHorizontal: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...typography.button,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: colors.white,
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: isDisabled ? colors.primary.light : colors.primary.main,
        };
      case 'text':
        return {
          ...baseTextStyle,
          color: isDisabled ? colors.text.tertiary : colors.text.link,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary.main}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

