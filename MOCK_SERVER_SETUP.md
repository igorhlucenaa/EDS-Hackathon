# 🔧 Configuração do App Mobile para Mock Server

## Passo 1: Criar um arquivo de configuração de ambiente

Na pasta `mobile/src/api/`, crie um arquivo chamado `environment.ts`:

```typescript
// mobile/src/api/environment.ts

type Environment = 'production' | 'development' | 'mock';

const ENV: Environment = 'mock'; // Altere para 'production' quando quiser usar o servidor real

const ENVIRONMENTS = {
  production: {
    API_BASEPATH: 'https://api.sportingtech.com',
    TIMEOUT: 30000,
  },
  development: {
    API_BASEPATH: 'https://dev-api.sportingtech.com',
    TIMEOUT: 30000,
  },
  mock: {
    API_BASEPATH: 'http://localhost:3001',
    TIMEOUT: 5000,
  },
};

export const ENV_CONFIG = ENVIRONMENTS[ENV];
```

## Passo 2: Atualizar o arquivo de configuração da API

Edite `mobile/src/api/config.ts` para usar a nova configuração:

```typescript
// mobile/src/api/config.ts (início do arquivo)

import { ENV_CONFIG } from './environment';

export const DEFAULT_API_BASEPATH = ENV_CONFIG.API_BASEPATH;
export const API_TIMEOUT = ENV_CONFIG.TIMEOUT;

// ... resto das configurações
```

## Passo 3: Adicionar interceptadores (opcional mas recomendado)

Para melhor experiência de desenvolvimento, você pode adicionar logs:

```typescript
// mobile/src/api/http.ts ou equivalent

import axios from 'axios';
import { ENV_CONFIG } from './environment';

const api = axios.create({
  baseURL: ENV_CONFIG.API_BASEPATH,
  timeout: ENV_CONFIG.TIMEOUT,
});

// Log de requisições em desenvolvimento
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Log de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API] Error:`, error.message);
    return Promise.reject(error);
  }
);

export default api;
```

## Passo 4: Instruções de Uso

### ✅ Para Desenvolvimento com Mock Server:

1. **Inicie o mock server:**
   ```bash
   cd mock-server
   npm run dev
   # ou
   ./start.sh  # macOS/Linux
   # ou
   start.bat   # Windows
   ```

2. **Deixe o environment como 'mock':**
   ```typescript
   const ENV: Environment = 'mock';
   ```

3. **Execute o app mobile:**
   ```bash
   cd mobile
   npm start
   # ou expo start
   ```

4. **Teste os endpoints** visitando: http://localhost:3001/test.html

### 🚀 Para Produção:

1. **Altere o environment para 'production':**
   ```typescript
   const ENV: Environment = 'production';
   ```

2. **Certifique-se de que as credenciais reais estão configuradas**

3. **Faça o build final**

### 🔄 Alternativa: Variavel de Ambiente

Se preferir controlar via variável, crie um arquivo `.env`:

```bash
# mobile/.env
REACT_APP_ENV=mock
# ou
REACT_APP_ENV=production
```

E ajuste `environment.ts`:

```typescript
const ENV: Environment = 
  (process.env.REACT_APP_ENV as Environment) || 'mock';
```

## 📊 Simulações Disponíveis

O mock server fornece dados realistas para testar:

- ✅ Listagem de eventos e esportes
- ✅ Cálculo de odds acumuladas
- ✅ Simular confirmação de apostas
- ✅ Retornar erro de validação
- ✅ Timeouts e retries
- ✅ CORS e requisições cross-origin

## 🐛 Debug

Se o app não conseguir acessar o mock server:

1. **Verifique se o servidor está rodando:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Verifique a URL configurada:**
   Procure por `localhost:3001` nos logs

3. **Verifique o firewall:**
   Às vezes máquinas virtuais bloqueiam connections

4. **IP local alternativo:**
   Se estiver em VM/emulador, tente:
   - Android: `10.0.2.2:3001` (IP do host)
   - iOS Simulator: `localhost:3001` ou `127.0.0.1:3001`
   - Real device: Use o IP da sua máquina (ex: `192.168.x.x:3001`)

## 📝 Estrutura Esperada

```
mobile/
├── src/
│   ├── api/
│   │   ├── config.ts          (Atualizado)
│   │   ├── environment.ts     (Novo arquivo)
│   │   ├── http.ts            (Opcional)
│   │   └── index.ts
│   ├── components/
│   ├── screens/
│   └── ...
└── ...
```

## 🎯 Próximos Passos

1. Criar simulações de erro (endpoints que retornam 401, 500, etc.)
2. Adicionar delay artificial para testar loading states
3. Implementar websocket para odds em tempo real
4. Adicionar autenticação mock (tokens JWT)
