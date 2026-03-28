import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockNotifications } from '@shared';
import type { Notification } from '@shared';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatType(type: Notification['type']) {
  switch (type) {
    case 'bet_result':
      return 'Resultado';
    case 'event_start':
      return 'Ao vivo';
    case 'promotion':
      return 'Promocao';
    case 'cashout':
      return 'Cashout';
    default:
      return 'Odds';
  }
}

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const notifications = useMemo(
    () =>
      [...mockNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    []
  );

  const openNotification = (notification: Notification) => {
    if (notification.type === 'promotion') {
      navigation.navigate('Promotions');
      return;
    }

    if (notification.type === 'event_start') {
      const eventId = notification.actionUrl?.split('/event/')[1];
      if (eventId) {
        navigation.navigate('Event', { id: eventId });
        return;
      }
      navigation.navigate('MainTabs', { screen: 'Live' });
      return;
    }

    navigation.navigate('MainTabs', { screen: 'Bets' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Notificacoes</Text>
        <Text style={styles.subtitle}>
          Central de alertas sobre apostas, eventos e campanhas ativas.
        </Text>
      </View>

      <View style={styles.stack}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.card,
              !notification.isRead && styles.cardUnread,
            ]}
            onPress={() => openNotification(notification)}
          >
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={styles.cardTitle}>{notification.title}</Text>
                <Text style={styles.cardMessage}>{notification.message}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{formatType(notification.type)}</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.dateText}>
                {new Date(notification.createdAt).toLocaleString('pt-BR')}
              </Text>
              <Text style={styles.actionText}>Abrir</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#737373', fontSize: 13, lineHeight: 20 },
  stack: { gap: 12 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  cardUnread: {
    borderColor: 'rgba(34, 197, 94, 0.35)',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  copy: { flex: 1 },
  cardTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMessage: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { color: '#22c55e', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  dateText: { color: '#737373', fontSize: 11 },
  actionText: { color: '#22c55e', fontSize: 12, fontWeight: '700' },
});
