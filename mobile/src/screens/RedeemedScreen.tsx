/**
 * Dealio Redeemed Screen
 * Seznam uplatnenych akci 
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle, SlidersHorizontal, Search, Ticket } from 'lucide-react-native';
import { redemptionsApi, Redemption } from '../api';
import { colors, typography, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

const PLACEHOLDER_SIZE = 50;

// Barvy placeholderu podle typu podniku
const PLACEHOLDER_COLORS: Record<string, string> = {
  'kavárna': colors.cardPlaceholder.yellow,
  'bistro': colors.cardPlaceholder.green,
  'restaurace': colors.cardPlaceholder.coral,
  'bar': colors.cardPlaceholder.purple,
  'cukrárna': colors.cardPlaceholder.pink,
  'jiné': colors.cardPlaceholder.blue,
};

const getPlaceholderColor = (type?: string): string => {
  return PLACEHOLDER_COLORS[type || 'jiné'] || colors.cardPlaceholder.blue;
};

// Format data do "Uplatněno: 12.06.2025"
const formatUsedAt = (dateStr?: string): string => {
  if (!dateStr) return 'Uplatněno';
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `Uplatněno:\n${day}.${month}.${year}`;
};

/**
 * Karta uplatnene akce 
 */
const RedeemedCard: React.FC<{
  redemption: Redemption;
  onPress: (promotionId: string) => void;
}> = ({ redemption, onPress }) => {
  const promotion = redemption.promotion;
  if (!promotion) return null;

  const business = promotion.business;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(promotion.id)}
      activeOpacity={0.8}
    >
      {/* Placeholder obrazku - zasedly */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.fotoText}>Foto</Text>
      </View>

      {/* Info - nazev podniku + sleva */}
      <View style={styles.cardInfo}>
        <Text style={styles.businessName} numberOfLines={1}>
          {business?.name || 'Podnik'}
        </Text>
        <Text style={styles.promotionTitle} numberOfLines={1}>
          {promotion.title}
        </Text>
      </View>

      {/* Checkmark a datum */}
      <View style={styles.statusContainer}>
        <CheckCircle size={28} color="#4ADE80" fill="#4ADE80" />
        <Text style={styles.usedAtText}>
          {formatUsedAt(redemption.used_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const RedeemedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const tabNavigation = useNavigation<TabNavigationProp>();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reload pri kazdem fokusu na screen
  useFocusEffect(
    useCallback(() => {
      loadRedemptions();
    }, [])
  );

  const loadRedemptions = async () => {
    try {
      setError(null);
      const usedRedemptions = await redemptionsApi.getUsedRedemptions();
      setRedemptions(usedRedemptions);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst uplatněné akce');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setError(null);
      const usedRedemptions = await redemptionsApi.getUsedRedemptions();
      setRedemptions(usedRedemptions);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst uplatněné akce');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handlePromotionPress = (promotionId: string) => {
    navigation.navigate('PromotionDetail', { promotionId });
  };

  const handleDiscoverPress = () => {
    tabNavigation.navigate('Home');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadRedemptions}>
          <Text style={styles.retryText}>Zkusit znovu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixni header */}
      <View style={styles.header}>
        <Text style={styles.title}>Uplatněné nabídky</Text>
        <View style={styles.headerUnderline} />
      </View>

      {redemptions.length === 0 ? (
        <View style={styles.empty}>
          <Ticket size={80} color="#D1D5DB" />
          <Text style={styles.emptyText}>Zatím jste neuplatnili žádnou nabídku.</Text>
          <TouchableOpacity style={styles.discoverButton} onPress={handleDiscoverPress}>
            <Text style={styles.discoverButtonText}>Objevovat Nové Nabídky</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Filter a search row */}
          <View style={styles.toolbarRow}>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <SlidersHorizontal size={22} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Search size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={redemptions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary.main}
              />
            }
            renderItem={({ item }) => (
              <RedeemedCard
                redemption={item}
                onPress={handlePromotionPress}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    padding: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.sm,
    backgroundColor: colors.light.background,
    zIndex: 10,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    width: PLACEHOLDER_SIZE,
    height: PLACEHOLDER_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  fotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.3)',
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  businessName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  promotionTitle: {
    ...typography.callout,
    color: colors.text.primary,
    fontWeight: '600',
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  usedAtText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  discoverButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  discoverButtonText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryText: {
    ...typography.callout,
    color: colors.primary.main,
    fontWeight: '600',
  },
});

export default RedeemedScreen;

