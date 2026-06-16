import { ensureAiEnvLoaded } from './load-env';

export type AiProvider = 'groq' | 'openai' | 'custom';

export interface LlmConfig {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  label: string;
}

const GROQ_DEFAULTS = {
  baseUrl: 'https://api.groq.com/openai/v1',
  model: 'llama-3.1-8b-instant',
  label: 'Groq • Llama 3.1',
};

const OPENAI_DEFAULTS = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  label: 'OpenAI • GPT-4o mini',
};

export function getLlmConfig(): LlmConfig {
  ensureAiEnvLoaded();

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER?.trim().toLowerCase() || 'groq') as AiProvider;

  if (provider === 'openai' && openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      baseUrl: process.env.OPENAI_BASE_URL?.trim() || OPENAI_DEFAULTS.baseUrl,
      model: process.env.OPENAI_MODEL?.trim() || OPENAI_DEFAULTS.model,
      label: 'OpenAI • GPT-4o mini',
    };
  }

  if (groqKey) {
    return {
      provider: 'groq',
      apiKey: groqKey,
      baseUrl: process.env.AI_BASE_URL?.trim() || GROQ_DEFAULTS.baseUrl,
      model: process.env.AI_MODEL?.trim() || GROQ_DEFAULTS.model,
      label: GROQ_DEFAULTS.label,
    };
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      baseUrl: process.env.OPENAI_BASE_URL?.trim() || OPENAI_DEFAULTS.baseUrl,
      model: process.env.OPENAI_MODEL?.trim() || OPENAI_DEFAULTS.model,
      label: OPENAI_DEFAULTS.label,
    };
  }

  return {
    provider: 'groq',
    apiKey: '',
    baseUrl: GROQ_DEFAULTS.baseUrl,
    model: GROQ_DEFAULTS.model,
    label: GROQ_DEFAULTS.label,
  };
}

export const MISSING_KEY_MESSAGE =
  'Ücretsiz Groq API anahtarı gerekli. console.groq.com adresinden ücretsiz hesap açıp API Keys bölümünden anahtar alın, .env dosyasına GROQ_API_KEY olarak ekleyin ve sunucuyu yeniden başlatın.';
