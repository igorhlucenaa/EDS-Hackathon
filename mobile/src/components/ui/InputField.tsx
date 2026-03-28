import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { semanticColors, brandColors, radius, spacing, typography } from '../../theme';

type InputType = 'text' | 'cpf' | 'phone' | 'email' | 'password';

interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  type?: InputType;
  error?: string | null;
  hint?: string;
  mask?: (value: string) => string;
  validate?: (value: string) => boolean;
  required?: boolean;
}

export function InputField({
  label,
  value,
  onChangeText,
  type = 'text',
  error,
  hint,
  mask,
  validate,
  required = false,
  placeholder,
  ...textInputProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (text: string) => {
      let processedValue = text;
      
      if (mask) {
        processedValue = mask(text);
      } else if (type === 'cpf') {
        // CPF mask: 000.000.000-00
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        if (cleaned.length <= 3) processedValue = cleaned;
        else if (cleaned.length <= 6) processedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        else if (cleaned.length <= 9) processedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
        else processedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
      } else if (type === 'phone') {
        // Phone mask: (00) 00000-0000
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        if (cleaned.length <= 2) processedValue = cleaned;
        else if (cleaned.length <= 7) processedValue = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        else processedValue = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      }
      
      onChangeText(processedValue);
    },
    [mask, onChangeText, type]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTouched(true);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const showError = touched && error;
  const isPassword = type === 'password';
  const secureTextEntry = isPassword && !isPasswordVisible;

  // Determine keyboard type based on input type
  const keyboardType =
    type === 'email' ? 'email-address' :
    type === 'phone' ? 'phone-pad' :
    type === 'cpf' ? 'number-pad' :
    'default';

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {hint && !showError && <Text style={styles.hint}>{hint}</Text>}
      </View>
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          showError && styles.inputContainerError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#737373"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          style={styles.input}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          autoCorrect={type === 'email' ? false : undefined}
          {...textInputProps}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.eyeIcon}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  label: {
    color: semanticColors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans,
  },
  required: {
    color: semanticColors.state.error,
  },
  hint: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.sans,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticColors.surface.default,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border.default,
    paddingHorizontal: spacing[4],
    height: 52,
  },
  inputContainerFocused: {
    borderColor: brandColors.green[400],
    backgroundColor: semanticColors.surface.pressed,
    shadowColor: brandColors.green[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: semanticColors.state.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  input: {
    flex: 1,
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    height: '100%',
  },
  eyeButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
  eyeIcon: {
    fontSize: 18,
    color: semanticColors.text.tertiary,
  },
  errorText: {
    color: semanticColors.state.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[2],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.sans,
  },
});
