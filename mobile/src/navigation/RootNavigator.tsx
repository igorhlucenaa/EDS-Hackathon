import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { EventScreen } from '../screens/EventScreen';
import { BetslipScreen } from '../screens/BetslipScreen';
import { SportScreen } from '../screens/SportScreen';
import { LeagueScreen } from '../screens/LeagueScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { IntentExploreScreen } from '../screens/IntentExploreScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PromotionsScreen } from '../screens/PromotionsScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { DepositScreen } from '../screens/DepositScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { PreferencesScreen } from '../screens/PreferencesScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { MarketExplorerScreen } from '../screens/MarketExplorerScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingDone = useAuthStore((s) => s.onboardingDone);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0a' },
          headerTintColor: '#fafafa',
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : !onboardingDone ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
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
              component={SportScreen}
              options={{ title: 'Esporte' }}
            />
            <Stack.Screen
              name="League"
              component={LeagueScreen}
              options={{ title: 'Liga' }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: 'Busca' }}
            />
            <Stack.Screen
              name="IntentExplore"
              component={IntentExploreScreen}
              options={{ title: 'Por intencao' }}
            />
            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{ title: 'Favoritos' }}
            />
            <Stack.Screen
              name="Promotions"
              component={PromotionsScreen}
              options={{ title: 'Promocoes' }}
            />
            <Stack.Screen
              name="Wallet"
              component={WalletScreen}
              options={{ title: 'Carteira' }}
            />
            <Stack.Screen
              name="WalletDeposit"
              component={DepositScreen}
              options={{ title: 'Depositar' }}
            />
            <Stack.Screen
              name="WalletWithdraw"
              component={WithdrawScreen}
              options={{ title: 'Sacar' }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: 'Notificacoes' }}
            />
            <Stack.Screen
              name="Preferences"
              component={PreferencesScreen}
              options={{ title: 'Preferencias' }}
            />
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: 'Ajuda' }}
            />
            <Stack.Screen
              name="MarketExplorer"
              component={MarketExplorerScreen}
              options={{ title: 'Mercados' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
