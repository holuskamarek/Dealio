import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import { Button, Input } from './src/components';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>CrowdEase</Text>
        <Text style={styles.subtitle}>Component test</Text>

        {/* Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Components</Text>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            variant="dark"
            style={styles.input}
          />

          <Input
            placeholder="Heslo"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            variant="dark"
            style={styles.input}
          />
        </View>

        {/* Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Components</Text>

          <Button
            title="Přihlásit se"
            onPress={handleLogin}
            variant="primary"
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Registrovat"
            onPress={() => {}}
            variant="secondary"
            style={styles.button}
          />

          <Button
            title="Zapomenuté heslo?"
            onPress={() => {}}
            variant="text"
          />
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  title: {
    ...typography.h1,
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginBottom: spacing.md,
  },
});
