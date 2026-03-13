/**
 * CrowdEase Profile Screen
 * Profil uzivatele 
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { User, Mail, LogOut, ChevronRight, Bell, Shield, CircleHelp } from 'lucide-react-native';
import { useAuth } from '../context';
import { colors, typography, spacing } from '../theme';

/**
 * Polozka menu v profilu
 */
const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}> = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemLabel, danger && styles.menuItemLabelDanger]}>
        {label}
      </Text>
    </View>
    <ChevronRight size={20} color={danger ? colors.status.error : colors.text.tertiary} />
  </TouchableOpacity>
);

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Odhlásit se',
      'Opravdu se chceš odhlásit?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Odhlásit',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Chyba', 'Nepodařilo se odhlásit');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleNotifications = () => {
    Alert.alert('Brzy', 'Nastavení notifikací bude brzy dostupné');
  };

  const handlePrivacy = () => {
    Alert.alert('Brzy', 'Nastavení soukromí bude brzy dostupné');
  };

  const handleHelp = () => {
    Alert.alert('Brzy', 'Nápověda bude brzy dostupná');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.headerUnderline} />
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <User size={40} color={colors.white} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Uživatel'}</Text>
          <View style={styles.emailRow}>
            <Mail size={14} color={colors.text.tertiary} />
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Nastavení</Text>
        
        <MenuItem
          icon={<Bell size={22} color={colors.text.secondary} />}
          label="Notifikace"
          onPress={handleNotifications}
        />
        
        <MenuItem
          icon={<Shield size={22} color={colors.text.secondary} />}
          label="Soukromí"
          onPress={handlePrivacy}
        />
        
        <MenuItem
          icon={<CircleHelp size={22} color={colors.text.secondary} />}
          label="Nápověda"
          onPress={handleHelp}
        />
      </View>

      {/* Logout Section */}
      <View style={styles.menuSection}>
        <MenuItem
          icon={<LogOut size={22} color={colors.status.error} />}
          label={isLoggingOut ? 'Odhlašování...' : 'Odhlásit se'}
          onPress={handleLogout}
          danger
        />
      </View>

      {/* App Version */}
      <Text style={styles.version}>CrowdEase v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userEmail: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  menuSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  menuItemLabelDanger: {
    color: colors.status.error,
  },
  version: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;

