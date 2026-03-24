import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mockUpcomingEvents } from '@shared';
import { EventCard } from '../components/EventCard';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ExploreScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Explorar</Text>
      <Text style={styles.subtitle}>Próximos jogos</Text>
      <View style={styles.grid}>
        {mockUpcomingEvents.map((event) => (
          <EventCard
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
