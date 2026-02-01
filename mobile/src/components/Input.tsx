/**
 * CrowdEase Input Component
 * Pro dark theme (Login/Register) i light theme
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, layout } from '../theme';

type InputVariant = 'dark' | 'light';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: InputVariant;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  label?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  variant = 'dark',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  label,
  style,
  inputStyle,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDark = variant === 'dark';

  const containerStyle: ViewStyle = {
    backgroundColor: isDark ? colors.dark.inputBackground : colors.light.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: error
      ? colors.status.error
      : isFocused
      ? colors.primary.main
      : isDark
      ? colors.dark.inputBorder
      : colors.border.light,
    height: layout.inputHeight,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  };

  const textInputStyle: TextStyle = {
    ...typography.input,
    flex: 1,
    color: isDark ? colors.dark.text : colors.text.primary,
    height: '100%',
  };

  const placeholderColor = isDark ? colors.dark.textSecondary : colors.text.tertiary;

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            ...typography.caption,
            color: isDark ? colors.dark.text : colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      )}
      <View style={containerStyle}>
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPasswordVisible ? (
              <EyeOff size={layout.iconMd} color={placeholderColor} />
            ) : (
              <Eye size={layout.iconMd} color={placeholderColor} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            ...typography.caption,
            color: colors.status.error,
            marginTop: spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;

