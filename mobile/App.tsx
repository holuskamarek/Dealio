/**
 * CrowdEase App
 * Hlavní vstupní bod aplikace
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { AuthProvider, useAuth } from './src/context';
import { colors } from './src/theme';

// Vnitřní komponenta která má přístup k AuthContext
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Zobrazit loading při kontrole tokenu
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <>
      <RootNavigator isAuthenticated={isAuthenticated} />
      <StatusBar style={isAuthenticated ? 'dark' : 'light'} />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
});
