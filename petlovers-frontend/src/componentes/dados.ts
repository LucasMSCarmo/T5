// Interfaces base
export interface Telefone {
  id?: number;
  numero: string;
  clienteId: number;
}

export interface RG {
  id?: number;
  numero: string;
  dataEmissao: Date;
  clienteId: number;
}

export interface ProdutoConsumido {
  id?: number;
  quantidade: number;
  data: Date;
  petId: number;
  produtoId: number;
  produto: Produto;
}

export interface ServicoConsumido {
  id?: number;
  data: Date;
  petId: number;
  servicoId: number;
  servico: Servico;
}

export interface Pet {
  id: number;
  nome: string;
  tipo: string;
  raca: string;
  genero: string;
  clienteId: number;
  produtosConsumidos: ProdutoConsumido[];
  servicosConsumidos: ServicoConsumido[];
}

export interface Cliente {
  id?: number;
  nome: string;
  nomeSocial?: string;
  email?: string;
  cpf: string;
  rgs: RG[];
  pets: Pet[];
  telefones: Telefone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  tipo: string;
  consumos: ProdutoConsumido[];
}

export interface Servico {
  id?: number;
  nome: string;
  preco: number;
  tipo: string;
  consumos: ServicoConsumido[];
}

// Tipos para operações CRUD
export type CreateCliente = Omit<Cliente, 
  'id' | 'createdAt' | 'updatedAt' | 'rgs' | 'pets' | 'telefones'
> & {
  rgs: Array<Omit<RG, 'id' | 'clienteId'>>;
  telefones: Array<Omit<Telefone, 'id' | 'clienteId'>>;
  pets?: Array<CreatePet>;
};

export type UpdateCliente = Partial<CreateCliente> & { id: number };

export type CreatePet = Omit<Pet, 
  'id' | 'clienteId' | 'produtosConsumidos' | 'servicosConsumidos'
>;

export type UpdatePet = Partial<CreatePet> & { id: number };

export type CreateProduto = Omit<Produto, 'id' | 'consumos'>;
export type UpdateProduto = Partial<CreateProduto> & { id: number };

export type CreateServico = Omit<Servico, 'id' | 'consumos'>;
export type UpdateServico = Partial<CreateServico> & { id: number };

// Tipos para operações de consumo
export type CreateProdutoConsumido = Omit<ProdutoConsumido, 
  'id' | 'data' | 'produto'
> & {
  produtoId: number;
};

export type CreateServicoConsumido = Omit<ServicoConsumido, 
  'id' | 'data' | 'servico'
> & {
  servicoId: number;
};

// Tipos para relatórios
export interface ClienteConsumo {
  clienteId: number;
  clienteNome: string;
  totalGasto: number;
  produtosConsumidos: Array<{
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    total: number;
  }>;
  servicosConsumidos: Array<{
    servicoId: number;
    servicoNome: string;
    quantidade: number;
    total: number;
  }>;
}