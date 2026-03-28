import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Live: undefined;
  Explore: undefined;
  Bets: undefined;
  Account: undefined;
};

type TitledRouteParams = {
  title?: string;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Event: { id: string };
  Betslip: undefined;
  Sport: { sportId: string; title?: string };
  League: { leagueId: string; title?: string };
  Search: (TitledRouteParams & { initialQuery?: string }) | undefined;
  IntentExplore: TitledRouteParams | undefined;
  Favorites: TitledRouteParams | undefined;
  Promotions: TitledRouteParams | undefined;
  Wallet: TitledRouteParams | undefined;
  WalletDeposit: TitledRouteParams | undefined;
  WalletWithdraw: TitledRouteParams | undefined;
  Notifications: TitledRouteParams | undefined;
  Preferences: TitledRouteParams | undefined;
  Help: TitledRouteParams | undefined;
  MarketExplorer: TitledRouteParams | undefined;
  SharedBet: { code?: string } | undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};
