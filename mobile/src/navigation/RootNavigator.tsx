import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { EventScreen } from '../screens/EventScreen';
import { BetslipScreen } from '../screens/BetslipScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function PlaceholderRoute({ route }: { route: { params?: { title?: string; sportId?: string; leagueId?: string } } }) {
  const p = route.params;
  const title = p?.title ?? (p?.sportId ? 'Esporte' : p?.leagueId ? 'Liga' : 'Em breve');
  return <PlaceholderScreen title={title} />;
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fafafa',
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
          options={{ title: 'Evento' }}
        />
        <Stack.Screen
          name="Betslip"
          component={BetslipScreen}
          options={{ title: 'Cupom' }}
        />
        <Stack.Screen
          name="Sport"
          component={PlaceholderRoute}
          initialParams={{ sportId: '', title: 'Esporte' }}
          options={{ title: 'Esporte' }}
        />
        <Stack.Screen
          name="League"
          component={PlaceholderRoute}
          initialParams={{ leagueId: '', title: 'Liga' }}
          options={{ title: 'Liga' }}
        />
        <Stack.Screen
          name="Search"
          component={PlaceholderRoute}
          initialParams={{ title: 'Busca' }}
          options={{ title: 'Busca' }}
        />
        <Stack.Screen
          name="IntentExplore"
          component={PlaceholderRoute}
          initialParams={{ title: 'Por intenção' }}
          options={{ title: 'Por intenção' }}
        />
        <Stack.Screen
          name="Favorites"
          component={PlaceholderRoute}
          initialParams={{ title: 'Favoritos' }}
          options={{ title: 'Favoritos' }}
        />
        <Stack.Screen
          name="Promotions"
          component={PlaceholderRoute}
          initialParams={{ title: 'Promoções' }}
          options={{ title: 'Promoções' }}
        />
        <Stack.Screen
          name="Wallet"
          component={PlaceholderRoute}
          initialParams={{ title: 'Carteira' }}
          options={{ title: 'Carteira' }}
        />
        <Stack.Screen
          name="Notifications"
          component={PlaceholderRoute}
          initialParams={{ title: 'Notificações' }}
          options={{ title: 'Notificações' }}
        />
        <Stack.Screen
          name="Preferences"
          component={PlaceholderRoute}
          initialParams={{ title: 'Preferências' }}
          options={{ title: 'Preferências' }}
        />
        <Stack.Screen
          name="Help"
          component={PlaceholderRoute}
          initialParams={{ title: 'Ajuda' }}
          options={{ title: 'Ajuda' }}
        />
        <Stack.Screen
          name="MarketExplorer"
          component={PlaceholderRoute}
          initialParams={{ title: 'Explorador de mercados' }}
          options={{ title: 'Mercados' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
