/**
 * CrowdEase Main Navigator
 * Tab navigace pro hlavní obrazovky aplikace
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compass, Heart, Ticket, CircleUser } from 'lucide-react-native';
import { MainTabParamList } from './types';
import { colors } from '../theme';
import { HomeScreen, FavoritesScreen, RedeemedScreen, ProfileScreen } from '../screens';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_SIZE = 26;

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.border.light,
          height: 85,
          paddingTop: 12,
          paddingBottom: 25,
        },
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Compass color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Heart color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name="Redeemed"
        component={RedeemedScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ticket color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <CircleUser color={color} size={ICON_SIZE} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

