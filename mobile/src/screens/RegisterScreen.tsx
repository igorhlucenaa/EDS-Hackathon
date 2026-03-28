import React, { useState, useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { InputField } from '../components/ui/InputField';
import { Checkbox } from '../components/ui/Checkbox';
import { getFieldErrorMessage, validateCPF, validateEmail, validatePhone, validatePasswordMatch } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const startOnboarding = useAuthStore((s) => s.startOnboarding);

  // Form fields
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedBonus, setAcceptedBonus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track which fields have been touched for validation display
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const markTouched = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  }, []);

  // Validation errors
  const errors = useMemo(() => {
    return {
      cpf: touchedFields.has('cpf') ? getFieldErrorMessage('cpf', cpf) : null,
      phone: touchedFields.has('phone') ? getFieldErrorMessage('phone', phone) : null,
      email: touchedFields.has('email') ? getFieldErrorMessage('email', email) : null,
      password: touchedFields.has('password') ? getFieldErrorMessage('password', password) : null,
      confirmPassword: touchedFields.has('confirmPassword') 
        ? getFieldErrorMessage('confirmPassword', confirmPassword, password) 
        : null,
    };
  }, [cpf, phone, email, password, confirmPassword, touchedFields]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      validateCPF(cpf) &&
      validatePhone(phone) &&
      validateEmail(email) &&
      password.length >= 6 &&
      validatePasswordMatch(password, confirmPassword) &&
      acceptedTerms
    );
  }, [cpf, phone, email, password, confirmPassword, acceptedTerms]);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched to show validation errors
    setTouchedFields(new Set(['cpf', 'phone', 'email', 'password', 'confirmPassword']));
    
    if (!isFormValid) {
      if (!acceptedTerms) {
        setSubmitError('Você precisa aceitar os termos para continuar');
      }
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    
    // Success - proceed to onboarding
    startOnboarding();
    setAuthenticated(true);
  }, [isFormValid, acceptedTerms, startOnboarding, setAuthenticated]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Conta nova</Text>
          </View>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Rápido, seguro e leva menos de 1 minuto
          </Text>
        </View>

        {/* Trust indicators */}
        <View style={styles.trustIndicators}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustText}>Dados protegidos</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>✓</Text>
            <Text style={styles.trustText}>+18 verificado</Text>
          </View>
        </View>

        {/* Form Section 1: Dados pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          
          <InputField
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            type="cpf"
            placeholder="000.000.000-00"
            error={errors.cpf}
            required
            onBlur={() => markTouched('cpf')}
            maxLength={14}
          />

          <InputField
            label="Celular"
            value={phone}
            onChangeText={setPhone}
            type="phone"
            placeholder="(00) 00000-0000"
            error={errors.phone}
            required
            hint="Com DDD"
            onBlur={() => markTouched('phone')}
            maxLength={15}
          />
        </View>

        {/* Form Section 2: Acesso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados de acesso</Text>
          
          <InputField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            type="email"
            placeholder="seu@email.com"
            error={errors.email}
            required
            onBlur={() => markTouched('email')}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <InputField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            type="password"
            placeholder="Crie uma senha segura"
            error={errors.password}
            required
            hint="Mínimo 6 caracteres"
            onBlur={() => markTouched('password')}
          />

          <InputField
            label="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            type="password"
            placeholder="Repita sua senha"
            error={errors.confirmPassword}
            required
            onBlur={() => markTouched('confirmPassword')}
          />
        </View>

        {/* Bonus Opt-in */}
        <View style={styles.bonusSection}>
          <Checkbox
            checked={acceptedBonus}
            onPress={() => setAcceptedBonus(!acceptedBonus)}
            label="Quero receber bônus de boas-vindas"
            sublabel="Ganhe até R$ 50 em freebets e odds boost especiais"
            variant="bonus"
          />
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Checkbox
            checked={acceptedTerms}
            onPress={() => {
              setAcceptedTerms(!acceptedTerms);
              if (!acceptedTerms) setSubmitError(null);
            }}
            label="Declaro ser maior de 18 anos e aceito os Termos de Uso e Política de Privacidade"
            variant="legal"
          />
        </View>

        {/* Error message */}
        {submitError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.primaryButton, (!isFormValid || isLoading) && styles.primaryButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Criar conta grátis →</Text>
          )}
        </TouchableOpacity>

        {/* Secondary action */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>
            Já tem conta? <Text style={styles.secondaryButtonTextBold}>Entrar</Text>
          </Text>
        </TouchableOpacity>

        {/* Responsible gaming message */}
        <View style={styles.responsibleSection}>
          <Text style={styles.responsibleIcon}>🎗️</Text>
          <Text style={styles.responsibleText}>
            Jogue com responsabilidade. Apostas são para maiores de 18 anos.
          </Text>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: '#fafafa',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#a3a3a3',
    fontSize: 15,
    lineHeight: 22,
  },
  trustIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustIcon: {
    fontSize: 14,
  },
  trustText: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '500',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  bonusSection: {
    marginBottom: 16,
  },
  termsSection: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#166534',
    opacity: 0.6,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#a3a3a3',
    fontSize: 14,
  },
  secondaryButtonTextBold: {
    color: '#fafafa',
    fontWeight: '700',
  },
  responsibleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.5)',
  },
  responsibleIcon: {
    fontSize: 14,
  },
  responsibleText: {
    color: '#737373',
    fontSize: 11,
    textAlign: 'center',
    flexShrink: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});
