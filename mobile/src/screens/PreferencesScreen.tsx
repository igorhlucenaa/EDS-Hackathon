import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePreferencesStore } from '../stores/preferencesStore';
import { useSearchHistoryStore } from '../stores/searchHistoryStore';
import { useUserStore } from '../stores/userStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PreferencesScreen() {
  const navigation = useNavigation<Nav>();
  const updatePrefs = usePreferencesStore((s) => s.updatePrefs);
  const pushBetResults = usePreferencesStore((s) => s.pushBetResults);
  const pushOddsMoves = usePreferencesStore((s) => s.pushOddsMoves);
  const pushEventStart = usePreferencesStore((s) => s.pushEventStart);
  const emailWeekly = usePreferencesStore((s) => s.emailWeekly);
  const compactOdds = usePreferencesStore((s) => s.compactOdds);
  const experienceMode = useUserStore((s) => s.experienceMode);
  const setExperienceMode = useUserStore((s) => s.setExperienceMode);
  const recentQueries = useSearchHistoryStore((s) => s.recentQueries);
  const clearRecent = useSearchHistoryStore((s) => s.clear);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Preferencias</Text>
        <Text style={styles.subtitle}>
          Ajuste o jeito como o app nativo apresenta informacoes e alertas.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de experiencia</Text>
        <View style={styles.modeRow}>
          {(['beginner', 'pro'] as const).map((mode) => {
            const active = experienceMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeCard, active && styles.modeCardActive]}
                onPress={() => setExperienceMode(mode)}
              >
                <Text style={[styles.modeTitle, active && styles.modeTitleActive]}>
                  {mode === 'pro' ? 'Pro' : 'Iniciante'}
                </Text>
                <Text style={styles.modeSubtitle}>
                  {mode === 'pro'
                    ? 'Mais densidade de mercado e leitura rapida.'
                    : 'Fluxo guiado com menos ruido visual.'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas</Text>
        <View style={styles.panel}>
          <PreferenceRow
            label="Resultado das apostas"
            description="Receber push quando uma aposta liquidar."
            value={pushBetResults}
            onValueChange={(value) => updatePrefs({ pushBetResults: value })}
          />
          <PreferenceRow
            label="Mudancas de odds"
            description="Avisar quando o mercado se mover."
            value={pushOddsMoves}
            onValueChange={(value) => updatePrefs({ pushOddsMoves: value })}
          />
          <PreferenceRow
            label="Inicio dos eventos"
            description="Lembrar quando os jogos forem comecar."
            value={pushEventStart}
            onValueChange={(value) => updatePrefs({ pushEventStart: value })}
          />
          <PreferenceRow
            label="Resumo semanal por email"
            description="Receber um recap com saldo e desempenho."
            value={emailWeekly}
            onValueChange={(value) => updatePrefs({ emailWeekly: value })}
          />
          <PreferenceRow
            label="Odds compactas"
            description="Exibir mercados em layout mais denso."
            value={compactOdds}
            onValueChange={(value) => updatePrefs({ compactOdds: value })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Busca e atalhos</Text>
        <View style={styles.panel}>
          <View style={styles.historyRow}>
            <View style={styles.historyCopy}>
              <Text style={styles.historyTitle}>Historico de busca</Text>
              <Text style={styles.historySubtitle}>
                {recentQueries.length} consultas salvas no dispositivo.
              </Text>
            </View>
            <TouchableOpacity onPress={clearRecent}>
              <Text style={styles.clearText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.linkText}>Gerenciar favoritos</Text>
            <Text style={styles.linkArrow}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.linkText}>Abrir busca nativa</Text>
            <Text style={styles.linkArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function PreferenceRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}>
        <Text style={styles.preferenceLabel}>{label}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
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
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  title: { color: '#fafafa', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#737373', fontSize: 13, lineHeight: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fafafa', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modeRow: { gap: 10 },
  modeCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
  },
  modeCardActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  modeTitle: { color: '#fafafa', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  modeTitleActive: { color: '#22c55e' },
  modeSubtitle: { color: '#a3a3a3', fontSize: 12, lineHeight: 18 },
  panel: {
    backgroundColor: '#171717',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    overflow: 'hidden',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  preferenceCopy: { flex: 1 },
  preferenceLabel: { color: '#fafafa', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  preferenceDescription: { color: '#737373', fontSize: 12, lineHeight: 18 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  historyCopy: { flex: 1 },
  historyTitle: { color: '#fafafa', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  historySubtitle: { color: '#737373', fontSize: 12, lineHeight: 18 },
  clearText: { color: '#22c55e', fontSize: 12, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.35)',
  },
  linkText: { color: '#fafafa', fontSize: 14, fontWeight: '600' },
  linkArrow: { color: '#737373', fontSize: 16 },
});
