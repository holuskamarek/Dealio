/**
 * CrowdEase Redemption Modal
 * Modal s QR kódem, PINem a countdown timerem pro uplatnění slevy
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { X } from 'lucide-react-native';
import { createRedemption } from '../api';
import { colors, typography, spacing } from '../theme';
import { borderRadius } from '../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COUNTDOWN_SECONDS = 5 * 60; // 5 minut

interface RedemptionModalProps {
  visible: boolean;
  promotionId: string;
  promotionTitle: string;
  discountPercent: number;
  onClose: () => void;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  visible,
  promotionId,
  promotionTitle,
  discountPercent,
  onClose,
}) => {
  const [pinCode, setPinCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Vytvořit redemption při otevření modalu
  useEffect(() => {
    if (visible && !pinCode && !isLoading) {
      handleCreateRedemption();
    }
    if (!visible) {
      // Reset při zavření
      clearTimer();
      setPinCode(null);
      setError(null);
      setSecondsLeft(COUNTDOWN_SECONDS);
    }
  }, [visible]);

  // Countdown timer
  useEffect(() => {
    if (pinCode && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [pinCode]);

  const handleCreateRedemption = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createRedemption(promotionId);
      setPinCode(response.data.pin_code);
      setSecondsLeft(COUNTDOWN_SECONDS);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se vytvořit slevu');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = secondsLeft / COUNTDOWN_SECONDS;
  const isExpired = secondsLeft === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Uplatnění slevy</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Generuji PIN kód...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleCreateRedemption}>
              <Text style={styles.retryButtonText}>Zkusit znovu</Text>
            </TouchableOpacity>
          </View>
        ) : pinCode ? (
          <View style={styles.contentArea}>
            {/* Promo info */}
            <Text style={styles.promoInfo}>
              {discountPercent}% sleva – {promotionTitle}
            </Text>

            {/* QR kód */}
            <View style={styles.qrContainer}>
              <QRCode value={pinCode} size={SCREEN_WIDTH * 0.5} />
            </View>

            {/* PIN kód */}
            <Text style={styles.pinLabel}>PIN kód:</Text>
            <Text style={[styles.pinCode, isExpired && styles.pinExpired]}>
              {pinCode}
            </Text>

            {/* Countdown */}
            <View style={styles.countdownContainer}>
              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: isExpired
                        ? colors.status.error
                        : progress < 0.2
                        ? colors.status.warning
                        : colors.primary.main,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.countdownText,
                  isExpired && { color: colors.status.error },
                ]}
              >
                {isExpired
                  ? 'PIN kód vypršel'
                  : `Platnost: ${formatTime(secondsLeft)}`}
              </Text>
            </View>

            {isExpired && (
              <TouchableOpacity
                style={styles.renewButton}
                onPress={handleCreateRedemption}
              >
                <Text style={styles.renewButtonText}>Vygenerovat nový PIN</Text>
              </TouchableOpacity>
            )}

            {/* Instrukce */}
            <Text style={styles.instructions}>
              Ukažte tento QR kód nebo PIN obsluze v podniku.
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.lg,
    padding: spacing.xs,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  promoInfo: {
    ...typography.callout,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  pinLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  pinCode: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 6,
    marginBottom: spacing.lg,
  },
  pinExpired: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  countdownContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  countdownText: {
    ...typography.callout,
    color: colors.text.secondary,
  },
  renewButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  renewButtonText: {
    ...typography.button,
    color: colors.white,
  },
  instructions: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default RedemptionModal;

