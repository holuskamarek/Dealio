/**
 * CrowdEase Auth Navigator
 * Stack navigace pro Login a Register obrazovky
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onAuthenticated?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark.background },
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} onRegister={onAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

