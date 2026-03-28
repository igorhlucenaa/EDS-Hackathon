// Utilitários de validação para campos de formulário

/**
 * Valida CPF (formato e dígitos verificadores)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Calcular primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  
  if (parseInt(cleaned.charAt(9)) !== firstDigit) return false;
  
  // Calcular segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;
  
  return parseInt(cleaned.charAt(10)) === secondDigit;
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida telefone brasileiro
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Aceitar com ou sem DDI (55)
  if (cleaned.startsWith('55')) {
    return cleaned.length === 13;
  }
  return cleaned.length === 11;
}

/**
 * Valida senha (mínimo 6 caracteres, pelo menos 1 letra e 1 número)
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Mínimo 6 caracteres');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Pelo menos 1 letra');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Pelo menos 1 número');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Verifica se senhas coincidem
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Retorna mensagem de erro específica para cada campo
 */
export function getFieldErrorMessage(
  field: 'cpf' | 'email' | 'phone' | 'password' | 'confirmPassword',
  value: string,
  compareValue?: string
): string | null {
  switch (field) {
    case 'cpf':
      if (!value) return 'CPF é obrigatório';
      if (value.replace(/\D/g, '').length !== 11) return 'CPF incompleto';
      if (!validateCPF(value)) return 'CPF inválido';
      return null;
    
    case 'email':
      if (!value) return 'E-mail é obrigatório';
      if (!validateEmail(value)) return 'E-mail inválido';
      return null;
    
    case 'phone':
      if (!value) return 'Celular é obrigatório';
      if (!validatePhone(value)) return 'Celular inválido';
      return null;
    
    case 'password':
      if (!value) return 'Senha é obrigatória';
      if (value.length < 6) return 'Mínimo 6 caracteres';
      return null;
    
    case 'confirmPassword':
      if (!value) return 'Confirme sua senha';
      if (!validatePasswordMatch(value, compareValue || '')) return 'Senhas não coincidem';
      return null;
    
    default:
      return null;
  }
}
