/**
 * CrowdEase Category Screen
 * Vsechny akce v dane kategorii 
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { promotionsApi, savedPromotionsApi, Promotion } from '../api';
import { PromotionCard } from '../components';
import { colors, typography, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

const CATEGORY_MAP: Record<string, string> = {
  'kavárna': 'Káva',
  'cukrárna': 'Sladkosti',
  'bistro': 'Jídlo',
  'restaurace': 'Jídlo',
  'bar': 'Nápoje',
  'jiné': 'Ostatní',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoryRouteProp>();
  const { category } = route.params;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerTitle: category });
  }, [navigation, category]);

  const loadData = async () => {
    try {
      const [promoRes, ids] = await Promise.all([
        promotionsApi.getPromotions(),
        savedPromotionsApi.getSavedPromotionIds().catch(() => []),
      ]);
      const filtered = promoRes.data.filter((p) => {
        const type = p.business?.type || 'jiné';
        const cat = CATEGORY_MAP[type] || 'Ostatní';
        return cat === category;
      });
      setPromotions(filtered);
      setSavedIds(new Set(ids));
    } catch (err) {
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      savedPromotionsApi
        .getSavedPromotionIds()
        .then((ids) => setSavedIds(new Set(ids)))
        .catch(() => {});
    }, [])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleToggleSave = useCallback(async (promotionId: string) => {
    const isCurrentlySaved = savedIds.has(promotionId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(promotionId);
      else next.add(promotionId);
      return next;
    });
    try {
      await savedPromotionsApi.toggleSave(promotionId, isCurrentlySaved);
    } catch {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.add(promotionId);
        else next.delete(promotionId);
        return next;
      });
    }
  }, [savedIds]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={promotions}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => (
        <PromotionCard
          promotion={item}
          onPress={(p) => navigation.navigate('PromotionDetail', { promotionId: p.id })}
          isSaved={savedIds.has(item.id)}
          onToggleSave={handleToggleSave}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>V této kategorii zatím žádné akce nejsou</Text>
        </View>
      }
    />
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
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default CategoryScreen;
