import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { usePreferencesStore } from '../stores/preferencesStore';
import { brandColors, semanticColors, spacing, typography, radius } from '../theme';

export function OnboardingScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const pushBetResults = usePreferencesStore((s) => s.pushBetResults);
  const pushEventStart = usePreferencesStore((s) => s.pushEventStart);
  const updatePrefs = usePreferencesStore((s) => s.updatePrefs);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logos/logo-white-c.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Headline */}
      <View style={styles.headlineSection}>
        <Text style={styles.headline}>Tudo pronto para começar</Text>
        <Text style={styles.subheadline}>
          Entre no app com uma experiência rápida. Ajuste o restante quando quiser nas configurações.
        </Text>
      </View>

      {/* Preferences Card */}
      <View style={styles.preferencesCard}>
        <Text style={styles.preferencesTitle}>Preferências iniciais</Text>
        
        <View style={styles.toggleList}>
          <ToggleRow
            label="Receber resultados das apostas"
            description="Notifique-me quando minhas apostas forem decididas"
            value={pushBetResults}
            onValueChange={(value) => updatePrefs({ pushBetResults: value })}
          />
          <ToggleRow
            label="Lembrar de eventos começando"
            description="Avise-me quando um jogo favorito estiver para começar"
            value={pushEventStart}
            onValueChange={(value) => updatePrefs({ pushEventStart: value })}
          />
        </View>
      </View>

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Você pode alterar isso depois nas configurações do app.
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => completeOnboarding()}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Começar agora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: semanticColors.border.default, true: `${brandColors.green[400]}40` }}
        thumbColor={value ? brandColors.green[400] : semanticColors.text.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColors.background.primary,
  },
  content: {
    flexGrow: 1,
    padding: spacing[6],
    paddingTop: spacing[12],
    paddingBottom: spacing[10],
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing[8],
  },
  logo: {
    width: 200,
    height: 55,
  },
  headlineSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  headline: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[3],
    fontFamily: typography.fontFamily.sans,
  },
  subheadline: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    fontFamily: typography.fontFamily.sans,
  },
  preferencesCard: {
    width: '100%',
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius['2xl'],
    padding: spacing[5],
    borderWidth: 1,
    borderColor: semanticColors.border.subtle,
    marginBottom: spacing[4],
  },
  preferencesTitle: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[4],
    fontFamily: typography.fontFamily.sans,
  },
  toggleList: {
    gap: spacing[1],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border.subtle,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: spacing[3],
  },
  toggleLabel: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  toggleDescription: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
    fontFamily: typography.fontFamily.sans,
  },
  helperText: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing[6],
    fontFamily: typography.fontFamily.sans,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: brandColors.green[400],
    borderRadius: radius.xl,
    alignItems: 'center',
    paddingVertical: spacing[4],
    shadowColor: brandColors.green[400],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: semanticColors.background.base,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.sans,
  },
});
