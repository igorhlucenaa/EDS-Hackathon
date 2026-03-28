import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockNotifications, mockUser } from '@shared';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const menuItems: Array<{
  id: string;
  title: string;
  subtitle: string;
  route:
    | 'Wallet'
    | 'Favorites'
    | 'Promotions'
    | 'Notifications'
    | 'Preferences'
    | 'Help'
    | 'Search';
}> = [
  {
    id: 'wallet',
    title: 'Carteira',
    subtitle: 'Depositos, saques e historico financeiro.',
    route: 'Wallet',
  },
  {
    id: 'favorites',
    title: 'Favoritos',
    subtitle: 'Organize esportes, ligas e jogos que importam.',
    route: 'Favorites',
  },
  {
    id: 'promotions',
    title: 'Promocoes',
    subtitle: 'Bonus e campanhas ativas para a conta.',
    route: 'Promotions',
  },
  {
    id: 'notifications',
    title: 'Notificacoes',
    subtitle: 'Alertas de resultados, odds e inicio dos jogos.',
    route: 'Notifications',
  },
  {
    id: 'preferences',
    title: 'Preferencias',
    subtitle: 'Experiencia, push e comportamento do app.',
    route: 'Preferences',
  },
  {
    id: 'help',
    title: 'Ajuda',
    subtitle: 'FAQ, suporte e caminhos rapidos.',
    route: 'Help',
  },
  {
    id: 'search',
    title: 'Busca',
    subtitle: 'Encontre esportes, ligas e eventos.',
    route: 'Search',
  },
];

export function AccountScreen() {
  const navigation = useNavigation<Nav>();
  const unreadCount = mockNotifications.filter((item) => !item.isRead).length;
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const startOnboarding = useAuthStore((s) => s.startOnboarding);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mockUser.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.email}>{mockUser.email}</Text>
        <View style={styles.metaRow}>
          {unreadCount > 0 && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{unreadCount} alertas novos</Text>
            </View>
          )}
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponivel</Text>
          <Text style={styles.balanceValue}>R$ {mockUser.balance.toFixed(2)}</Text>
          <Text style={styles.balanceBonus}>
            Bonus: R$ {mockUser.bonusBalance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('WalletDeposit')}
          >
            <Text style={styles.primaryButtonText}>Depositar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('WalletWithdraw')}
          >
            <Text style={styles.secondaryButtonText}>Sacar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuCopy}>
              <Text style={styles.menuText}>{item.title}</Text>
              <Text style={styles.menuSubtext}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => {
          startOnboarding();
        }}
      >
        <Text style={styles.outlineButtonText}>Reabrir onboarding</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dangerButton}
        onPress={() => setAuthenticated(false)}
      >
        <Text style={styles.dangerButtonText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  profile: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#171717',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  name: { fontSize: 18, fontWeight: '700', color: '#fafafa', marginBottom: 4 },
  email: { fontSize: 14, color: '#737373', marginBottom: 14 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  pillText: { fontSize: 11, fontWeight: '600', color: '#22c55e' },
  balanceCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.4)',
  },
  balanceLabel: { fontSize: 12, color: '#737373', marginBottom: 4 },
  balanceValue: { fontSize: 28, fontWeight: '800', color: '#fafafa' },
  balanceBonus: { fontSize: 13, color: '#22c55e', marginTop: 6 },
  quickActions: { flexDirection: 'row', gap: 10 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  secondaryButtonText: { color: '#fafafa', fontSize: 14, fontWeight: '700' },
  section: { marginBottom: 14 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#171717',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  menuCopy: { flex: 1 },
  menuText: { fontSize: 15, fontWeight: '600', color: '#fafafa', marginBottom: 4 },
  menuSubtext: { fontSize: 12, color: '#737373', lineHeight: 18 },
  menuArrow: { fontSize: 16, color: '#737373' },
  outlineButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 10,
  },
  outlineButtonText: { color: '#22c55e', fontSize: 14, fontWeight: '700' },
  dangerButton: {
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dangerButtonText: { color: '#f87171', fontSize: 14, fontWeight: '700' },
});
