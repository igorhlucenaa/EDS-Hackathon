import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const startOnboarding = useAuthStore((s) => s.startOnboarding);
  const [name, setName] = useState('Lucas Silva');
  const [email, setEmail] = useState('lucas.silva@email.com');
  const [password, setPassword] = useState('123456');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Conta nova</Text>
        <Text style={styles.title}>Criar cadastro</Text>
        <Text style={styles.subtitle}>
          Abertura rapida para seguir ao onboarding nativo.
        </Text>
      </View>

      <View style={styles.form}>
        <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="voce@email.com" />
        <Field
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Crie uma senha"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          startOnboarding();
          setAuthenticated(true);
        }}
      >
        <Text style={styles.primaryButtonText}>Criar conta e continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>Ja tenho conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#737373"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  hero: { marginBottom: 24 },
  eyebrow: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: '#fafafa', fontSize: 32, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#a3a3a3', fontSize: 13, lineHeight: 20 },
  form: { gap: 14, marginBottom: 20 },
  field: { gap: 8 },
  fieldLabel: { color: '#fafafa', fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    paddingHorizontal: 14,
    height: 50,
    color: '#fafafa',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 10,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: { color: '#fafafa', fontSize: 15, fontWeight: '700' },
});
