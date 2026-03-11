/**
 * CrowdEase PromotionCard
 * Karta jedné akce v seznamu
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { Promotion } from '../api/types';
import { colors, spacing } from '../theme';

// Šířka karty
const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_WIDTH = SCREEN_WIDTH * 0.44;
export const CARD_HEIGHT = CARD_WIDTH * 1.1;

interface PromotionCardProps {
  promotion: Promotion;
  onPress?: (promotion: Promotion) => void;
  isSaved?: boolean;
  onToggleSave?: (promotionId: string) => void;
}

/**
 * Placeholder barva podle indexu business type
 */
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

export const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onPress,
  isSaved = false,
  onToggleSave,
}) => {
  const business = promotion.business;
  const placeholderColor = getPlaceholderColor(business?.type);

  const handleHeartPress = () => {
    if (onToggleSave) {
      onToggleSave(promotion.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(promotion)}
      activeOpacity={0.85}
    >
      {/* Obrázek / placeholder */}
      <View style={[styles.imageArea, { backgroundColor: placeholderColor }]}>
        {/* Srdíčko pro uložení akce */}
        {onToggleSave && (
          <TouchableOpacity
            style={styles.heartButton}
            onPress={handleHeartPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={22}
              color={colors.white}
              fill={isSaved ? colors.primary.coral : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}

        {/* Gradient overlay pro čitelnost textu */}
        <View style={styles.gradient}>
          <View style={styles.textOverlay}>
            <Text style={styles.title} numberOfLines={2}>
              {promotion.title}
            </Text>
            {business ? (
              <Text style={styles.businessName} numberOfLines={1}>
                {business.name}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  imageArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  gradient: {
    paddingTop: 40,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  textOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 20,
  },
  businessName: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
    marginTop: 2,
  },
});

export default PromotionCard;

