declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Configuração padrão apontando direto para o Render
const defaultConfig = {
  API_BASE_URL: 'https://agriculsite.onrender.com',
};

// Forçamos a inicialização limpa sem travar o app
let configLoading = false;

export async function loadRuntimeConfig(): Promise<void> {
  // Desativado o fetch local para evitar conflito na Vercel
  configLoading = false;
  return Promise.resolve();
}

export function getConfig() {
  // Se houver uma variável no .env local ou na Vercel, ela tem prioridade
  if (import.meta.env.VITE_API_BASE_URL) {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    };
  }

  // Se não, usa o Render fixo
  return defaultConfig;
}

export function getAPIBaseURL(): string {
  return getConfig().API_BASE_URL;
}

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};