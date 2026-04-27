/**
 * CrowdEase Root Navigator
 * Hlavní navigace aplikace - přepíná mezi Auth a Main
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { PromotionDetailScreen } from '../screens/PromotionDetailScreen';
import { BusinessDetailScreen } from '../screens/BusinessDetailScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { colors } from '../theme';

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
          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{
              headerShown: true,
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



