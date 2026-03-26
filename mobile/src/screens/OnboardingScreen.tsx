import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { usePreferencesStore } from '../stores/preferencesStore';
import { useUserStore } from '../stores/userStore';

export function OnboardingScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const experienceMode = useUserStore((s) => s.experienceMode);
  const setExperienceMode = useUserStore((s) => s.setExperienceMode);
  const pushBetResults = usePreferencesStore((s) => s.pushBetResults);
  const pushEventStart = usePreferencesStore((s) => s.pushEventStart);
  const updatePrefs = usePreferencesStore((s) => s.updatePrefs);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Onboarding nativo</Text>
        <Text style={styles.title}>Personalize sua experiencia</Text>
        <Text style={styles.subtitle}>
          Ajustes iniciais para entrar no app com o fluxo mais adequado.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como voce prefere navegar?</Text>
        <View style={styles.stack}>
          {(['beginner', 'pro'] as const).map((mode) => {
            const active = experienceMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setExperienceMode(mode)}
              >
                <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                  {mode === 'pro' ? 'Modo Pro' : 'Modo Iniciante'}
                </Text>
                <Text style={styles.cardDescription}>
                  {mode === 'pro'
                    ? 'Mais informacao por tela e leitura rapida de mercados.'
                    : 'Jornada guiada para descobrir jogos e apostar com calma.'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas importantes</Text>
        <View style={styles.panel}>
          <ToggleRow
            label="Receber resultados das apostas"
            value={pushBetResults}
            onValueChange={(value) => updatePrefs({ pushBetResults: value })}
          />
          <ToggleRow
            label="Lembrar quando um evento estiver para comecar"
            value={pushEventStart}
            onValueChange={(value) => updatePrefs({ pushEventStart: value })}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => completeOnboarding()}
      >
        <Text style={styles.primaryButtonText}>Entrar no app</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#404040', true: 'rgba(34, 197, 94, 0.45)' }}
        thumbColor={value ? '#22c55e' : '#fafafa'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 20, paddingTop: 48, paddingBottom: 40 },
  hero: { marginBottom: 24 },
  eyebrow: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: '#fafafa', fontSize: 30, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  section: { marginBottom: 22 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  stack: { gap: 10 },
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  cardActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  cardTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardTitleActive: { color: '#22c55e' },
  cardDescription: { color: '#a3a3a3', fontSize: 12, lineHeight: 18 },
  panel: {
    backgroundColor: '#171717',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  toggleLabel: { flex: 1, color: '#fafafa', fontSize: 14, lineHeight: 20 },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
