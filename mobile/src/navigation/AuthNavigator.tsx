/**
 * CrowdEase Auth Navigator
 * Stack navigace pro Login a Register obrazovky
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Placeholder screeny
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title}</Text>
    <Text style={styles.placeholderSubtext}>Bude implementováno</Text>
  </View>
);

const LoginScreen = () => <PlaceholderScreen title="Login" />;
const RegisterScreen = () => <PlaceholderScreen title="Register" />;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
  placeholderText: {
    ...typography.h1,
    color: colors.primary.main,
    marginBottom: 8,
  },
  placeholderSubtext: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
});

