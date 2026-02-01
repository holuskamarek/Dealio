/**
 * CrowdEase Navigation Types
 * Definice typů pro navigaci
 */

// Auth Stack - přihlášení/registrace
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Tab Navigator - spodní menu
export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Redeemed: undefined;
  Profile: undefined;
};

// Root Stack - hlavní navigace
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PromotionDetail: { promotionId: string };
  BusinessDetail: { businessId: string };
};

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

