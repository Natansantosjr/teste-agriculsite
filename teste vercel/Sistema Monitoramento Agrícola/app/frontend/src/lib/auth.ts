import axios, { AxiosInstance } from 'axios';
import { getAPIBaseURL } from './config';

class RPApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getBaseURL() {
    return getAPIBaseURL();
  }

  async getCurrentUser() {
    try {
      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/me`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to get user info'
      );
    }
  }

 async login() {
    try {
      // Passamos a URL atual do navegador (Vercel) para o backend saber para onde voltar depois
      const currentOrigin = window.location.origin;
      
      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/login?from_url=${encodeURIComponent(currentOrigin)}`
      );
      
      if (response.data && response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('Redirect URL não foi encontrada na resposta do servidor.');
      }
    } catch (error) {
      console.error("Erro detalhado no login:", error);
      throw new Error(
        error.response?.data?.detail || 'Failed to initiate login'
      );
    }
  }

  async logout() {
    try {
      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/logout`
      );
      // The backend will redirect to OIDC provider logout
      window.location.href = response.data.redirect_url;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to logout');
    }
  }
}

export const authApi = new RPApi();
