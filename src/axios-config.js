import axios from 'axios';
import axiosRetry from 'axios-retry';

// Configuração do Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3003/videos', // Substitua pela URL correta
  timeout: 5000,
});

// Configuração do retry para lidar com erros 429
axiosRetry(apiClient, {
  retries: 3, // Número de tentativas
  retryCondition: (error) => error.response?.status === 429, // Retentar apenas em erros 429
  retryDelay: (retryCount) => retryCount * 1000, // Atraso entre tentativas (em ms)
});

export default apiClient;
