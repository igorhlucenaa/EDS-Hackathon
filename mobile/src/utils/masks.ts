// Utilitários de máscaras para campos de formulário

/**
 * Aplica máscara de CPF (000.000.000-00)
 */
export function maskCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

/**
 * Remove máscara e retorna apenas números
 */
export function unmask(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de telefone com DDI (+55 (00) 00000-0000)
 */
export function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 13);
  
  // Se começar com 55 (Brasil)
  if (cleaned.length > 11 && cleaned.startsWith('55')) {
    const withoutCountry = cleaned.slice(2);
    if (withoutCountry.length <= 2) return `+55 (${withoutCountry}`;
    if (withoutCountry.length <= 7) return `+55 (${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(2)}`;
    return `+55 (${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(2, 7)}-${withoutCountry.slice(7)}`;
  }
  
  // Sem DDI, assumir Brasil
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}

/**
 * Formata telefone para exibição completa com DDI
 */
export function formatPhoneDisplay(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `+55 (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return value;
}
