// mobile/src/api/environment.ts
// Exemplo de arquivo de configuração para alternar entre mock e produção

import { Platform } from 'react-native';

// Altere entre 'mock', 'development', 'production'
const ENV: 'mock' | 'development' | 'production' = 'mock';

interface EnvironmentConfig {
  API_BASEPATH: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  DEBUG: boolean;
}

const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  mock: {
    API_BASEPATH: 'http://localhost:3001',
    // Para real device, use o IP da sua máquina:
    // API_BASEPATH: 'http://192.168.x.x:3001',
    
    // Para emulador Android:
    // API_BASEPATH: 'http://10.0.2.2:3001',
    
    API_TIMEOUT: 5000,
    ENABLE_LOGGING: true,
    DEBUG: true,
  },
  development: {
    API_BASEPATH: 'https://dev-api.sportingtech.com',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: true,
    DEBUG: true,
  },
  production: {
    API_BASEPATH: 'https://api.sportingtech.com',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: false,
    DEBUG: false,
  },
};

export const ENV_CONFIG = ENVIRONMENTS[ENV];

/**
 * INSTRUÇÕES DE USO:
 * 
 * 1. Para usar MOCK SERVER (localhost):
 *    - Certifique-se que o mock server está rodando em http://localhost:3001
 *    - Deixe ENV = 'mock'
 *    - Execute: cd mock-server && npm start
 * 
 * 2. Para REAL DEVICE (telefone/tablet):
 *    - Se o servidor mock estiver em outro computador, use o IP:
 *    - API_BASEPATH: 'http://192.168.1.100:3001' (substitua pelo IP correto)
 *    - Teste com: curl http://192.168.1.100:3001/health
 * 
 * 3. Para ANDROID EMULATOR:
 *    - Use o IP especial: 10.0.2.2 (gateway do emulador)
 *    - API_BASEPATH: 'http://10.0.2.2:3001'
 * 
 * 4. Para iOS SIMULATOR:
 *    - Use localhost ou 127.0.0.1
 *    - API_BASEPATH: 'http://localhost:3001'
 * 
 * 5. Mudar para PRODUÇÃO:
 *    - Altere ENV = 'production'
 *    - Certifique-se de ter as credenciais reais configuradas
 * 
 * Exemplos de como encontrar IP:
 * 
 * macOS/Linux:
 *   ifconfig | grep "inet " | grep -v 127.0.0.1
 * 
 * Windows:
 *   ipconfig | findstr "IPv4"
 */
