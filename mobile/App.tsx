/**
 * CrowdEase App
 * Hlavní vstupní bod aplikace
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator isAuthenticated={isAuthenticated} />
        <StatusBar style={isAuthenticated ? 'dark' : 'light'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
