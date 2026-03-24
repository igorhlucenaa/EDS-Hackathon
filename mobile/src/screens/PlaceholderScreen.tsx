import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Em breve</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  title: { fontSize: 18, fontWeight: '600', color: '#fafafa', marginBottom: 8 },
  sub: { fontSize: 14, color: '#737373' },
});
