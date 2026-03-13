/**
 * CrowdEase Favorites Screen
 * Seznam ulozenych akci
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, SlidersHorizontal, Search, X, ArrowUpDown } from 'lucide-react-native';
import { savedPromotionsApi, SavedPromotion } from '../api';
import { colors, typography, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { MainTabParamList } from '../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Typy řazení
type SortOption = 'newest' | 'oldest' | 'name' | 'expiring';
const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Nejnovější',
  oldest: 'Nejstarší',
  name: 'Podle názvu',
  expiring: 'Brzy končící',
};

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

// Format data do "Platí do 15. 12."
const formatValidUntil = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `Platí do ${day}. ${month}.`;
};

/**
 * Karta ulozene akce
 */
const SavedPromotionCard: React.FC<{
  savedPromotion: SavedPromotion;
  onRemove: (promotionId: string) => void;
  onPress: (promotionId: string) => void;
}> = ({ savedPromotion, onRemove, onPress }) => {
  const promotion = savedPromotion.promotion;
  if (!promotion) return null;

  const business = promotion.business;
  const placeholderColor = getPlaceholderColor(business?.type);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(promotion.id)}
      activeOpacity={0.8}
    >
      {/* Placeholder obrazku s textem */}
      <View style={[styles.imagePlaceholder, { backgroundColor: placeholderColor }]}>
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

      {/* Datum platnosti */}
      <Text style={styles.validityText}>
        {formatValidUntil(promotion.end_datetime)}
      </Text>

      {/* Srdicko */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => onRemove(promotion.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Heart
          size={22}
          color={colors.primary.main}
          fill={colors.primary.main}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const tabNavigation = useNavigation<TabNavigationProp>();
  const [savedPromotions, setSavedPromotions] = useState<SavedPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filtrované a seřazené akce
  const filteredAndSortedPromotions = useMemo(() => {
    let result = [...savedPromotions];

    // Filtr podle search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const title = item.promotion?.title?.toLowerCase() || '';
        const businessName = item.promotion?.business?.name?.toLowerCase() || '';
        return title.includes(query) || businessName.includes(query);
      });
    }

    // Řazení
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return (a.promotion?.business?.name || '').localeCompare(b.promotion?.business?.name || '');
        case 'expiring':
          return new Date(a.promotion?.end_datetime || 0).getTime() - new Date(b.promotion?.end_datetime || 0).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [savedPromotions, searchQuery, sortBy]);

  // Reload pri kazdem fokusu na screen
  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  const loadSaved = async () => {
    try {
      setError(null);
      const response = await savedPromotionsApi.getSavedPromotions();
      setSavedPromotions(response.data);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst uložené akce');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setError(null);
      const response = await savedPromotionsApi.getSavedPromotions();
      setSavedPromotions(response.data);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst uložené akce');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleRemove = useCallback(async (promotionId: string) => {
    setSavedPromotions((prev) => prev.filter((s) => s.promotion_id !== promotionId));

    try {
      await savedPromotionsApi.unsavePromotion(promotionId);
    } catch (err) {
      // Revert pri chybe
      loadSaved();
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
        <TouchableOpacity onPress={loadSaved}>
          <Text style={styles.retryText}>Zkusit znovu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixni header */}
      <View style={styles.header}>
        <Text style={styles.title}>Uložené nabídky</Text>
        <View style={styles.headerUnderline} />
      </View>

      {savedPromotions.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={80} color="#D1D5DB" fill="#D1D5DB" />
          <Text style={styles.emptyText}>Zatím zde nemáte nic uloženého.</Text>
          <TouchableOpacity style={styles.discoverButton} onPress={handleDiscoverPress}>
            <Text style={styles.discoverButtonText}>Objevovat Nové Nabídky</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          {isSearchActive && (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Search size={18} color={colors.text.tertiary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Hledat v uložených..."
                  placeholderTextColor={colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={18} color={colors.text.tertiary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Filter a search row */}
          <View style={styles.toolbarRow}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => setShowSortMenu(!showSortMenu)}
            >
              <SlidersHorizontal size={22} color={sortBy !== 'newest' ? colors.primary.main : colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => setIsSearchActive(!isSearchActive)}
            >
              {isSearchActive ? (
                <X size={22} color={colors.primary.main} />
              ) : (
                <Search size={22} color={colors.text.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Sort Menu */}
          {showSortMenu && (
            <View style={styles.sortMenu}>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
                  onPress={() => {
                    setSortBy(option);
                    setShowSortMenu(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}>
                    {SORT_LABELS[option]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <FlatList
            data={filteredAndSortedPromotions}
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
              <SavedPromotionCard
                savedPromotion={item}
                onRemove={handleRemove}
                onPress={handlePromotionPress}
              />
            )}
            ListEmptyComponent={
              searchQuery ? (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>Žádné výsledky pro "{searchQuery}"</Text>
                </View>
              ) : null
            }
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
  // Search
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: spacing.xs,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  // Sort menu
  sortMenu: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  sortOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sortOptionActive: {
    backgroundColor: colors.primary.main + '15',
  },
  sortOptionText: {
    ...typography.body,
    color: colors.text.primary,
  },
  sortOptionTextActive: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  noResults: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  noResultsText: {
    ...typography.body,
    color: colors.text.tertiary,
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
  validityText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginRight: spacing.xs,
  },
  heartButton: {
    padding: spacing.sm,
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

export default FavoritesScreen;
