/**
 * CrowdEase Root Navigator
 * Hlavní navigace aplikace - přepíná mezi Auth a Main
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { PromotionDetailScreen } from '../screens/PromotionDetailScreen';
import { colors, typography } from '../theme';

// Placeholder pro business detail (zatím)
const BusinessDetailScreen = ({ route }: any) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Detail podniku</Text>
    <Text style={styles.placeholderSubtext}>ID: {route.params?.businessId}</Text>
  </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isAuthenticated?: boolean;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({
  isAuthenticated = false,
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="PromotionDetail"
            component={PromotionDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Detail akce',
              headerStyle: { backgroundColor: colors.light.background },
              headerTintColor: colors.text.primary,
            }}
          />
          <Stack.Screen
            name="BusinessDetail"
            component={BusinessDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Detail podniku',
              headerStyle: { backgroundColor: colors.light.background },
              headerTintColor: colors.text.primary,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
  },
  placeholderText: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 8,
  },
  placeholderSubtext: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

