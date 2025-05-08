import apiClient from "./axios-config";
// ...existing code...

// Exemplo de uso do Axios configurado
apiClient
  .get("/videos")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Erro ao buscar vídeos:", error);
  });

// ...existing code...
