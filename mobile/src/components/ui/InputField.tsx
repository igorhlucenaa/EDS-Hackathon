import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';

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
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: '#ef4444',
  },
  hint: {
    color: '#737373',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#22c55e',
    backgroundColor: '#1a1a1a',
  },
  inputContainerError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  input: {
    flex: 1,
    color: '#fafafa',
    fontSize: 15,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});
