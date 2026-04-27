/**
 * CrowdEase Promotion Detail Screen
 * Detail akce s možností uplatnění slevy
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import { promotionsApi, Promotion } from '../api';
import { colors, typography, spacing } from '../theme';
import { borderRadius } from '../theme/spacing';
import { RedemptionModal } from '../components/RedemptionModal';

type Props = NativeStackScreenProps<RootStackParamList, 'PromotionDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;


const PLACEHOLDER_COLORS: Record<string, string> = {
  'kavárna': colors.cardPlaceholder.yellow,
  'bistro': colors.cardPlaceholder.green,
  'restaurace': colors.cardPlaceholder.coral,
  'bar': colors.cardPlaceholder.purple,
  'cukrárna': colors.cardPlaceholder.pink,
  'jiné': colors.cardPlaceholder.blue,
};


const formatOpeningHours = (
  openingHours?: Record<string, { open: string; close: string }>,
): string => {
  if (!openingHours) return 'Neuvedeno';
  const days = Object.values(openingHours);
  if (days.length === 0) return 'Neuvedeno';
  const first = days[0];
  return `Po - Ne: ${first.open} - ${first.close}`;
};


const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const PromotionDetailScreen: React.FC<Props> = ({ route }) => {
  const { promotionId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);

  useEffect(() => {
    loadPromotion();
  }, [promotionId]);

  const loadPromotion = async () => {
    try {
      setError(null);
      const response = await promotionsApi.getPromotion(promotionId);
      setPromotion(response.data);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se načíst detail akce');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error || !promotion) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Akce nenalezena'}</Text>
      </View>
    );
  }

  const business = promotion.business;
  const placeholderColor = PLACEHOLDER_COLORS[business?.type || 'jiné'] || colors.cardPlaceholder.blue;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {promotion.image_url ? (
          <Image source={{ uri: promotion.image_url }} style={styles.imageArea} resizeMode="cover" />
        ) : (
          <View style={[styles.imageArea, { backgroundColor: placeholderColor }]} />
        )}


        <View style={styles.content}>
          {business && (
            <TouchableOpacity onPress={() => navigation.navigate('BusinessDetail', { businessId: business.id })}>
              <Text style={[styles.businessName, styles.businessNameLink]}>{business.name}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.promoTitle}>
            {promotion.discount_percent}% sleva – {promotion.title}
          </Text>

          {promotion.description && (
            <Text style={styles.description}>{promotion.description}</Text>
          )}

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.text.secondary} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Platnost do:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(promotion.end_datetime)}
                </Text>
              </View>
            </View>

            {business?.address && (
              <View style={styles.infoRow}>
                <MapPin size={18} color={colors.text.secondary} />
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoLabel}>Adresa:</Text>
                  <Text style={styles.infoValue}>{business.address}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <Clock size={18} color={colors.text.secondary} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Otevírací doba:</Text>
                <Text style={styles.infoValue}>
                  {formatOpeningHours(business?.opening_hours)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => setShowRedemptionModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.redeemButtonText}>Uplatnit slevu</Text>
        </TouchableOpacity>
      </View>

      <RedemptionModal
        visible={showRedemptionModal}
        promotionId={promotionId}
        promotionTitle={promotion.title}
        discountPercent={promotion.discount_percent}
        onClose={() => setShowRedemptionModal(false)}
      />
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
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  imageArea: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    ...typography.h2,
    color: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: spacing.md,
  },
  businessName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promoTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  infoSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  infoValue: {
    ...typography.callout,
    color: colors.text.primary,
    marginTop: 2,
  },
  bottomBar: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  redeemButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  redeemButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '600',
    fontSize: 17,
  },
});

export default PromotionDetailScreen;

