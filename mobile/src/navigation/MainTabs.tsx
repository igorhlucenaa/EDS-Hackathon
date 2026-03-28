import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockNotifications } from '@shared';
import { HomeScreen } from '../screens/HomeScreen';
import { LiveScreen } from '../screens/LiveScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { BetsScreen } from '../screens/BetsScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { useBetslipStore } from '../stores/betslipStore';
import type { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={styles.tabLabel}>{label}</Text>
    </View>
  );
}

export function MainTabs() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selections = useBetslipStore((s) => s.selections);
  const setOpen = useBetslipStore((s) => s.setOpen);
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#0a0a0a', borderBottomColor: '#262626' },
          headerTintColor: '#fafafa',
          tabBarStyle: { backgroundColor: '#0a0a0a', borderTopColor: '#262626', height: 72 },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#737373',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
          tabBarItemStyle: { paddingVertical: 8 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'SwiftBet',
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🏠" label="Home" />
            ),
          }}
        />
        <Tab.Screen
          name="Live"
          component={LiveScreen}
          options={{
            title: 'Ao Vivo',
            tabBarLabel: 'Ao Vivo',
            tabBarIcon: () => <TabIcon icon="🔥" label="Ao Vivo" />,
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            title: 'Explorar',
            tabBarLabel: 'Explorar',
            tabBarIcon: () => <TabIcon icon="🔍" label="Explorar" />,
          }}
        />
        <Tab.Screen
          name="Bets"
          component={BetsScreen}
          options={{
            title: 'Apostas',
            tabBarLabel: 'Apostas',
            tabBarIcon: () => <TabIcon icon="📋" label="Apostas" />,
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            title: 'Conta',
            tabBarLabel: 'Conta',
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarIcon: () => <TabIcon icon="👤" label="Conta" />,
          }}
        />
      </Tab.Navigator>
      {selections.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setOpen(true);
            navigation.navigate('Betslip');
          }}
        >
          <Text style={styles.fabIcon}>📋</Text>
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{selections.length}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 22, marginBottom: 4 },
  tabLabel: { fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { fontSize: 24 },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
});
