import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockLiveEvents } from '@shared';
import { LiveSnapshotCard } from '../components/LiveSnapshotCard';
import { useMissionTracking } from '../hooks/useMissions';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LiveScreen() {
  const navigation = useNavigation<Nav>();
  const { trackVisitLive } = useMissionTracking();

  useEffect(() => {
    trackVisitLive();
  }, [trackVisitLive]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Ao vivo</Text>
      <Text style={styles.subtitle}>
        {mockLiveEvents.length} jogos acontecendo agora
      </Text>
      <View style={styles.grid}>
        {mockLiveEvents.map((event) => (
          <LiveSnapshotCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate('Event', { id: event.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '700', color: '#fafafa', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#737373', marginBottom: 16 },
  grid: { gap: 12 },
});
