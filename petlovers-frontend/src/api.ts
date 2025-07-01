// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export default api;

// Funções específicas para cada endpoint
export const apiClientes = {
  listar: () => api.get('/clientes'),
  criar: (dados: any) => api.post('/clientes', dados),
  atualizar: (id: number, dados: any) => api.put(`/clientes/${id}`, dados),
  excluir: (id: number) => api.delete(`/clientes/${id}`),
  detalhes: (id: number) => api.get(`/clientes/${id}`),
};

export const apiProdutos = {
  listar: () => api.get('/produtos'),
  criar: (dados: any) => api.post('/produtos', dados),
  atualizar: (id: number, dados: any) => api.put(`/produtos/${id}`, dados),
  excluir: (id: number) => api.delete(`/produtos/${id}`),
};

export const apiServicos = {
  listar: () => api.get('/servicos'),
  criar: (dados: any) => api.post('/servicos', dados),
  atualizar: (id: number, dados: any) => api.put(`/servicos/${id}`, dados),
  excluir: (id: number) => api.delete(`/servicos/${id}`),
};

export const apiRegistros = {
  registrarCompra: (dados: any) => api.post('/registrar-compra', dados),
};

export const apiRelatorios = {
  maisConsumidos: () => api.get('/relatorios/mais-consumidos'),
  consumoPets: () => api.get('/relatorios/consumo-por-tipo-raca'),
  topClientesValor: () => api.get('/relatorios/top-clientes-valor'),
  topClientesQuantidade: () => api.get('/relatorios/top-clientes-quantidade'),
};

export const apiPets = {
  criar: (clienteId: number, dados: any) => api.post(`/clientes/${clienteId}/pets`, dados),
  atualizar: (petId: number, dados: any) => api.put(`/pets/${petId}`, dados),
  excluir: (petId: number) => api.delete(`/pets/${petId}`),
};