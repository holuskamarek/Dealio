/**
 * CrowdEase Login Screen
 * Dark mode design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mail, Lock } from 'lucide-react-native';
import { AuthStackParamList } from '../navigation/types';
import { Input, Button } from '../components';
import { colors, typography, spacing } from '../theme';
import { useAuth } from '../context';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const iconColor = colors.dark.textSecondary;
  const iconSize = 22;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Chyba', 'Vyplň email a heslo');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Chyba přihlášení', error.message || 'Něco se pokazilo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Udelat zapomenuty heslo Screen
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/CrowdEase_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>CrowdEase</Text>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Log in and discover the best deals.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            variant="dark"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={iconSize} color={iconColor} />}
            style={styles.input}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            variant="dark"
            secureTextEntry
            leftIcon={<Lock size={iconSize} color={iconColor} />}
            style={styles.input}
          />

          <Button
            title="Log in"
            onPress={handleLogin}
            variant="primary"
            loading={isLoading}
            style={styles.button}
          />

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account yet?{' '}
            <Text style={styles.footerLink} onPress={handleSignUp}>
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  brandName: {
    ...typography.h3,
    color: colors.dark.text,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  forgotPasswordText: {
    ...typography.callout,
    color: colors.text.link,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  footerText: {
    ...typography.callout,
    color: colors.dark.textSecondary,
  },
  footerLink: {
    color: colors.text.link,
    fontWeight: '600',
  },
});

export default LoginScreen;

