import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapPin, Phone, Globe, Clock } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { apiClient } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessDetail'>;

interface Business {
  id: string;
  name: string;
  address: string;
  type: string;
  phone?: string;
  website?: string;
  description?: string;
  image_url?: string;
  opening_hours?: Record<string, { open: string; close: string }>;
}

const DAYS_CZ: Record<string, string> = {
  monday: 'Pondělí',
  tuesday: 'Úterý',
  wednesday: 'Středa',
  thursday: 'Čtvrtek',
  friday: 'Pátek',
  saturday: 'Sobota',
  sunday: 'Neděle',
};

export const BusinessDetailScreen: React.FC<Props> = ({ route }) => {
  const { businessId } = route.params;
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      const business = await apiClient.get<Business>(`/businesses/${businessId}`);
      setBusiness(business);
    } catch (err) {
      console.error('Chyba načítání podniku:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Podnik nenalezen</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {business.image_url ? (
        <Image source={{ uri: business.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>{business.name[0]}</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.type}>{business.type}</Text>

        {business.description && (
          <Text style={styles.description}>{business.description}</Text>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MapPin size={20} color={colors.primary.main} />
            <Text style={styles.infoText}>{business.address}</Text>
          </View>

          {business.phone && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${business.phone}`)}
            >
              <Phone size={20} color={colors.primary.main} />
              <Text style={[styles.infoText, styles.link]}>{business.phone}</Text>
            </TouchableOpacity>
          )}

          {business.website && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(business.website!)}
            >
              <Globe size={20} color={colors.primary.main} />
              <Text style={[styles.infoText, styles.link]}>{business.website}</Text>
            </TouchableOpacity>
          )}
        </View>

        {business.opening_hours && (
          <View style={styles.hoursSection}>
            <View style={styles.hoursHeader}>
              <Clock size={20} color={colors.primary.main} />
              <Text style={styles.hoursTitle}>Otevírací doba</Text>
            </View>
            {Object.entries(business.opening_hours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.dayName}>{DAYS_CZ[day] || day}</Text>
                <Text style={styles.hoursText}>{hours.open} - {hours.close}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  image: {
    width: '100%',
    height: 220,
  },
  imagePlaceholder: {
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  type: {
    ...typography.callout,
    color: colors.primary.main,
    marginBottom: spacing.md,
    textTransform: 'capitalize',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  infoSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  link: {
    color: colors.primary.main,
  },
  hoursSection: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: 12,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hoursTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dayName: {
    ...typography.body,
    color: colors.text.secondary,
  },
  hoursText: {
    ...typography.body,
    color: colors.text.primary,
  },
});
