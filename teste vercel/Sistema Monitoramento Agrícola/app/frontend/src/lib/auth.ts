import axios from 'axios';
import { config } from './config'; // ou de onde vinha a sua configuração de URL

class RPApi {
  private client = axios.create({
    baseURL: config.API_BASE_URL, // Garanta que aponta para o Render ou Proxy da Vercel
    withCredentials: true
  });

  private getBaseURL() {
    return config.API_BASE_URL;
  }

  // Pega o usuário logado atualmente através da sessão da nuvem
  async getCurrentUser() {
    try {
      const response = await this.client.get(`${this.getBaseURL()}/api/v1/auth/me`);
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      // Se não estiver logado ou falhar, retorna null em vez de quebrar
      return null;
    }
  }

  // Inicia o fluxo de redirecionamento para o provedor de nuvem (OIDC/SSO)
  async login() {
    try {
      // Passamos a URL atual do navegador (Vercel) para o backend saber para onde voltar depois
      const currentOrigin = window.location.origin;

      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/login?from_url=${encodeURIComponent(currentOrigin)}`
      );

      if (response.data && response.data.redirect_url) {
        // Redireciona o usuário para a tela de login da nuvem (Atmos Cloud / OIDC)
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('Redirect URL não foi encontrada na resposta do servidor.');
      }
    } catch (error: any) {
      console.error("Erro detalhado no login:", error);
      throw new Error(
        error.response?.data?.detail || 'Failed to initiate login'
      );
    }
  }

  // Faz o logout limpando a sessão no provedor de nuvem
  async logout() {
    try {
      await this.client.post(`${this.getBaseURL()}/api/v1/auth/logout`);
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Erro ao deslogar:", error.response?.data?.detail || error.message);
    }
  }
}

export const authApi = new RPApi();