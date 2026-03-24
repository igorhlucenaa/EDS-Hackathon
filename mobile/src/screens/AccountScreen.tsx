import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockUser } from '@shared';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function AccountScreen() {
  const navigation = useNavigation<Nav>();

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
        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balanceValue}>
            R$ {mockUser.balance.toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Text style={styles.menuText}>Carteira</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.menuText}>Notificações</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Preferences')}
      >
        <Text style={styles.menuText}>Preferências</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Help')}
      >
        <Text style={styles.menuText}>Ajuda</Text>
        <Text style={styles.menuArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  profile: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    backgroundColor: '#171717',
    borderRadius: 16,
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
  email: { fontSize: 14, color: '#737373', marginBottom: 16 },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: { fontSize: 14, color: '#737373' },
  balanceValue: { fontSize: 18, fontWeight: '700', color: '#22c55e' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#171717',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  menuText: { fontSize: 16, color: '#fafafa' },
  menuArrow: { fontSize: 16, color: '#737373' },
});
