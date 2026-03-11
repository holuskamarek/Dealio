/**
 * CrowdEase Home Screen
 * Seznam aktuálních akcí seskupených po kategoriích
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Search } from 'lucide-react-native';
import { promotionsApi, savedPromotionsApi, Promotion } from '../api';
import { PromotionCard } from '../components';
import { colors, typography, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

/**
 * Mapování business type → kategorie pro zobrazení
 */
const CATEGORY_MAP: Record<string, string> = {
  'kavárna': 'Káva',
  'cukrárna': 'Sladkosti',
  'bistro': 'Jídlo',
  'restaurace': 'Jídlo',
  'bar': 'Nápoje',
  'jiné': 'Ostatní',
};

interface CategorySection {
  category: string;
  promotions: Promotion[];
}

/**
 * Seskupit akce podle kategorie (business type)
 */
const groupByCategory = (promotions: Promotion[]): CategorySection[] => {
  const groups: Record<string, Promotion[]> = {};

  promotions.forEach((promo) => {
    const type = promo.business?.type || 'jiné';
    const category = CATEGORY_MAP[type] || 'Ostatní';
    if (!groups[category]) groups[category] = [];
    groups[category].push(promo);
  });

  // Seřaď kategorie - Káva první, pak Jídlo, pak zbytek
  const order = ['Káva', 'Jídlo', 'Sladkosti', 'Nápoje', 'Ostatní'];
  return order
    .filter((cat) => groups[cat]?.length > 0)
    .map((cat) => ({ category: cat, promotions: groups[cat] }));
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [savedPromotionIds, setSavedPromotionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => groupByCategory(promotions), [promotions]);

  useEffect(() => {
    loadData();
  }, []);

  // Reload ulozenych akci pri kazdem fokusu )
  useFocusEffect(
    useCallback(() => {
      reloadSavedIds();
    }, [])
  );

  const loadData = async () => {
    try {
      setError(null);
      // Nacti akce a ulozene akce paralelne
      const [promotionsRes, savedIds] = await Promise.all([
        promotionsApi.getPromotions(),
        savedPromotionsApi.getSavedPromotionIds().catch(() => []),
      ]);
      setPromotions(promotionsRes.data);
      setSavedPromotionIds(new Set(savedIds));
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst akce');
    } finally {
      setIsLoading(false);
    }
  };

  const reloadSavedIds = async () => {
    try {
      const savedIds = await savedPromotionsApi.getSavedPromotionIds();
      setSavedPromotionIds(new Set(savedIds));
    } catch {
      // Tichy fail - data uz mame z loadData
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setError(null);
      const [promotionsRes, savedIds] = await Promise.all([
        promotionsApi.getPromotions(),
        savedPromotionsApi.getSavedPromotionIds().catch(() => []),
      ]);
      setPromotions(promotionsRes.data);
      setSavedPromotionIds(new Set(savedIds));
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst akce');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleToggleSave = useCallback(async (promotionId: string) => {
    const isCurrentlySaved = savedPromotionIds.has(promotionId);

    // Optimisticky update
    setSavedPromotionIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(promotionId);
      } else {
        next.add(promotionId);
      }
      return next;
    });

    try {
      await savedPromotionsApi.toggleSave(promotionId, isCurrentlySaved);
    } catch (err) {
      // Revert pri chybe
      setSavedPromotionIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(promotionId);
        } else {
          next.delete(promotionId);
        }
        return next;
      });
    }
  }, [savedPromotionIds]);

  const handlePromotionPress = (promotion: Promotion) => {
    navigation.navigate('PromotionDetail', { promotionId: promotion.id });
  };

  // Loading stav
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // Error stav
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadData}>
          <Text style={styles.retryText}>Zkusit znovu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary.main}
          colors={[colors.primary.main]}
        />
      }
    >
      {/* Header*/}
      <View style={styles.headerRow}>
        <View style={styles.locationRow}>
          <MapPin size={18} color={colors.primary.main} />
          <Text style={styles.locationText}>Brno</Text>
        </View>
        <TouchableOpacity>
          <Search size={22} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Hlavní nadpis */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Nejbližší nabídky v okolí</Text>
        <Text style={styles.mainSubtitle}>
          Exkluzivní slevy, oblíbené podniky.
        </Text>
      </View>

      {/* Kategorie s horizontálním scrollem */}
      {categories.map((section) => (
        <View key={section.category} style={styles.categorySection}>
          {/* Hlavička kategorie */}
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{section.category}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontální scroll karet */}
          <FlatList
            data={section.promotions}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardRow}
            renderItem={({ item }) => (
              <PromotionCard
                promotion={item}
                onPress={handlePromotionPress}
                isSaved={savedPromotionIds.has(item.id)}
                onToggleSave={handleToggleSave}
              />
            )}
          />
        </View>
      ))}

      {/* Prázdný stav */}
      {categories.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Žádné akce k dispozici</Text>
          <Text style={styles.emptySubtext}>
            Zkus to později nebo scrollni dolů pro obnovení
          </Text>
        </View>
      )}

      {/* Spodní padding */}
      <View style={{ height: spacing.xl }} />
    </ScrollView>
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

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    ...typography.callout,
    color: colors.text.primary,
    fontWeight: '600',
  },

  // Hlavní nadpis
  titleSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  mainTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  mainSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },

  // Kategorie
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  seeAll: {
    ...typography.callout,
    color: colors.primary.main,
    fontWeight: '600',
  },
  cardRow: {
    paddingHorizontal: spacing.md,
  },

  // Prázdný stav
  empty: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Error
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

export default HomeScreen;

